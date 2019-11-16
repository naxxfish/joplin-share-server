process.env.NODE_ENV = 'test';
const chai = require('chai');
chai.use(require('chai-as-promised'));
chai.should();
const sinon = require('sinon');

const TEST_NOTE_ID = 'b8299a7e-2164-4898-ac47-44bd974aa1d2';
const TEST_NOTE = {
	noteId: 'b8299a7e-2164-4898-ac47-44bd974aa1d2',
	noteData: 'aGk=',
	encryptionType: 'AES-256',
	originator: 'abc@123.com',
	dateCreated: '2019-11-16T16:42:25.600Z',
};
const redis = require('redis');
// stub the connection so that we don't connect to redis
let Note;
let redisClientStub;
describe('NoteModel', function() {
	let dbGetSpy;
	let dbSetSpy;
	let db;
	before(function() {
		redisClientStub = sinon.stub(redis, 'createClient').returns({
			on: () => { },
			get: () => { },
			set: () => { },
		});
		Note = require('../src/models/note');
		db = require('../src/util/db');
		dbGetSpy = sinon.stub(db, 'get').callsFake((key, callback) => {
			if (key === `note.${TEST_NOTE_ID}`) {
				callback(null, JSON.stringify(TEST_NOTE));
			} else {
				callback(new Error('key does not exist'));
			}
		});
		dbSetSpy = sinon.stub(db, 'set').returns(true);
	});

	after(function() {
		delete require.cache[require.resolve('redis')];
		redisClientStub.restore();
	});

	describe('getNote', function() {
		afterEach(function() {
			dbGetSpy.resetHistory();
		});
		it('should get a note with a valid ID', async function() {
			const note = await Note.getNote(TEST_NOTE_ID);
			chai.expect(dbGetSpy.calledWith(`note.${TEST_NOTE_ID}`));
			chai.expect(note).to.include.all.keys(Object.keys(TEST_NOTE));
			Object.keys(TEST_NOTE).forEach((key) => {
				chai.expect(TEST_NOTE[key]).to.equal(note[key]);
			});
		});
		it('should throw an error with an invalid ID', function() {
			chai.expect(Note.getNote('abc123')).to.be.rejectedWith(Error);
		});
	});

	describe('createNote', function() {
		afterEach(function() {
			dbSetSpy.resetHistory();
		});
		it('creates a note with valid data', function() {
			let result = Note.createNote('aGk=', 'AES-128', 'test_originator');
			result.should.be.a('string');
			result.should.have.length(36);
			// should have written to the database with the uuid it returned
			chai.assert(dbSetSpy.calledWith(`note.${result}`));
		});
		it('does not create creates a note with invalid data', function() {
			chai.expect(function() {
				Note.createNote('aGk=asdfasdf', 'AES-128', 'test_originator');
			}).to.throw();
			chai.assert(!dbSetSpy.called, 'DB was called');
		});

		it('throws an error when the note data is invalid', function() {
			chai.expect(function() {
				Note.createNote('aGk=asdfasdf', 'AES-128', 'test_originator');
			}).to.throw();
		});

		it('throws an error when encryption type is wrong', function() {
			chai.expect(function() {
				Note.createNote('aGk=', 'MIB-128', 'test_originator');
			}).to.throw();
		});
		it('throws an error when originator ID is too long', function() {
			chai.expect(function() {
				Note.createNote('aGk=', 'MIB-128', 'test_originator'.repeat(100));
			}).to.throw();
		});
	});
});
