const express = require('express');
const {
	getPendingUsers,
	patchUserApproval,
	getExchangeRequests,
	getUsers,
	getAnalyticsSummary,
} = require('../controllers/admin.controller');
const { requireAuth, requireAdmin } = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/pending-users', requireAuth, requireAdmin, getPendingUsers);
router.get('/users', requireAuth, requireAdmin, getUsers);
router.get('/analytics', requireAuth, requireAdmin, getAnalyticsSummary);
router.get('/exchange-requests', requireAuth, requireAdmin, getExchangeRequests);
router.patch('/users/:id/approval', requireAuth, requireAdmin, patchUserApproval);

module.exports = router;
