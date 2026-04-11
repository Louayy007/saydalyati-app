const express = require('express');
const { createRequest, inbox, sent, updateStatus } = require('../controllers/exchangeRequests.controller');
const { requireAuth } = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/inbox', requireAuth, inbox);
router.get('/sent', requireAuth, sent);
router.post('/', requireAuth, createRequest);
router.patch('/:id/status', requireAuth, updateStatus);

module.exports = router;
