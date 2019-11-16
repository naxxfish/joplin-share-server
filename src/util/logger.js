const winston = require('winston');
const consoleTransport = new winston.transports.Console({
	format: winston.format.simple(),
});

if (process.env.NODE_ENV === 'test') {
	consoleTransport.silent = true;
}

const logger = winston.createLogger({
	level: 'debug',
	format: winston.format.json(),
	defaultMeta: { service: 'joplin-share-server'},
	transports: [
		consoleTransport,
	],
});
module.exports = logger;
