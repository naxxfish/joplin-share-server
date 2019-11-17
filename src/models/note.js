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

function generateToken() {
	return require('crypto').randomBytes(128).toString('hex');
}

function createNote(noteData, encryptionType, originator) {
	const noteValue = {
		noteId: uuid(),
		noteData,
		encryptionType,
		originator,
		readOnlyToken: generateToken(),
		readWriteToken: generateToken(),
		dateCreated: new Date(),
	};
	// validate the data
	validateNote(noteValue);
	return db.query(
		`INSERT INTO notes(
			note_id, 
			note_data, 
			note_encryption_type, 
			note_originator, 
			note_date_created, 
			note_readwrite_token, 
			note_readonly_token,
			note_version ) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
		[
			noteValue.noteId,
			noteValue.noteData,
			noteValue.encryptionType,
			noteValue.originator,
			noteValue.dateCreated,
			noteValue.readWriteToken,
			noteValue.readOnlyToken,
			1,
		],
	).then((response) => {
		logger.log('debug', `Created note ${response.rows[0].note_id} for ${response.rows[0].note_originator}`);
		return {
			id: response.rows[0].note_id,
			readOnlyToken: noteValue.readOnlyToken,
			readWriteToken: noteValue.readWriteToken,
		};
	});
}

function getNote(noteId, token) {
	return db.query('SELECT * FROM notes WHERE note_id=$1 AND (note_readonly_token=$2 OR note_readwrite_token=$2) LIMIT 1', [
		noteId,
		token,
	]).then(response => {
		if (response.rows.length === 0)
			throw new Error('Note does not exist');
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

function getNoteVersion(noteId, token) {
	return db.query('SELECT note_version FROM notes WHERE note_id=$1 AND (note_readonly_token=$2 OR note_readwrite_token=$2) LIMIT 1', [
		noteId,
		token,
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
