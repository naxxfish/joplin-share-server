const express = require('express');
const db = require('../util/db');
const router = express.Router();

router.get('/', (req, res) => {
	const dbInfo = db.server_info;
	let dbSection;
	if (dbInfo !== undefined) {
		dbSection = {
			status: 'CONNECTED',
			redisVersion: dbInfo.redis_version,
			redisClients: dbInfo.connected_clients,
		};
	} else {
		dbSection = {
			status: 'ERROR',
			message: 'Database not connected',
		};
	}
	res.status(200).send({
		name: process.env.npm_package_name,
		version: process.env.npm_package_version,
		status: 'OK',
		db: dbSection,
	});
});

module.exports = router;
