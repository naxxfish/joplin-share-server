const express = require('express');
const router = express.Router();

const Note = require('../models/note');

router.get('/', (req, res) => {
	res.status(501).send('not implemented');
});

router.post('/', (req, res) => {
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
		noteId = Note.createNote(noteData, encryptionType, originator);
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
	res.status(501).send('not implemented');
});

module.exports = router;
