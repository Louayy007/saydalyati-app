/**
 * Saydalyati Backend Server
 * Main Express application entry point
 * Configures middleware, routes, and establishes database connection
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Import route handlers
const authRoutes = require('./routes/auth.routes');
const profileRoutes = require('./routes/profile.routes');
const listingsRoutes = require('./routes/listings.routes');
const exchangeRequestsRoutes = require('./routes/exchangeRequests.routes');
const adminRoutes = require('./routes/admin.routes');

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Initialize Prisma ORM for database connectivity
const prisma = require('./prisma');

// Initialize Express application
const app = express();

// Define allowed origins for CORS (development endpoints)
const allowedOrigins = [
  'http://localhost:5173',      // Vite dev server - main
  'http://127.0.0.1:5173',      // Vite dev server - localhost
  'http://localhost:4173',      // Vite preview server
  'http://127.0.0.1:4173',      // Vite preview server - localhost
  'http://localhost:3000',      // Alternative dev port
  'http://127.0.0.1:3000',      // Alternative dev port - localhost
];

// Configure CORS options to allow requests from approved origins only
const corsOptions = {
  // Check if request origin is in allowedOrigins list
  origin(origin, callback) {
    // Allow requests without origin (like mobile apps or Postman)
    if (!origin) {
      callback(null, true);
      return;
    }

    // Allow if origin is in whitelist
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    // Reject if origin not whitelisted
    callback(new Error('Not allowed by CORS'));
  },
  // HTTP methods allowed from cross-origin requests
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  // Headers allowed in CORS requests (needed for auth tokens)
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Parse JSON request bodies (limit set to 10MB for certificate uploads)
app.use(express.json({ limit: '10mb' }));

// Register API route handlers
app.use('/api/auth', authRoutes);                    // Authentication endpoints
app.use('/api/profile', profileRoutes);              // User profile endpoints
app.use('/api/listings', listingsRoutes);            // Marketplace listings endpoints
app.use('/api/exchange-requests', exchangeRequestsRoutes); // Exchange requests endpoints
app.use('/api/admin', adminRoutes);                  // Admin control panel endpoints

/**
 * Health check endpoint
 * Verifies that both API and database are operational
 * Used for monitoring and load balancer health checks
 */
app.get('/api/health', async (_req, res) => {
  try {
    // Test database connection with simple query
    await prisma.$queryRaw`SELECT 1`;
    res.json({ ok: true, message: 'API and DB are connected' });
  } catch (error) {
    // Return error if database is unreachable
    res.status(500).json({ ok: false, message: 'Database connection failed', error: error.message });
  }
});

// Start server on configured port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
