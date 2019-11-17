const express = require('express');
const db = require('../util/db');
const logger = require('../util/logger');
const router = express.Router();

router.get('/', (req, res) => {
	let appStatus = {
		name: process.env.npm_package_name,
		version: process.env.npm_package_version,
		status: 'OK',
	};
	db.query('SHOW server_version;')
		.then((response) => {
			logger.log('debug', 'status endpoint database check returned ok');
			appStatus.db = {
				status: 'CONNECTED',
				serverVersion: response.rows[0].server_version,
				totalCount: db.totalCount,
				idleCount: db.idleCount,
				waitingCount: db.waitingCount,
			};
			res.status(200).send(appStatus);
		})
		.catch((error) => {
			logger.log('error', `Database query for status endpoint errored: ${error.stack}`);
			appStatus.db = {
				status: 'ERROR',
				message: error,
			};
			res.status(500).send(appStatus);
		});
});

module.exports = router;
