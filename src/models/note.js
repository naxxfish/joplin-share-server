const uuid = require('uuid/v4');
const logger = require('../util/logger');
const db = require('../util/db');
const SUPPORTED_ENCRYPTION_TYPES = [
	'AES-128',
	'AES-256',
];

function isBase64Encoded(inputString) {
	return Buffer.from(inputString, 'base64').toString('base64') === inputString;
}

function encryptionTypeSupported(encryptionType) {
	return SUPPORTED_ENCRYPTION_TYPES.includes(encryptionType);
}

function originatorIdValid(originatorId) {
	return originatorId.length <= 256;
}

function validateNote(noteValue) {
	if (!encryptionTypeSupported(noteValue.encryptionType)) {
		throw new Error('encryption type not supported');
	}
	if (!isBase64Encoded(noteValue.noteData)) {
		throw new Error('noteData is not base64 encoded');
	}
	if (!originatorIdValid(noteValue.originator)) {
		throw new Error('originator is not valid');
	}
}

function createNote(noteData, encryptionType, originator) {
	const noteId = uuid();
	const noteValue = {
		noteId,
		noteData,
		encryptionType,
		originator,
		dateCreated: new Date(),
	};
	// validate the data
	validateNote(noteValue);
	return db.query(
		'INSERT INTO notes(note_id, note_data, note_encryption_type, note_originator, note_date_created, note_version) VALUES($1, $2, $3, $4, $5, $6) RETURNING note_id, note_originator',
		[
			noteValue.noteId,
			noteValue.noteData,
			noteValue.encryptionType,
			noteValue.originator,
			noteValue.dateCreated,
			1,
		],
	).then((response) => {
		logger.log('debug', `Created note ${response.rows[0].note_id} for ${response.rows[0].note_originator}`);
		return response.rows[0].note_id;
	});
}

function getNote(noteId) {
	return db.query('SELECT * FROM notes WHERE note_id=$1 LIMIT 1', [
		noteId,
	]).then(response => {
		const noteObject = {
			noteContents: response.rows[0].note_data,
			originator: response.rows[0].note_originator,
			version: response.rows[0].note_version,
			encryption: response.rows[0].note_encryption,
		};
		logger.log('debug', `Note ${noteId} retrieved`);
		return noteObject;
	});
}

function getNoteVersion(noteId) {
	return db.query('SELECT note_version FROM notes WHERE note_id=$1 LIMIT 1', [
		noteId,
	]).then(response => {
		logger.log('debug', `Note Version ${noteId} retrieved`);
		if (response.rows.length === 0)
			throw new Error('Note does not exist');
		return response.rows[0].note_version;
	});
}

module.exports = {
	createNote,
	getNote,
	getNoteVersion,
};
