const { z } = require('zod');
const { getMyProfile, updateMyProfile } = require('../services/profile.service');

const updateProfileSchema = z.object({
  fullName: z.string().min(2).optional(),
  establishmentName: z.string().min(2).optional(),
  establishmentType: z.enum(['pharmacie', 'hopital', 'labo']).optional(),
  phone: z.string().min(5).nullable().optional(),
  wilaya: z.string().min(2).nullable().optional(),
  address: z.string().min(2).nullable().optional(),
  avatarUrl: z.string().min(1).nullable().optional(),
});

async function me(req, res) {
  try {
    const userId = req.auth.userId;
    const result = await getMyProfile(userId);
    return res.json(result);
  } catch (error) {
    if (error?.code === 'P1001' || error?.code === 'P1002') {
      return res.status(503).json({ message: 'Connexion base de donnees indisponible. Reessayez dans quelques secondes.' });
    }
    return res.status(error.statusCode || 500).json({ message: error.message || 'Failed to load profile' });
  }
}

async function updateMe(req, res) {
  try {
    const userId = req.auth.userId;
    const parsed = updateProfileSchema.parse(req.body);
    const result = await updateMyProfile(userId, parsed);
    return res.json(result);
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ message: 'Validation failed', issues: error.issues });
    }
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
