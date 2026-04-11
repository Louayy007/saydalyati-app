const express = require('express');
const { me, updateMe } = require('../controllers/profile.controller');
const { requireAuth } = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/me', requireAuth, me);
router.patch('/me', requireAuth, updateMe);

module.exports = router;
