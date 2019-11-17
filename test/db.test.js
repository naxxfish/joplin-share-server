process.env.NODE_ENV = 'test';
const chai = require('chai');
const sinon = require('sinon');
const redis = require('redis');
chai.use(require('sinon-chai'));

const REDIS_CONFIG_DEFAULTS = {
	host: 'localhost',
	password: undefined,
	port: 6379,
};

describe('db', function() {
	let redisCreateClientStub;
	beforeEach(function() {
		redisCreateClientStub = sinon.stub(redis, 'createClient').returns({
			on: () => {},
		});
	});

	afterEach(function() {
		delete process.env.REDIS_HOST;
		delete process.env.REDIS_PASSWORD;
		delete process.env.REDIS_PORT;
		// force require to load the module again!
		delete require.cache[require.resolve('../src/util/db')];
		redisCreateClientStub.restore();
	});

	it('should call createClient', function() {
		require('../src/util/db');
		chai.expect(redisCreateClientStub.calledOnce).to.equal(true);
	});

	it('should take in REDIS_HOST from environment variables', function() {
		process.env.REDIS_HOST = 'hello-world';
		require('../src/util/db');
		chai.expect(redisCreateClientStub.calledOnce).to.equal(true);
		redisCreateClientStub.should.have.been.calledWithMatch(sinon.match.has('host', 'hello-world'));
		redisCreateClientStub.should.have.been.calledWithMatch(sinon.match.has('port', REDIS_CONFIG_DEFAULTS.port));
		redisCreateClientStub.should.have.been.calledWithMatch(sinon.match.has('password', REDIS_CONFIG_DEFAULTS.password));
	});

	it('should take in REDIS_PASSWORD from environment variables', function() {
		process.env.REDIS_PASSWORD = 'hello-world';
		require('../src/util/db');
		chai.expect(redisCreateClientStub.calledOnce).to.equal(true);
		redisCreateClientStub.should.have.been.calledWithMatch(sinon.match.has('password', 'hello-world'));
		redisCreateClientStub.should.have.been.calledWithMatch(sinon.match.has('host', REDIS_CONFIG_DEFAULTS.host));
		redisCreateClientStub.should.have.been.calledWithMatch(sinon.match.has('port', REDIS_CONFIG_DEFAULTS.port));
	});

	it('should take in REDIS_PORT from environment variables', function() {
		process.env.REDIS_PORT = 'hello-world';
		require('../src/util/db');
		chai.expect(redisCreateClientStub.calledOnce).to.equal(true);
		redisCreateClientStub.should.have.been.calledWithMatch(sinon.match.has('port', 'hello-world'));
		redisCreateClientStub.should.have.been.calledWithMatch(sinon.match.has('host', REDIS_CONFIG_DEFAULTS.host));
		redisCreateClientStub.should.have.been.calledWithMatch(sinon.match.has('password', REDIS_CONFIG_DEFAULTS.password));
	});
});
