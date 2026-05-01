/**
 * Authentication Controller
 * Handles user login and registration requests
 * Validates input and delegates business logic to auth service
 */

const { z } = require('zod');
const { loginUser, registerUser, forgotPassword, resetPassword } = require('../services/auth.service');

/**
 * Registration form validation schema
 * Ensures all required fields are present and properly formatted
 * certificate fields are used for admin approval workflow
 */
const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),                        // Minimum 6 characters
  fullName: z.string().min(2),                        // Person name
  establishmentName: z.string().min(2),               // Pharmacy/Hospital name
  establishmentType: z.enum(['pharmacie', 'hopital', 'labo']), // Business type
  certificateFileName: z.string().min(1),             // Certificate filename
  certificateFileData: z.string().min(20),            // Base64 encoded certificate data
  certificateMimeType: z.string().min(3).optional(),  // File MIME type (optional)
  phone: z.string().min(5).optional(),                // Contact phone (optional)
  wilaya: z.string().min(2).optional(),               // Province/Region (optional)
  address: z.string().min(2).optional(),              // Physical address (optional)
});

/**
 * Login form validation schema
 * Minimal required fields for authentication
 */
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

/**
 * Forgot password request validation schema
 */
const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

/**
 * Reset password validation schema
 */
const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(6),
});

/**
 * Register new user endpoint
 * Validates input, creates user account, and sends approval request to admin
 * New users are marked as 'pending' until admin approval (except admins)
 */
async function register(req, res) {
  try {
    // Validate request body against schema
    const parsed = registerSchema.parse(req.body);
    // Delegate to service layer for user creation
    const result = await registerUser(parsed);
    return res.status(201).json(result);
  } catch (error) {
    // Handle validation errors
    if (error.name === 'ZodError') {
      return res.status(400).json({ message: 'Validation failed', issues: error.issues });
    }
    // Handle database connection errors (retry-able)
    if (error?.code === 'P1001' || error?.code === 'P1002') {
      return res.status(503).json({ message: 'Connexion base de donnees indisponible. Reessayez dans quelques secondes.' });
    }
    // Handle other errors from service
    return res.status(error.statusCode || 500).json({ message: error.message || 'Register failed' });
  }
}

/**
 * User login endpoint
 * Verifies credentials and returns JWT token if valid
 * Users must be approved by admin to login (except administrators)
 */
async function login(req, res) {
  try {
    // Validate request body
    const parsed = loginSchema.parse(req.body);
    // Delegate to service layer for authentication
    const result = await loginUser(parsed);
    return res.json(result);
  } catch (error) {
    // Handle validation errors
    if (error.name === 'ZodError') {
      return res.status(400).json({ message: 'Validation failed', issues: error.issues });
    }
    // Handle database connection errors (retry-able)
    if (error?.code === 'P1001' || error?.code === 'P1002') {
      return res.status(503).json({ message: 'Connexion base de donnees indisponible. Reessayez dans quelques secondes.' });
    }
    // Handle other errors from service (invalid credentials, pending approval, etc)
    return res.status(error.statusCode || 500).json({ message: error.message || 'Login failed' });
  }
}

/**
 * Forgot password endpoint
 * Sends password reset email to user
 * Returns success regardless of whether email exists (security best practice)
 */
async function handleForgotPassword(req, res) {
  try {
    // Validate request body
    const parsed = forgotPasswordSchema.parse(req.body);
    // Delegate to service layer
    const result = await forgotPassword(parsed);
    return res.json(result);
  } catch (error) {
    // Handle validation errors
    if (error.name === 'ZodError') {
      return res.status(400).json({ message: 'Validation failed', issues: error.issues });
    }
    // Handle database connection errors (retry-able)
    if (error?.code === 'P1001' || error?.code === 'P1002') {
      return res.status(503).json({ message: 'Connexion base de donnees indisponible. Reessayez dans quelques secondes.' });
    }
    // Return generic success message for any error (security best practice)
    return res.json({ message: 'Si un compte existe avec cette adresse email, vous recevrez un lien de reinitialisation.' });
  }
}

/**
 * Reset password endpoint
 * Validates reset token and updates password
 */
async function handleResetPassword(req, res) {
  try {
    // Validate request body
    const parsed = resetPasswordSchema.parse(req.body);
    // Delegate to service layer
    const result = await resetPassword(parsed);
    return res.json(result);
  } catch (error) {
    // Handle validation errors
    if (error.name === 'ZodError') {
      return res.status(400).json({ message: 'Validation failed', issues: error.issues });
    }
    // Handle database connection errors (retry-able)
    if (error?.code === 'P1001' || error?.code === 'P1002') {
      return res.status(503).json({ message: 'Connexion base de donnees indisponible. Reessayez dans quelques secondes.' });
    }
    // Handle other errors from service
    return res.status(error.statusCode || 500).json({ message: error.message || 'Reset password failed' });
  }
}

module.exports = {
  register,
  login,
  forgotPassword: handleForgotPassword,
  resetPassword: handleResetPassword,
};
