const logger = require('./logger');
const redis = require('redis');

// connect to the DB
const client = redis.createClient();

if (process.env['REDIS_PASSWORD'] !== undefined) {
	logger.log('info', 'Authenticating to redis with a password');
	client.auth(process.env['REDIS_PASSWORD']);
}

client.on('error', (err) => {
	logger.log('emerg', `Database connection to redis failed: ${err}`);
});

client.on('connect', () => {
	logger.log('info', 'Connected to database');
});

client.on('reconnecting', () => {
	logger.log('inwarnfo', 'Reconnecting to database...');
});

client.on('warning', (warning) => {
	logger.log('warn', `Redis warning: ${warning}`);
});

module.exports = client;
