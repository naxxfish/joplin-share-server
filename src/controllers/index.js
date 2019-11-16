const express = require('express');
const router = express.Router();


router.use('/note', require('./note'));
router.use('/status', require('./status'));

module.exports = router;
