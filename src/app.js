const express = require('express');
const expressWinston = require('express-winston');
const winston = require('winston');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

const app = express();

app.use(bodyParser.json());
app.use(compression());
app.use(helmet());

const limiter = rateLimit({
	windowMs: 1 * 60 * 1000,
	max: 5,
});
app.use(limiter);

app.use(expressWinston.logger({
	transports: [
		new winston.transports.Console(),
	],
	format: winston.format.combine(
		winston.format.colorize(),
		winston.format.json(),
	),
}));

app.use(express.static(`${__dirname}/public`));
app.use(require('./controllers/'));

const port = process.env['PORT'] || 3000;
const server = app.listen(port, () => {
	console.log(`Listening on port ${port}`);
});

module.exports = server;
