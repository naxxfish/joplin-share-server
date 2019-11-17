const logger = require('./logger');

const { Pool } = require('pg');

const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
});
logger.log('debug', 'PostgreSQL connection string', process.env.DATABASE_URL);

pool.on('connect', () => {
	logger.log('info', 'PostgreSQL connection established');
});

pool.on('error', (error) => {
	logger.log('error',  `PostgreSQL Error: ${error}`);
});

module.exports = pool;
