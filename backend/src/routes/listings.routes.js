const express = require('express');
const { getListings, postListing } = require('../controllers/listings.controller');
const { requireAuth } = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/', getListings);
router.post('/', requireAuth, postListing);

module.exports = router;
