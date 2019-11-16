const express = require('express');

const app = express();

app.use(express.static(`${__dirname}/public`));
app.use(require('./controllers/'));
const port = process.env['port'] || 3000;

app.listen(port, () => {
	console.log(`Listening on port ${port}`);
});
