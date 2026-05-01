/**
 * Exchange Requests Service
 * Handles business logic for creating and managing exchange requests
 * Manages communication between potential exchangers via email notifications
 */

const prisma = require('../prisma');
const { sendEmail } = require('../utils/mailer');

/**
 * Transform database exchange request to API response format
 * Includes full details about the listing and both parties
 * @param {Object} row - Exchange request from database
 * @returns {Object} Formatted exchange request for API response
 */
function mapExchangeRequest(row) {
  return {
    id: row.id,
    listingId: row.listingId,
    message: row.message,
    status: row.status,
    createdAt: row.createdAt,
    // Include listing details for frontend display
    listing: {
      id: row.listing.id,
      title: row.listing.title,
      category: row.listing.category,
      type: row.listing.type,
      quantity: row.listing.quantity,
      unit: row.listing.unit,
      urgency: row.listing.urgency,
      wilaya: row.listing.wilaya,
      // Include listing owner (product provider)
      owner: {
        id: row.listing.user.id,
        email: row.listing.user.email,
        fullName: row.listing.user.profile?.fullName || null,
        establishmentName: row.listing.user.profile?.establishmentName || null,
        establishmentType: row.listing.user.profile?.establishmentType || null,
        phone: row.listing.user.profile?.phone || null,
      },
    },
    // Include requester info (person requesting the exchange)
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

/**
 * Create a new exchange request
 * Validates listing and requester, creates request, and sends email notification
 * Cannot request own listing
 * @param {string} requesterUserId - ID of user making the request
 * @param {Object} input - Request data (listingId, message)
 * @returns {Object} Created exchange request
 * @throws {Error} If listing not found or user requests own listing
 */
async function createExchangeRequest(requesterUserId, input) {
  // Verify listing exists
  const listing = await prisma.listing.findUnique({ where: { id: input.listingId } });
  if (!listing) {
    const error = new Error('Listing not found');
    error.statusCode = 404;
    throw error;
  }

  // Prevent users from requesting their own listings
  if (listing.userId === requesterUserId) {
    const error = new Error('You cannot request your own listing');
    error.statusCode = 400;
    throw error;
  }

  // Create exchange request in database
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

  // Send email notification to listing owner
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

  // Send email asynchronously (don't wait for it)
  await sendEmail({
    to: ownerEmail,
    subject,
    text,
    html,
  });

  return mapExchangeRequest(row);
}

/**
 * Get incoming exchange requests for a user
 * Returns requests received ON the user's listings
 * @param {string} userId - User ID to fetch inbox for
 * @returns {Array} Array of received exchange requests
 */
async function getInboxRequests(userId) {
  const rows = await prisma.exchangeRequest.findMany({
    where: {
      listing: {
        userId, // Find requests for this user's listings
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

/**
 * Get sent exchange requests from a user
 * Returns requests made BY the user to other users' listings
 * @param {string} userId - User ID to fetch sent requests for
 * @returns {Array} Array of sent exchange requests
 */
async function getSentRequests(userId) {
  const rows = await prisma.exchangeRequest.findMany({
    where: { requesterUserId: userId }, // Find requests made by this user
    orderBy: { createdAt: 'desc' },
    include: {
      listing: { include: { user: { include: { profile: true } } } },
      requester: { include: { profile: true } },
    },
  });

  return rows.map(mapExchangeRequest);
}

/**
 * Update exchange request status (accept/reject)
 * Only listing owner can update request status
 * @param {string} ownerUserId - ID of listing owner
 * @param {string} requestId - ID of exchange request to update
 * @param {string} status - New status ('accepted' or 'rejected')
 * @returns {Object} Updated exchange request
 * @throws {Error} If request not found or user is not the listing owner
 */
async function updateExchangeRequestStatus(ownerUserId, requestId, status) {
  // Fetch request with listing information
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

  // Verify only listing owner can update the request
  if (row.listing.userId !== ownerUserId) {
    const error = new Error('Forbidden');
    error.statusCode = 403;
    throw error;
  }

  // Update request status
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
