const pg = require('pg');
const connectionString = process.env.DATABASE_URL;
console.log('Installing database schema...');
if (connectionString === undefined) {
	console.error('No connection string supplied!');
	process.exit(1);
}

console.log('Connection string defined!');

let client;
try {
	client = new pg.Client(connectionString);
} catch (e) {
	console.error(`Couldn't make PostgreSQL client: ${e}`);
	process.exit(1);
}
client.connect((error) => {
	if (error) {
		console.error(`Error connecting to PostgreSQL: ${error.stack}`);
		process.exit(1);
	}
	const createQueryPromises = [];
	createQueryPromises.push(
		client.query(`CREATE TABLE "notes" (
			"note_data" text NOT NULL,
			"note_encryption_type" text NOT NULL,
			"note_originator" text NOT NULL,
			"note_date_created" timestamp NOT NULL,
			"note_id" text NOT NULL,
			"note_version" bigint NOT NULL,
			"note_readwrite_token" text NOT NULL,
			"note_readonly_token" text NOT NULL,
			CONSTRAINT "notes_note_id" PRIMARY KEY ("note_id")
		) WITH (oids = false);`));
	createQueryPromises.push(
		client.query('ALTER TABLE "notes" ADD COLUMN IF NOT EXISTS note_readwrite_token text;'),
	);
	createQueryPromises.push(
		client.query('ALTER TABLE "notes" ADD COLUMN IF NOT EXISTS note_readonly_token text;'),
	);
	Promise.all(createQueryPromises)
		.then(() => {
			console.log('Database initialised!');
			process.exit(0);
		})
		.catch((error) => {
			console.error(`Error installing database: ${error}`);
			process.exit(1);
		});
});
