const express = require('express');
const db = require('../util/db');
const router = express.Router();

router.get('/', (req, res) => {
	const dbInfo = db.server_info;
	if (dbInfo !== undefined) {
		res.status(200).send({
			status: 'OK',
			db: {
				redisVersion: dbInfo.redis_version,
				redisClients: dbInfo.connected_clients,
			},
		});
	} else {
		res.status(200).send({
			status: 'ERROR',
			message: 'Database not connected',
		});
	}
});

module.exports = router;
