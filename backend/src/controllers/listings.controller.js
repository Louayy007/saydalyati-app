/**
 * Marketplace Listings Controller
 * Handles endpoints for viewing and creating product/service listings
 * Supports filtering, sorting, and search functionality
 */

const { z } = require('zod');
const { createListing, listListings } = require('../services/listings.service');

/**
 * Listing creation validation schema
 * Defines required fields and their constraints for new listings
 */
const createListingSchema = z.object({
  title: z.string().min(2),                                        // Listing title
  category: z.string().min(2),                                     // Product category
  type: z.enum(['offre', 'demande']),                              // Offer or request
  quantity: z.number().int().positive(),                           // Amount available/needed
  unit: z.string().min(1),                                         // Unit (kg, pieces, etc)
  priceDa: z.number().int().nonnegative().nullable().optional(),   // Price in DA (optional)
  urgency: z.enum(['normal', 'urgent', 'critique']).optional(),    // Urgency level (optional)
  wilaya: z.string().nullable().optional(),                        // Province/region (optional)
  notes: z.string().nullable().optional(),                         // Additional notes (optional)
  status: z.string().optional(),                                   // Active/archived (optional)
});

/**
 * Get marketplace listings with filtering and search
 * Supports filtering by type, category, urgency, location, and owner type
 * Supports sorting by price or quantity
 * @route GET /api/listings
 * @query {string} type - Filter by 'offre' or 'demande'
 * @query {string} category - Filter by category
 * @query {boolean} urgentOnly - Show only urgent/critical
 * @query {string} urgency - Filter by urgency level
 * @query {string} wilaya - Filter by province
 * @query {string} ownerType - Filter by establishment type
 * @query {string} search - Search in title, category, establishment name
 * @query {string} sort - Sort by 'price_asc', 'price_desc', or 'qty_desc'
 */
async function getListings(req, res) {
  try {
    const result = await listListings(req.query);
    return res.json(result);
  } catch (error) {
    // Handle temporary database issues
    if (error?.code === 'P1001' || error?.code === 'P1002') {
      return res.status(503).json({ message: 'Connexion base de donnees indisponible. Reessayez dans quelques secondes.' });
    }
    return res.status(500).json({ message: error.message || 'Failed to fetch listings' });
  }
}

/**
 * Create a new marketplace listing
 * Requires authentication. User becomes the owner of the listing
 * Validates input and delegates to service for business logic
 * @route POST /api/listings
 */
async function postListing(req, res) {
  try {
    // Validate request body
    const parsed = createListingSchema.parse(req.body);
    // Create listing with authenticated user as owner
    const result = await createListing(req.auth.userId, parsed);
    return res.status(201).json(result);
  } catch (error) {
    // Handle validation errors
    if (error.name === 'ZodError') {
      return res.status(400).json({ message: 'Validation failed', issues: error.issues });
    }
    // Handle temporary database issues
    if (error?.code === 'P1001' || error?.code === 'P1002') {
      return res.status(503).json({ message: 'Connexion base de donnees indisponible. Reessayez dans quelques secondes.' });
    }
    return res.status(error.statusCode || 500).json({ message: error.message || 'Failed to create listing' });
  }
}

module.exports = {
  getListings,
  postListing,
};
