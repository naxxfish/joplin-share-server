const express = require('express');
const router = express.Router();


router.use('/note', require('./note'));

module.exports = router;
