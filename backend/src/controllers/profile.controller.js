/**
 * User Profile Controller
 * Handles endpoints for retrieving and updating user profile information
 */

const { z } = require('zod');
const { getMyProfile, updateMyProfile } = require('../services/profile.service');

/**
 * Profile update validation schema
 * All fields are optional to allow partial updates
 */
const updateProfileSchema = z.object({
  fullName: z.string().min(2).optional(),
  establishmentName: z.string().min(2).optional(),
  establishmentType: z.enum(['pharmacie', 'hopital', 'labo']).optional(),
  phone: z.string().min(5).nullable().optional(),
  wilaya: z.string().min(2).nullable().optional(),
  address: z.string().min(2).nullable().optional(),
  avatarUrl: z.string().min(1).nullable().optional(),
});

/**
 * Get current user's profile
 * Requires authentication via JWT token
 * @route GET /api/profile/me
 */
async function me(req, res) {
  try {
    const userId = req.auth.userId; // From auth middleware
    const result = await getMyProfile(userId);
    return res.json(result);
  } catch (error) {
    // Handle temporary database issues
    if (error?.code === 'P1001' || error?.code === 'P1002') {
      return res.status(503).json({ message: 'Connexion base de donnees indisponible. Reessayez dans quelques secondes.' });
    }
    return res.status(error.statusCode || 500).json({ message: error.message || 'Failed to load profile' });
  }
}

/**
 * Update current user's profile
 * Requires authentication via JWT token
 * Validates input before updating
 * @route PATCH /api/profile/me
 */
async function updateMe(req, res) {
  try {
    const userId = req.auth.userId; // From auth middleware
    // Validate update payload
    const parsed = updateProfileSchema.parse(req.body);
    const result = await updateMyProfile(userId, parsed);
    return res.json(result);
  } catch (error) {
    // Handle validation errors
    if (error.name === 'ZodError') {
      return res.status(400).json({ message: 'Validation failed', issues: error.issues });
    }
    // Handle temporary database issues
    if (error?.code === 'P1001' || error?.code === 'P1002') {
      return res.status(503).json({ message: 'Connexion base de donnees indisponible. Reessayez dans quelques secondes.' });
    }
    return res.status(error.statusCode || 500).json({ message: error.message || 'Failed to update profile' });
  }
}

module.exports = {
  me,
  updateMe,
};
