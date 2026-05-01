/**
 * Admin Service
 * Handles business logic for admin panel operations
 * User approval workflow, user management, and analytics
 */

const prisma = require('../prisma');

/**
 * Transform database user to admin response format
 * Includes profile and approval information
 * @param {Object} user - User object from database
 * @returns {Object} Formatted user for admin panel
 */
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
      certificateFileData: user.profile?.certificateFileData || null, // Admin can view certificates
      certificateMimeType: user.profile?.certificateMimeType || null,
      phone: user.profile?.phone || null,
      wilaya: user.profile?.wilaya || null,
    },
  };
}

/**
 * Get all users pending admin approval
 * Only returns non-admin users with 'pending' approval status
 * Ordered by creation date (newest first)
 * @returns {Array} Array of pending users
 */
async function listPendingUsers() {
  const rows = await prisma.user.findMany({
    where: {
      role: 'usersimple',        // Exclude administrators
      approvalStatus: 'pending', // Only pending approvals
    },
    orderBy: { createdAt: 'desc' }, // Newest first
    include: { profile: true },     // Include profile data
  });

  return rows.map(mapUser);
}

/**
 * Update user approval status
 * Prevents modification of admin accounts
 * Sets approvedAt timestamp when approving
 * @param {string} userId - User ID to update
 * @param {string} status - 'approved' or 'rejected'
 * @returns {Object} Updated user
 * @throws {Error} If user not found or trying to modify admin
 */
async function updateUserApproval(userId, status) {
  // Verify user exists
  const existing = await prisma.user.findUnique({ where: { id: userId } });
  if (!existing) {
    const error = new Error('Utilisateur introuvable');
    error.statusCode = 404;
    throw error;
  }

  // Prevent modification of admin accounts
  if (existing.role === 'administrator') {
    const error = new Error('Impossible de modifier un compte administrateur');
    error.statusCode = 400;
    throw error;
  }

  // Update approval status
  const updated = await prisma.user.update({
    where: { id: userId },
    data: {
      approvalStatus: status,
      // Set approvedAt timestamp when approving, clear if rejecting
      approvedAt: status === 'approved' ? new Date() : null,
    },
    include: { profile: true },
  });

  return mapUser(updated);
}

/**
 * Get recent exchange requests for admin dashboard
 * Shows all exchange activity with user and listing details
 * Limited to last 50 requests
 * @param {number} limit - Maximum number of requests to return (default 50)
 * @returns {Array} Array of recent exchange requests
 */
async function listExchangeRequests(limit = 50) {
  const rows = await prisma.exchangeRequest.findMany({
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: {
      listing: {
        include: {
          user: {
            include: { profile: true }, // Include listing owner's profile
          },
        },
      },
      requester: {
        include: { profile: true },    // Include requester's profile
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

/**
 * List all non-admin users with optional filtering and search
 * Supports filtering by approval status and searching across multiple fields
 * @param {Object} options - Query options
 * @param {string} options.status - Filter by 'pending', 'approved', or 'rejected'
 * @param {string} options.search - Search by email, name, establishment, or region
 * @returns {Array} Array of users matching criteria
 */
async function listUsers({ status, search } = {}) {
  const where = {
    role: 'usersimple', // Exclude administrators
  };

  // Add approval status filter if provided
  if (status && ['pending', 'approved', 'rejected'].includes(status)) {
    where.approvalStatus = status;
  }

  // Add search filter if provided
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

/**
 * Get platform analytics and statistics
 * Provides aggregate data about users, listings, and exchange requests
 * Used for admin dashboard summary cards
 * @returns {Object} Analytics summary with counts
 */
async function getAnalytics() {
  // Run all count queries in parallel for performance
  const [
    totalUsers,        // Total non-admin users
    pendingUsers,      // Users awaiting approval
    approvedUsers,     // Approved and active users
    rejectedUsers,     // Rejected registration requests
    totalListings,     // Total marketplace listings
    totalRequests,     // Total exchange requests
    pendingRequests,   // Exchange requests awaiting response
    acceptedRequests,  // Accepted exchange requests
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
