/**
 * Exchange Requests Controller
 * Handles endpoints for creating and managing exchange/contact requests between users
 * Users request to exchange products with other users' listings
 */

const { z } = require('zod');
const { createExchangeRequest, getInboxRequests, getSentRequests, updateExchangeRequestStatus } = require('../services/exchangeRequests.service');

/**
 * Create new exchange request validation schema
 */
const createSchema = z.object({
  listingId: z.string().min(1),           // ID of listing being requested
  message: z.string().min(1).optional(),  // Optional message (optional)
});

/**
 * Update exchange request status validation schema
 */
const updateStatusSchema = z.object({
  status: z.enum(['accepted', 'rejected']), // Accept or reject the request
});

/**
 * 
 * Create a new exchange request
 * Sends request to listing owner and notifies via email
 * Authenticated user becomes the requester
 * @route POST /api/exchange-requests
 */
async function createRequest(req, res) {
  try {
    // Validate request body
    const parsed = createSchema.parse(req.body);
    // Create exchange request and send notification email
    const result = await createExchangeRequest(req.auth.userId, parsed);
    return res.status(201).json(result);
  } catch (error) {
    // Handle validation errors
    if (error.name === 'ZodError') {
      return res.status(400).json({ message: 'Validation failed', issues: error.issues });
    }
    return res.status(error.statusCode || 500).json({ message: error.message || 'Failed to create request' });
  }
}

/**
 * Get incoming exchange requests (requests sent TO the authenticated user)
 * Shows requests from other users for the authenticated user's listings
 * @route GET /api/exchange-requests/inbox
 */
async function inbox(req, res) {
  try {
    const result = await getInboxRequests(req.auth.userId);
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Failed to fetch inbox requests' });
  }
}

/**
 * Get sent exchange requests (requests sent BY the authenticated user)
 * Shows requests the authenticated user has made
 * @route GET /api/exchange-requests/sent
 */
async function sent(req, res) {
  try {
    const result = await getSentRequests(req.auth.userId);
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Failed to fetch sent requests' });
  }
}

/**
 * Update exchange request status (accept/reject)
 * Only the listing owner can update the status of requests on their listings
 * @route PATCH /api/exchange-requests/:id
 * @body {string} status - 'accepted' or 'rejected'
 */
async function updateStatus(req, res) {
  try {
    // Validate request body
    const parsed = updateStatusSchema.parse(req.body);
    // Update request status (requester ID, request ID, new status)
    const result = await updateExchangeRequestStatus(req.auth.userId, req.params.id, parsed.status);
    return res.json(result);
  } catch (error) {
    // Handle validation errors
    if (error.name === 'ZodError') {
      return res.status(400).json({ message: 'Validation failed', issues: error.issues });
    }
    return res.status(error.statusCode || 500).json({ message: error.message || 'Failed to update request status' });
  }
}

module.exports = {
  createRequest,
  inbox,
  sent,
  updateStatus,
};
