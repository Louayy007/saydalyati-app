const { z } = require('zod');
const { loginUser, registerUser } = require('../services/auth.service');

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  fullName: z.string().min(2),
  establishmentName: z.string().min(2),
  establishmentType: z.enum(['pharmacie', 'hopital', 'labo']),
  certificateFileName: z.string().min(1),
  certificateFileData: z.string().min(20),
  certificateMimeType: z.string().min(3).optional(),
  phone: z.string().min(5).optional(),
  wilaya: z.string().min(2).optional(),
  address: z.string().min(2).optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

async function register(req, res) {
  try {
    const parsed = registerSchema.parse(req.body);
    const result = await registerUser(parsed);
    return res.status(201).json(result);
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ message: 'Validation failed', issues: error.issues });
    }
    if (error?.code === 'P1001' || error?.code === 'P1002') {
      return res.status(503).json({ message: 'Connexion base de donnees indisponible. Reessayez dans quelques secondes.' });
    }
    return res.status(error.statusCode || 500).json({ message: error.message || 'Register failed' });
  }
}

async function login(req, res) {
  try {
    const parsed = loginSchema.parse(req.body);
    const result = await loginUser(parsed);
    return res.json(result);
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ message: 'Validation failed', issues: error.issues });
    }
    if (error?.code === 'P1001' || error?.code === 'P1002') {
      return res.status(503).json({ message: 'Connexion base de donnees indisponible. Reessayez dans quelques secondes.' });
    }
    return res.status(error.statusCode || 500).json({ message: error.message || 'Login failed' });
  }
}

module.exports = {
  register,
  login,
};
