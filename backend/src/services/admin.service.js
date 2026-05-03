const prisma = require('../prisma');

function mapUser(user) {
  return {
    id: user.id,
    email: user.email,
    role: user.role,
    approvalStatus: user.approvalStatus,
    approvedAt: user.approvedAt,
    createdAt: user.createdAt,
    profile: {
      fullName: user.profile?.fullName || null,
      establishmentName: user.profile?.establishmentName || null,
      establishmentType: user.profile?.establishmentType || null,
      certificateFileName: user.profile?.certificateFileName || null,
      certificateFileData: user.profile?.certificateFileData || null,
      certificateMimeType: user.profile?.certificateMimeType || null,
      phone: user.profile?.phone || null,
      wilaya: user.profile?.wilaya || null,
    },
  };
}

const RETRYABLE_PRISMA_CODES = new Set(['P1001', 'P1002']);

async function runWithDbRetry(action, retries = 6, delayMs = 1000) {
  let lastError;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      return await action();
    } catch (error) {
      lastError = error;
      const isRetryable = RETRYABLE_PRISMA_CODES.has(error?.code);
      if (!isRetryable || attempt === retries) {
        break;
      }

      await new Promise((resolve) => setTimeout(resolve, delayMs * (attempt + 1)));
    }
  }

  throw lastError;
}

async function listPendingUsers() {
  const rows = await runWithDbRetry(() =>
    prisma.waitingList.findMany({
      orderBy: { createdAt: 'desc' },
    })
  );

  return rows.map((row) => ({
    id: row.id,
    email: row.email,
    fullName: row.fullName,
    establishmentName: row.establishmentName,
    establishmentType: row.establishmentType,
    phone: row.phone,
    wilaya: row.wilaya,
    createdAt: row.createdAt,
  }));
}

async function approveFromWaitingList(waitingId) {
  const waiting = await runWithDbRetry(() =>
    prisma.waitingList.findUnique({ where: { id: waitingId } })
  );

  if (!waiting) {
    const error = new Error('User not found in waiting list');
    error.statusCode = 404;
    throw error;
  }

  const existing = await runWithDbRetry(() =>
    prisma.user.findUnique({ where: { email: waiting.email } })
  );

  if (existing) {
    const error = new Error('Cet email existe déjà dans les users.');
    error.statusCode = 409;
    throw error;
  }

  const user = await runWithDbRetry(() =>
    prisma.user.create({
      data: {
        email: waiting.email,
        passwordHash: waiting.passwordHash,
        role: 'usersimple',
        approvalStatus: 'approved',
        approvedAt: new Date(),
        profile: {
          create: {
            fullName: waiting.fullName,
            establishmentName: waiting.establishmentName,
            establishmentType: waiting.establishmentType,
            certificateFileName: waiting.certificateFileName,
            certificateFileData: waiting.certificateFileData,
            certificateMimeType: waiting.certificateMimeType || null,
            phone: waiting.phone || null,
            wilaya: waiting.wilaya || null,
            address: waiting.address || null,
          },
        },
      },
      include: { profile: true },
    })
  );

  await runWithDbRetry(() =>
    prisma.waitingList.delete({ where: { id: waitingId } })
  );

  return mapUser(user);
}

async function rejectFromWaitingList(waitingId) {
  const waiting = await runWithDbRetry(() =>
    prisma.waitingList.findUnique({ where: { id: waitingId } })
  );

  if (!waiting) {
    const error = new Error('User not found in waiting list');
    error.statusCode = 404;
    throw error;
  }

  await runWithDbRetry(() =>
    prisma.waitingList.delete({ where: { id: waitingId } })
  );

  return { message: 'User rejected and removed from waiting list' };
}

async function updateUserApproval(userId, status) {
  const existing = await runWithDbRetry(() =>
    prisma.user.findUnique({ where: { id: userId } })
  );

  if (!existing) {
    const error = new Error('Utilisateur introuvable');
    error.statusCode = 404;
    throw error;
  }

  if (existing.role === 'administrator') {
    const error = new Error('Impossible de modifier un compte administrateur');
    error.statusCode = 400;
    throw error;
  }

  const updated = await runWithDbRetry(() =>
    prisma.user.update({
      where: { id: userId },
      data: {
        approvalStatus: status,
        approvedAt: status === 'approved' ? new Date() : null,
      },
      include: { profile: true },
    })
  );

  return mapUser(updated);
}

async function listExchangeRequests(limit = 50) {
  const rows = await runWithDbRetry(() =>
    prisma.exchangeRequest.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        listing: {
          include: {
            user: {
              include: { profile: true },
            },
          },
        },
        requester: {
          include: { profile: true },
        },
      },
    })
  );

  return rows.map((row) => ({
    id: row.id,
    status: row.status,
    message: row.message,
    createdAt: row.createdAt,
    listing: {
      id: row.listing.id,
      title: row.listing.title,
      type: row.listing.type,
      owner: {
        id: row.listing.user.id,
        email: row.listing.user.email,
        establishmentName: row.listing.user.profile?.establishmentName || null,
      },
    },
    requester: {
      id: row.requester.id,
      email: row.requester.email,
      establishmentName: row.requester.profile?.establishmentName || null,
    },
  }));
}

