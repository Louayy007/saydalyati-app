/**
 * Marketplace Listings Service
 * Handles business logic for creating, filtering, and retrieving product/service listings
 */

const prisma = require('../prisma');

// Prisma error codes that can be retried on temporary database issues
const RETRYABLE_PRISMA_CODES = new Set(['P1001', 'P1002']);

/**
 * Execute database action with automatic retry logic
 * Retries on temporary connection failures with exponential backoff
 * @param {Function} action - Async function to execute
 * @param {number} retries - Maximum number of retry attempts (default 6)
 * @param {number} delayMs - Base delay in milliseconds for exponential backoff (default 1000)
 * @returns {*} Result of action
 */
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

/**
 * Transform database listing to API response format
 * Includes owner information for display
 * @param {Object} item - Listing from database
 * @returns {Object} Formatted listing with owner details
 */
function mapListing(item) {
  return {
    id: item.id,
    title: item.title,
    category: item.category,
    type: item.type,           // 'offre' or 'demande'
    quantity: item.quantity,
    unit: item.unit,
    priceDa: item.priceDa,
    urgency: item.urgency,
    wilaya: item.wilaya,
    notes: item.notes,
    status: item.status,
    createdAt: item.createdAt,
    // Include owner info for marketplace display
    owner: {
      userId: item.user.id,
      email: item.user.email,
      fullName: item.user.profile?.fullName || null,
      establishmentName: item.user.profile?.establishmentName || null,
      establishmentType: item.user.profile?.establishmentType || null,
      phone: item.user.profile?.phone || null,
      wilaya: item.user.profile?.wilaya || null,
    },
  };
}

/**
 * List marketplace listings with comprehensive filtering and searching
 * Only returns active listings
 * Supports multiple filter combinations and sorting options
 * @param {Object} query - Query parameters from request
 * @returns {Array} Array of filtered and sorted listings
 */
async function listListings(query) {
  // Build WHERE clause with AND conditions (all must match)
  const and = [{ status: 'active' }]; // Only show active listings

  // Filter by type (offer or request)
  if (query.type && ['offre', 'demande'].includes(query.type)) {
    and.push({ type: query.type });
  }

  // Filter by product category
  if (query.category) {
    and.push({ category: query.category });
  }

  // Filter by urgency level
  if (query.urgentOnly === 'true') {
    // Show only urgent or critical listings
    and.push({ urgency: { in: ['urgent', 'critique'] } });
  } else if (query.urgency && ['normal', 'urgent', 'critique'].includes(query.urgency)) {
    // Filter by specific urgency level
    and.push({ urgency: query.urgency });
  }

  // Filter by location (wilaya)
  if (query.wilaya) {
    // Match either listing's wilaya or owner's wilaya
    and.push({
      OR: [
        { wilaya: query.wilaya },
        {
          user: {
            profile: {
              is: {
                wilaya: query.wilaya,
              },
            },
          },
        },
      ],
    });
  }

  // Filter by establishment type (pharmacy, hospital, lab)
  if (query.ownerType && ['pharmacie', 'hopital', 'labo'].includes(query.ownerType)) {
    and.push({
      user: {
        profile: {
          is: {
            establishmentType: query.ownerType,
          },
        },
      },
    });
  }

  // Full-text search across multiple fields
  if (query.search) {
    and.push({
      OR: [
        { title: { contains: query.search, mode: 'insensitive' } },
        { category: { contains: query.search, mode: 'insensitive' } },
        {
          user: {
            profile: {
              is: {
                establishmentName: { contains: query.search, mode: 'insensitive' },
              },
            },
          },
        },
      ],
    });
  }

  const where = { AND: and };

  // Build ORDER BY clause (default: newest first)
  const orderBy = { createdAt: 'desc' };
  if (query.sort === 'price_asc') orderBy.priceDa = 'asc';
  if (query.sort === 'price_desc') orderBy.priceDa = 'desc';
  if (query.sort === 'qty_desc') orderBy.quantity = 'desc';

  // Execute query with all filters and sorting
  const rows = await runWithDbRetry(() =>
    prisma.listing.findMany({
      where,
      orderBy,
      include: {
        user: {
          include: {
            profile: true, // Include owner's profile information
          },
        },
      },
    })
  );

  // Format response
  return rows.map(mapListing);
}

/**
 * Create a new marketplace listing
 * Listing is created with active status by default
 * User ID is attached automatically (user becomes the owner)
 * @param {string} userId - ID of user creating the listing
 * @param {Object} input - Listing details
 * @returns {Object} Created listing with owner information
 */
async function createListing(userId, input) {
  // Create listing in database
  const created = await runWithDbRetry(() =>
    prisma.listing.create({
      data: {
        userId,                                        // Set current user as owner
        title: input.title,
        category: input.category,
        type: input.type,                              // 'offre' or 'demande'
        quantity: input.quantity,
        unit: input.unit,
        priceDa: input.priceDa ?? null,                // Keep null if not provided
        urgency: input.urgency || 'normal',            // Default to normal urgency
        wilaya: input.wilaya ?? null,
        notes: input.notes ?? null,
        status: input.status || 'active',              // Default to active
      },
      include: {
        user: {
          include: {
            profile: true, // Include owner's profile for response
          },
        },
      },
    })
  );

  return mapListing(created);
}

module.exports = {
  listListings,
  createListing,
};
