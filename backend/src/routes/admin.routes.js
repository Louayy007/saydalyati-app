const express = require('express');
const {
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
} = require('../controllers/admin.controller');
const { requireAuth, requireAdmin } = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/pending-users', requireAuth, requireAdmin, getPendingUsers);
router.patch('/pending-users/:waitingId/approve', requireAuth, requireAdmin, approvePendingUser);
router.patch('/pending-users/:waitingId/reject', requireAuth, requireAdmin, rejectPendingUser);

router.get('/users', requireAuth, requireAdmin, getUsers);
// FIX: was '/users/:userId/approve' - now correctly named 'approval' to match frontend call
router.patch('/users/:userId/approval', requireAuth, requireAdmin, updateApprovalStatus);
router.delete('/users/:userId', requireAuth, requireAdmin, deleteUser);

router.get('/exchange-requests', requireAuth, requireAdmin, getExchangeRequests);

router.get('/analytics', requireAuth, requireAdmin, getDashboardAnalytics);

router.get('/listings', requireAuth, requireAdmin, getListings);
router.delete('/listings/:listingId', requireAuth, requireAdmin, deleteListingById);

module.exports = router;