const pg = require('pg');
const connectionString = process.env.DATABASE_URL;
if (connectionString === undefined) {
	console.error('No connection string supplied!');
	process.exit(1);
}
const client = new pg.Client(connectionString);
const createQueryPromises = [];
createQueryPromises.push(
	client.query(`CREATE TABLE "public"."notes" (
		"note_data" text NOT NULL,
		"note_encryption_type" text NOT NULL,
		"note_originator" text NOT NULL,
		"note_date_created" timestamp NOT NULL,
		"note_id" text NOT NULL,
		"note_version" bigint NOT NULL,
		CONSTRAINT "notes_note_id" PRIMARY KEY ("note_id")
	) WITH (oids = false);`));
Promise.all(createQueryPromises)
	.then(() => {
		console.log('Database initialised!');
		process.exit(0);
	})
	.catch((error) => {
		console.error(`Error installing database: ${error}`);
		process.exit(1);
	});
