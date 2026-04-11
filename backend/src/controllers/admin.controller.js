const { z } = require('zod');
const {
  listPendingUsers,
  updateUserApproval,
  listExchangeRequests,
  listUsers,
  getAnalytics,
} = require('../services/admin.service');

const updateApprovalSchema = z.object({
  status: z.enum(['approved', 'rejected']),
});

async function getPendingUsers(_req, res) {
  try {
    const users = await listPendingUsers();
    return res.json(users);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Failed to fetch pending users' });
  }
}

async function patchUserApproval(req, res) {
  try {
    const parsed = updateApprovalSchema.parse(req.body);
    const updated = await updateUserApproval(req.params.id, parsed.status);
    return res.json(updated);
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ message: 'Validation failed', issues: error.issues });
    }
    return res.status(error.statusCode || 500).json({ message: error.message || 'Failed to update approval' });
  }
}

async function getExchangeRequests(_req, res) {
  try {
    const rows = await listExchangeRequests();
    return res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Failed to fetch exchange requests' });
  }
}

async function getUsers(req, res) {
  try {
    const status = typeof req.query.status === 'string' ? req.query.status : undefined;
    const search = typeof req.query.search === 'string' ? req.query.search : undefined;
    const users = await listUsers({ status, search });
    return res.json(users);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Failed to fetch users' });
  }
}

async function getAnalyticsSummary(_req, res) {
  try {
    const summary = await getAnalytics();
    return res.json(summary);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Failed to fetch analytics' });
  }
}

module.exports = {
  getPendingUsers,
  patchUserApproval,
  getExchangeRequests,
  getUsers,
  getAnalyticsSummary,
};