async function listUsers({ status, search } = {}) {
  const term = search && search.trim() ? search.trim() : null;

  const userWhere = { role: 'usersimple' };
  if (status === 'approved' || status === 'rejected') {
    userWhere.approvalStatus = status;
  }
  if (term) {
    userWhere.OR = [
      { email: { contains: term, mode: 'insensitive' } },
      { profile: { fullName: { contains: term, mode: 'insensitive' } } },
      { profile: { establishmentName: { contains: term, mode: 'insensitive' } } },
      { profile: { wilaya: { contains: term, mode: 'insensitive' } } },
    ];
  }

  const waitingWhere = {};
  if (term) {
    waitingWhere.OR = [
      { email: { contains: term, mode: 'insensitive' } },
      { fullName: { contains: term, mode: 'insensitive' } },
      { establishmentName: { contains: term, mode: 'insensitive' } },
      { wilaya: { contains: term, mode: 'insensitive' } },
    ];
  }

  const skipUsers = status === 'pending';
  const skipWaiting = status === 'approved' || status === 'rejected';

  const [userRows, waitingRows] = await Promise.all([
    skipUsers
      ? Promise.resolve([])
      : runWithDbRetry(() =>
          prisma.user.findMany({
            where: userWhere,
            orderBy: { createdAt: 'desc' },
            include: { profile: true },
          })
        ),
    skipWaiting
      ? Promise.resolve([])
      : runWithDbRetry(() =>
          prisma.waitingList.findMany({
            where: waitingWhere,
            orderBy: { createdAt: 'desc' },
          })
        ),
  ]);

  const mappedUsers = userRows.map(mapUser);

  const mappedWaiting = waitingRows.map((w) => ({
    id: w.id,
    email: w.email,
    role: 'usersimple',
    approvalStatus: 'pending',
    approvedAt: null,
    createdAt: w.createdAt,
    isWaiting: true,
    profile: {
      fullName: w.fullName || null,
      establishmentName: w.establishmentName || null,
      establishmentType: w.establishmentType || null,
      certificateFileName: w.certificateFileName || null,
      certificateFileData: w.certificateFileData || null,
      certificateMimeType: w.certificateMimeType || null,
      phone: w.phone || null,
      wilaya: w.wilaya || null,
    },
  }));

  return [...mappedWaiting, ...mappedUsers];
}

async function getAnalytics() {
  const [
    totalUsers,
    approvedUsers,
    rejectedUsers,
    waitingListCount,
    totalListings,
    totalRequests,
    pendingRequests,
    acceptedRequests,
  ] = await Promise.all([
    runWithDbRetry(() => prisma.user.count({ where: { role: 'usersimple' } })),
    runWithDbRetry(() => prisma.user.count({ where: { role: 'usersimple', approvalStatus: 'approved' } })),
    runWithDbRetry(() => prisma.user.count({ where: { role: 'usersimple', approvalStatus: 'rejected' } })),
    runWithDbRetry(() => prisma.waitingList.count()),
    runWithDbRetry(() => prisma.listing.count()),
    runWithDbRetry(() => prisma.exchangeRequest.count()),
    runWithDbRetry(() => prisma.exchangeRequest.count({ where: { status: 'pending' } })),
    runWithDbRetry(() => prisma.exchangeRequest.count({ where: { status: 'accepted' } })),
  ]);

  return {
    totalUsers,
    approvedUsers,
    rejectedUsers,
    waitingListCount,
    totalListings,
    totalRequests,
    pendingRequests,
    acceptedRequests,
  };
}

async function listAllListings() {
  const rows = await runWithDbRetry(() =>
    prisma.listing.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: { include: { profile: true } },
      },
    })
  );

  return rows.map((item) => ({
    id: item.id,
    title: item.title,
    category: item.category,
    type: item.type,
    quantity: item.quantity,
    unit: item.unit,
    urgency: item.urgency,
    wilaya: item.wilaya,
    status: item.status,
    createdAt: item.createdAt,
    owner: {
      id: item.user.id,
      email: item.user.email,
      establishmentName: item.user.profile?.establishmentName || null,
      establishmentType: item.user.profile?.establishmentType || null,
    },
  }));
}

async function deleteListing(listingId) {
  const existing = await runWithDbRetry(() =>
    prisma.listing.findUnique({ where: { id: listingId } })
  );

  if (!existing) {
    const error = new Error('Annonce introuvable');
    error.statusCode = 404;
    throw error;
  }

  await runWithDbRetry(() =>
    prisma.listing.delete({ where: { id: listingId } })
  );

  return { message: 'Annonce supprimée avec succès' };
}

async function removeUser(userId) {
  const existing = await runWithDbRetry(() =>
    prisma.user.findUnique({ where: { id: userId } })
  );

  if (!existing) {
    const error = new Error('Utilisateur introuvable');
    error.statusCode = 404;
    throw error;
  }

  if (existing.role === 'administrator') {
    const error = new Error('Impossible de supprimer un compte administrateur');
    error.statusCode = 400;
    throw error;
  }

  // onDelete: Cascade in schema handles Profile, Listing, ExchangeRequest automatically
  await runWithDbRetry(() =>
    prisma.user.delete({ where: { id: userId } })
  );

  return { message: 'Utilisateur supprimé avec succès' };
}

module.exports = {
  listPendingUsers,
  approveFromWaitingList,
  rejectFromWaitingList,
  updateUserApproval,
  listExchangeRequests,
  listUsers,
  getAnalytics,
  listAllListings,
  deleteListing,
  removeUser,
};