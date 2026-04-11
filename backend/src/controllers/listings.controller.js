const { z } = require('zod');
const { createListing, listListings } = require('../services/listings.service');

const createListingSchema = z.object({
  title: z.string().min(2),
  category: z.string().min(2),
  type: z.enum(['offre', 'demande']),
  quantity: z.number().int().positive(),
  unit: z.string().min(1),
  priceDa: z.number().int().nonnegative().nullable().optional(),
  urgency: z.enum(['normal', 'urgent', 'critique']).optional(),
  wilaya: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  status: z.string().optional(),
});

async function getListings(req, res) {
  try {
    const result = await listListings(req.query);
    return res.json(result);
  } catch (error) {
    if (error?.code === 'P1001' || error?.code === 'P1002') {
      return res.status(503).json({ message: 'Connexion base de donnees indisponible. Reessayez dans quelques secondes.' });
    }
    return res.status(500).json({ message: error.message || 'Failed to fetch listings' });
  }
}

async function postListing(req, res) {
  try {
    const parsed = createListingSchema.parse(req.body);
    const result = await createListing(req.auth.userId, parsed);
    return res.status(201).json(result);
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ message: 'Validation failed', issues: error.issues });
    }
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
