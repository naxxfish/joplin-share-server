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
	if (! encryptionTypeSupported(noteValue.encryptionType)) {
		throw new Error('encryption type not supported');
	}
	if (! isBase64Encoded(noteValue.noteData)) {
		throw new Error('noteData is not base64 encoded');
	}
	if (! originatorIdValid(noteValue.originator)) {
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
	try {
		db.set(`note.${noteId}`, JSON.stringify(noteValue));
		logger.log('debug', `Created note from ${originator}`);
	} catch (e) {
		logger.log('error', `Error creating note key: ${e}`);
		throw e;
	}
	return noteId;
}

function getNote(noteId) {
	return new Promise((resolve, reject) => {
		db.get(`note.${noteId}`, (err, reply) => {
			if (err) {
				reject(err);
			} else {
				resolve(JSON.parse(reply.toString('utf-8')));
			}
		});
	});
}

module.exports =  {
	createNote,
	getNote,
};
