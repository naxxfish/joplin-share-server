const pg = require('pg');
const connectionString = process.env.DATABASE_URL;
console.log('Installing database schema...');
if (connectionString === undefined) {
	console.error('No connection string supplied!');
	process.exit(1);
} else {
	console.log(`Connection string defined! ${connectionString}`);
}
let client;
try {
	client = new pg.Client(connectionString);
} catch (e) {
	console.error(`Couldn't make PostgreSQL client: ${e}`);
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
		CONSTRAINT "notes_note_id" PRIMARY KEY ("note_id")
	) WITH (oids = false);`));
Promise.all(createQueryPromises)
	.then((results) => {
		console.log(results);
		console.log('Database initialised!');
		process.exit(0);
	})
	.catch((error) => {
		console.error(`Error installing database: ${error}`);
		process.exit(1);
	});
