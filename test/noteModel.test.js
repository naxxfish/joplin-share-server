process.env.NODE_ENV = 'test';
const chai = require('chai');
const sinon = require('sinon');
chai.use(require('chai-as-promised'));
chai.use(require('sinon-chai'));
chai.should();

const TEST_NOTE_ID = 'b8299a7e-2164-4898-ac47-44bd974aa1d2';
const TEST_NOTE = {
	note_id: TEST_NOTE_ID,
	note_data: 'aGk=',
	note_encryption_type: 'AES-256',
	note_originator: 'abc@123.com',
	note_date_reated: '2019-11-16T16:42:25.600Z',
	note_version: 1,
};
const db = require('../src/util/db');

const Note = require('../src/models/note');

describe('NoteModel', function() {
	describe('getNoteVersion', function() {
		it('should get the version of a note which exists', async function() {
			const queryStub = sinon.stub(db, 'query').callsFake(() => {
				return new Promise((resolve) => {
					resolve({
						rows: [
							TEST_NOTE,
						],
					});
				});
			});
			const version = await Note.getNoteVersion(TEST_NOTE_ID);
			version.should.equal(1);
			queryStub.restore();
		});
		it('should throw for notes that do not exist', async function() {
			const queryStub = sinon.stub(db, 'query').callsFake(() => {
				return new Promise((resolve) => {
					resolve({rows: []});
				});
			});
			chai.expect(Note.getNoteVersion('abc123')).to.be.rejectedWith(Error);
			queryStub.restore();
		});
	});
	describe('getNote', function() {
		it('should get a note with a valid ID', async function() {
			const queryStub = sinon.stub(db, 'query').callsFake(() => {
				return new Promise((resolve) => {
					resolve({
						rows: [
							TEST_NOTE,
						],
					});
				});
			});
			const note = await Note.getNote(TEST_NOTE_ID);
			note.should.be.a('object');
			queryStub.restore();
		});
	});

	describe('createNote', function() {
		let queryStub;
		beforeEach(function() {
			queryStub = sinon.stub(db, 'query');
		});
		afterEach(function() {
			queryStub.restore();
		});
		it('creates a note with valid data', async function() {
			queryStub.callsFake(() => {
				return new Promise((resolve) => {
					resolve({
						rows: [
							TEST_NOTE,
						],
					});
				});
			});
			let result = await Note.createNote('aGk=', 'AES-128', 'test_originator');
			result.should.be.a('object');
			result.id.should.be.a('string');
			result.readOnlyToken.should.be.a('string');
			result.readWriteToken.should.be.a('string');
			result.id.should.equal(TEST_NOTE_ID);
			queryStub.restore();
		});

		it('does not create creates a note with invalid data', function() {
			chai.expect(function() {
				Note.createNote('aGk=asdfasdf', 'AES-128', 'test_originator');
			}).to.throw();
			queryStub.should.have.not.been.called;
		});

		it('throws an error when the note data is invalid', function() {
			chai.expect(function() {
				Note.createNote('aGk=asdfasdf', 'AES-128', 'test_originator');
			}).to.throw();
			queryStub.should.have.not.been.called;
		});

		it('throws an error when encryption type is wrong', function() {
			chai.expect(function() {
				Note.createNote('aGk=', 'MIB-128', 'test_originator');
			}).to.throw();
			queryStub.should.have.not.been.called;
		});
		it('throws an error when originator ID is too long', function() {
			chai.expect(function() {
				Note.createNote('aGk=', 'AES-128', 'test_originator'.repeat(100));
			}).to.throw();
			queryStub.should.have.not.been.called;
		});
	});
});
