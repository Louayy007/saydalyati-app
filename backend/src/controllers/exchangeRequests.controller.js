const { z } = require('zod');
const { createExchangeRequest, getInboxRequests, getSentRequests, updateExchangeRequestStatus } = require('../services/exchangeRequests.service');

const createSchema = z.object({
  listingId: z.string().min(1),
  message: z.string().min(1).optional(),
});

const updateStatusSchema = z.object({
  status: z.enum(['accepted', 'rejected']),
});

async function createRequest(req, res) {
  try {
    const parsed = createSchema.parse(req.body);
    const result = await createExchangeRequest(req.auth.userId, parsed);
    return res.status(201).json(result);
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ message: 'Validation failed', issues: error.issues });
    }
    return res.status(error.statusCode || 500).json({ message: error.message || 'Failed to create request' });
  }
}

async function inbox(req, res) {
  try {
    const result = await getInboxRequests(req.auth.userId);
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Failed to fetch inbox requests' });
  }
}

async function sent(req, res) {
  try {
    const result = await getSentRequests(req.auth.userId);
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Failed to fetch sent requests' });
  }
}

async function updateStatus(req, res) {
  try {
    const parsed = updateStatusSchema.parse(req.body);
    const result = await updateExchangeRequestStatus(req.auth.userId, req.params.id, parsed.status);
    return res.json(result);
  } catch (error) {
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
