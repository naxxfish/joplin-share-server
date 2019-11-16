const logger = require('./logger');
const redis = require('redis');

const redisConnectionOptions = {
	host: process.env['REDIS_HOST'] || 'localhost',
	port: process.env['REDIS_PORT'] || 6379,
	password: process.env['REDIS_PASSWORD'] || undefined,
};

if (redisConnectionOptions.password !== undefined) {
	logger.log('info', 'Authenticating to redis with a password');
} else {
	logger.log('info', 'Not authentication with redis');
}

// connect to the DB
const client = redis.createClient(redisConnectionOptions);

// Hook up logging events
client.on('error', (err) => {
	logger.log('error', `Database connection to redis failed: ${err}`);
});

client.on('connect', () => {
	logger.log('info', 'Connected to database');
});

client.on('reconnecting', () => {
	logger.log('warn', 'Reconnecting to database...');
});

client.on('warning', (warning) => {
	logger.log('warn', `Redis warning: ${warning}`);
});

module.exports = client;
