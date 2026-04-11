const prisma = require('../prisma');
const { sendEmail } = require('../utils/mailer');

function mapExchangeRequest(row) {
  return {
    id: row.id,
    listingId: row.listingId,
    message: row.message,
    status: row.status,
    createdAt: row.createdAt,
    listing: {
      id: row.listing.id,
      title: row.listing.title,
      category: row.listing.category,
      type: row.listing.type,
      quantity: row.listing.quantity,
      unit: row.listing.unit,
      urgency: row.listing.urgency,
      wilaya: row.listing.wilaya,
      owner: {
        id: row.listing.user.id,
        email: row.listing.user.email,
        fullName: row.listing.user.profile?.fullName || null,
        establishmentName: row.listing.user.profile?.establishmentName || null,
        establishmentType: row.listing.user.profile?.establishmentType || null,
        phone: row.listing.user.profile?.phone || null,
      },
    },
    requester: {
      id: row.requester.id,
      email: row.requester.email,
      fullName: row.requester.profile?.fullName || null,
      establishmentName: row.requester.profile?.establishmentName || null,
      establishmentType: row.requester.profile?.establishmentType || null,
      phone: row.requester.profile?.phone || null,
    },
  };
}

async function createExchangeRequest(requesterUserId, input) {
  const listing = await prisma.listing.findUnique({ where: { id: input.listingId } });
  if (!listing) {
    const error = new Error('Listing not found');
    error.statusCode = 404;
    throw error;
  }

  if (listing.userId === requesterUserId) {
    const error = new Error('You cannot request your own listing');
    error.statusCode = 400;
    throw error;
  }

  const row = await prisma.exchangeRequest.create({
    data: {
      listingId: input.listingId,
      requesterUserId,
      message: input.message || null,
    },
    include: {
      listing: { include: { user: { include: { profile: true } } } },
      requester: { include: { profile: true } },
    },
  });

  const ownerEmail = row.listing.user.email;
  const ownerName = row.listing.user.profile?.fullName || row.listing.user.profile?.establishmentName || 'Proprietaire';
  const requesterName = row.requester.profile?.fullName || row.requester.profile?.establishmentName || row.requester.email;
  const subject = `Nouvelle demande pour ${row.listing.title}`;
  const text = [
    `Bonjour ${ownerName},`,
    '',
    `Vous avez recu une nouvelle demande de contact/commande pour votre annonce: ${row.listing.title}.`,
    `Demandeur: ${requesterName} (${row.requester.email})`,
    `Message: ${row.message || 'Aucun message fourni'}`,
    '',
    'Connectez-vous a Saydalyati pour repondre a la demande.',
  ].join('\n');

  const html = `
    <p>Bonjour ${ownerName},</p>
    <p>Vous avez recu une nouvelle demande de contact/commande pour votre annonce <strong>${row.listing.title}</strong>.</p>
    <p><strong>Demandeur:</strong> ${requesterName} (${row.requester.email})</p>
    <p><strong>Message:</strong> ${row.message || 'Aucun message fourni'}</p>
    <p>Connectez-vous a Saydalyati pour repondre a la demande.</p>
  `;

  await sendEmail({
    to: ownerEmail,
    subject,
    text,
    html,
  });

  return mapExchangeRequest(row);
}

async function getInboxRequests(userId) {
  const rows = await prisma.exchangeRequest.findMany({
    where: {
      listing: {
        userId,
      },
    },
    orderBy: { createdAt: 'desc' },
    include: {
      listing: { include: { user: { include: { profile: true } } } },
      requester: { include: { profile: true } },
    },
  });

  return rows.map(mapExchangeRequest);
}

async function getSentRequests(userId) {
  const rows = await prisma.exchangeRequest.findMany({
    where: { requesterUserId: userId },
    orderBy: { createdAt: 'desc' },
    include: {
      listing: { include: { user: { include: { profile: true } } } },
      requester: { include: { profile: true } },
    },
  });

  return rows.map(mapExchangeRequest);
}

async function updateExchangeRequestStatus(ownerUserId, requestId, status) {
  const row = await prisma.exchangeRequest.findUnique({
    where: { id: requestId },
    include: {
      listing: true,
    },
  });

  if (!row) {
    const error = new Error('Request not found');
    error.statusCode = 404;
    throw error;
  }

  if (row.listing.userId !== ownerUserId) {
    const error = new Error('Forbidden');
    error.statusCode = 403;
    throw error;
  }

  const updated = await prisma.exchangeRequest.update({
    where: { id: requestId },
    data: { status },
    include: {
      listing: { include: { user: { include: { profile: true } } } },
      requester: { include: { profile: true } },
    },
  });

  return mapExchangeRequest(updated);
}

module.exports = {
  createExchangeRequest,
  getInboxRequests,
  getSentRequests,
  updateExchangeRequestStatus,
};
