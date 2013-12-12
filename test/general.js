var should = require('should');
var GuardHouse = require('../index.js');


it('should correctly process permissions', function() {
	var permissions = {
		allow: true,
		block: false
	};

	GuardHouse.can(permissions, 'allow').should.be.true;
	GuardHouse.can(permissions, 'block').should.be.false;
	GuardHouse.can(permissions, 'default').should.eql(GuardHouse.options.default);
});

it('should correctly process nested permissions', function() {
	var permissions = {
		api: {
			admin: false,
			user: true
		},
		account: true
	};

	GuardHouse.can(permissions, 'api.admin').should.be.false;
	GuardHouse.can(permissions, 'api.admin.user.delete').should.be.false;
	GuardHouse.can(permissions, 'api.user').should.be.true;
	GuardHouse.can(permissions, 'account.delete').should.be.true;
});

it('should correctly process wildcard permissions', function() {
	var permissions = {
		api: {
			admin: false,
			'*': true
		},
		account: true
	};

	GuardHouse.can(permissions, 'api.admin').should.be.false;
	GuardHouse.can(permissions, 'api.test').should.be.true;
	GuardHouse.can(permissions, 'api.user').should.be.true;
	GuardHouse.can(permissions, 'account.delete').should.be.true;
});

it('should correctly handle universal permissions', function() {
	GuardHouse.can(true, 'some.random.permission').should.be.true;
	GuardHouse.can(false, 'some.random.permission').should.be.false;
});

it('should correctly wrap functions', function(done) {
	var permissions = {
		f1: true,
		f2: false
	};

	var f1 = function() {
		(function() {
			f2s.auth(permissions)();
		}).should.throwError();
		done();
	}

	var f2 = function() {
		should.fail;
	};

	var f1s = GuardHouse.wrap('f1', f1);
	var f2s = GuardHouse.wrap('f2', f2);

	f1s.can(permissions).should.be.true;
	f2s.can(permissions).should.be.false;

	f1s.auth(permissions)();
});