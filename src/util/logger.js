const winston = require('winston');
const logger = winston.createLogger({
	level: 'info',
	format: winston.format.json(),
	defaultMeta: { service: 'joplin-share-server'},
	transports: [
		new winston.transports.Console({
			format: winston.format.simple(),
		}),
	],
});
module.exports = logger;
