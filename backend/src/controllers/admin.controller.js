const { z } = require('zod');
const {
  listPendingUsers,
  approveFromWaitingList,
  rejectFromWaitingList,
  updateUserApproval,
  listExchangeRequests,
  listUsers,
  getAnalytics,
  listAllListings,
  deleteListing,
  removeUser,
} = require('../services/admin.service');

const getPendingUsers = async (_req, res) => {
  try {
    const users = await listPendingUsers();
    return res.json(users);
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};

const approvePendingUser = async (req, res) => {
  try {
    const { waitingId } = req.params;
    const user = await approveFromWaitingList(waitingId);
    return res.json({ message: 'User approved and moved to users list', user });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};

const rejectPendingUser = async (req, res) => {
  try {
    const { waitingId } = req.params;
    const result = await rejectFromWaitingList(waitingId);
    return res.json(result);
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};

const updateApprovalStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = z.object({
      status: z.enum(['approved', 'rejected']),
    }).parse(req.body);
    const user = await updateUserApproval(userId, status);
    return res.json(user);
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ message: 'Validation failed', issues: error.issues });
    }
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};

const getExchangeRequests = async (_req, res) => {
  try {
    const requests = await listExchangeRequests();
    return res.json(requests);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const { status, search } = req.query;
    const users = await listUsers({ status, search });
    return res.json(users);
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};

const getDashboardAnalytics = async (_req, res) => {
  try {
    const analytics = await getAnalytics();
    return res.json(analytics);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getListings = async (_req, res) => {
  try {
    const listings = await listAllListings();
    return res.json(listings);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteListingById = async (req, res) => {
  try {
    const { listingId } = req.params;
    const result = await deleteListing(listingId);
    return res.json(result);
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await removeUser(userId);
    return res.json(result);
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};

module.exports = {
  getPendingUsers,
  approvePendingUser,
  rejectPendingUser,
  updateApprovalStatus,
  getExchangeRequests,
  getUsers,
  getDashboardAnalytics,
  getListings,
  deleteListingById,
  deleteUser,
};