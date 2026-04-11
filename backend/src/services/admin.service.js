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

async function listPendingUsers() {
  const rows = await prisma.user.findMany({
    where: {
      role: 'usersimple',
      approvalStatus: 'pending',
    },
    orderBy: { createdAt: 'desc' },
    include: { profile: true },
  });

  return rows.map(mapUser);
}

async function updateUserApproval(userId, status) {
  const existing = await prisma.user.findUnique({ where: { id: userId } });
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

  const updated = await prisma.user.update({
    where: { id: userId },
    data: {
      approvalStatus: status,
      approvedAt: status === 'approved' ? new Date() : null,
    },
    include: { profile: true },
  });

  return mapUser(updated);
}

async function listExchangeRequests(limit = 50) {
  const rows = await prisma.exchangeRequest.findMany({
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
  });

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
  const where = {
    role: 'usersimple',
  };

  if (status && ['pending', 'approved', 'rejected'].includes(status)) {
    where.approvalStatus = status;
  }

  if (search && search.trim()) {
    const term = search.trim();
    where.OR = [
      { email: { contains: term, mode: 'insensitive' } },
      { profile: { fullName: { contains: term, mode: 'insensitive' } } },
      { profile: { establishmentName: { contains: term, mode: 'insensitive' } } },
      { profile: { wilaya: { contains: term, mode: 'insensitive' } } },
    ];
  }

  const rows = await prisma.user.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: { profile: true },
  });

  return rows.map(mapUser);
}

async function getAnalytics() {
  const [
    totalUsers,
    pendingUsers,
    approvedUsers,
    rejectedUsers,
    totalListings,
    totalRequests,
    pendingRequests,
    acceptedRequests,
  ] = await Promise.all([
    prisma.user.count({ where: { role: 'usersimple' } }),
    prisma.user.count({ where: { role: 'usersimple', approvalStatus: 'pending' } }),
    prisma.user.count({ where: { role: 'usersimple', approvalStatus: 'approved' } }),
    prisma.user.count({ where: { role: 'usersimple', approvalStatus: 'rejected' } }),
    prisma.listing.count(),
    prisma.exchangeRequest.count(),
    prisma.exchangeRequest.count({ where: { status: 'pending' } }),
    prisma.exchangeRequest.count({ where: { status: 'accepted' } }),
  ]);

  return {
    totalUsers,
    pendingUsers,
    approvedUsers,
    rejectedUsers,
    totalListings,
    totalRequests,
    pendingRequests,
    acceptedRequests,
  };
}

module.exports = {
  listPendingUsers,
  updateUserApproval,
  listExchangeRequests,
  listUsers,
  getAnalytics,
};
