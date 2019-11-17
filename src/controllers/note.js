const express = require('express');
const router = express.Router();
const rateLimiter = require('express-rate-limit');

const Note = require('../models/note');

const notePostRateLimiter = rateLimiter({
	windowMs: 60 * 60 * 1000,
	max: 200,
	message: 'Too many shares from this IP! Try again in an hour...',
});

router.get('/', (req, res) => {
	res.status(501).send('not implemented');
});

router.post('/', notePostRateLimiter, async (req, res) => {
	let noteData, encryptionType, originator;
	try {
		noteData = req.body.noteContents;
		encryptionType = req.body.encryption;
		originator = req.body.originator;
		if (noteData === undefined || encryptionType === undefined || originator === undefined) {
			throw new Error('missing one or more parameters');
		}
	} catch (e) {
		res.status(500).send({
			status: '422',
			message: e.message,
		});
		return;
	}
	let noteId;
	try {
		noteId = await Note.createNote(noteData, encryptionType, originator);
	} catch (e) {
		res.status(500).send({
			status: '500',
			message: e.message,
		});
		return;
	}
	res.status(200).send({
		noteId,
		version: '1',
	});
});

router.get('/:noteId', (req, res) => {
	Note.getNote(req.params['noteId'])
		.then((note) => {
			res.status(200).send(note);
		})
		.catch((error) => {
			res.status(500).send({
				status: '500',
				message: error.message,
			});
		});
});

router.get('/:noteId/version', (req, res) => {
	Note.getNoteVersion(req.params['noteId'])
		.then((noteVersion) => {
			res.status(200).send({
				version: noteVersion,
			});
		})
		.catch((error) => {
			res.status(500).send({
				status: '500',
				message: error.message,
			});
		});
});

module.exports = router;
