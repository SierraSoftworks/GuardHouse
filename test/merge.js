var GuardHouse = require('../');
var should = require('should');

describe('permission merging', function() {
	it('should merge boolean values correctly', function() {
		GuardHouse.merge(true, true, true).should.be.true;
		GuardHouse.merge(true, true, false).should.be.true;
		GuardHouse.merge(false, true, true).should.be.true;
		GuardHouse.merge(false, true, false).should.be.false;
		GuardHouse.merge(false, false, true).should.be.false;
		GuardHouse.merge(false, false, false).should.be.false;
	});

	it('should merge object permissions with boolean values correctly', function() {
		GuardHouse.merge({ a: true }, true, true).should.be.true;
		GuardHouse.merge({ a: true }, true, false).should.be.eql({ a: true });
		GuardHouse.merge({ a: true }, false, false).should.be.false;
		GuardHouse.merge({ a: true }, false, true).should.be.eql({ a: true });
		GuardHouse.merge(true, { a: true }, true).should.be.true;
		GuardHouse.merge(true, { a: true }, false).should.be.eql({ a: true });
		GuardHouse.merge(false, { a: true }, false).should.be.false;
		GuardHouse.merge(false, { a: true }, true).should.be.eql({ a: true });
	});

	it('should merge object permissions correctly', function() {
		GuardHouse.merge({ a: true }, { a: true }, true).should.eql({ a: true });
		GuardHouse.merge({ a: true }, { a: true }, false).should.eql({ a: true });

		GuardHouse.merge({ a: true }, { b: true }, true).should.eql({ a: true, b: true });
		GuardHouse.merge({ a: true }, { b: true }, false).should.eql({ a: true, b: false });
		GuardHouse.merge({ a: true }, { b: false }, true).should.eql({ a: true, b: false });
		GuardHouse.merge({ a: true }, { b: false }, false).should.eql({ a: true, b: false });
		GuardHouse.merge({ a: true, b: true }, { b: false }, false).should.eql({ a: true , b: false});

		GuardHouse.merge({ a: true }, { b: { c: true } }, true).should.eql({ a: true, b: { c: true } });
	});

	it('should correctly grant basic permissions', function() {
		var original = {
			a: true
		};

		var change = 'b';

		var expected = {
			a: true,
			b: true
		};

		GuardHouse.grant(original, change).should.eql(expected);
	});

	it('should correctly grant basic path permissions', function() {
		var original = {
			a: true
		};

		var change = {
			b: true
		};

		var expected = {
			a: true,
			b: true
		};

		GuardHouse.grant(original, change).should.eql(expected);
	});

	it('should correctly grant nested permissions', function() {
		var original = {
			a: true
		};

		var change = {
			b: { c: true }
		};

		var expected = {
			a: true,
			b: { c: true }
		};

		GuardHouse.grant(original, change).should.eql(expected);
	});

	it('should correctly grant nested path permissions', function() {
		var original = {
			a: true
		};

		var change = 'b.c';

		var expected = {
			a: true,
			b: { c: true }
		};

		GuardHouse.grant(original, change).should.eql(expected);
	});

	it('should correctly grant deep permissions', function() {
		var original = {
			a: { b: true }
		};

		var change = {
			a: { c: true }
		};

		var expected = {
			a: { b: true, c: true }
		};

		GuardHouse.grant(original, change).should.eql(expected);
	});

	it('should correctly grant deep path permissions', function() {
		var original = {
			a: { b: true }
		};

		var change = 'a.c';

		var expected = {
			a: { b: true, c: true }
		};

		GuardHouse.grant(original, change).should.eql(expected);
	});

	it('should correctly revoke basic permissions', function() {
		var original = {
			a: true,
			b: true
		};

		var change = {
			b: false
		};

		var expected = {
			a: true
		};

		GuardHouse.revoke(original, change).should.eql(expected);
	});

	it('should correctly revoke basic path permissions', function() {
		var original = {
			a: true,
			b: true
		};

		var change = 'b';

		var expected = {
			a: true
		};

		GuardHouse.revoke(original, change).should.eql(expected);
	});

	it('should correctly revoke nested permissions', function() {
		var original = {
			a: true,
			b: { c: true }
		};

		var change = {
			b: { c: false }
		};

		var expected = {
			a: true
		};

		GuardHouse.revoke(original, change).should.eql(expected);
	});

	it('should correctly revoke nested path permissions', function() {
		var original = {
			a: true,
			b: { c: true }
		};

		var change = 'b.c';

		var expected = {
			a: true
		};

		GuardHouse.revoke(original, change).should.eql(expected);
	});

	it('should correctly revoke deep permissions', function() {
		var original = {
			a: { b: true, c: true }
		};

		var change = {
			a: { c: false }
		};

		var expected = {
			a: { b: true }
		};

		GuardHouse.revoke(original, change).should.eql(expected);
	});

	it('should correctly revoke deep path permissions', function() {
		var original = {
			a: { b: true, c: true }
		};

		var change = 'a.c';

		var expected = {
			a: { b: true }
		};

		GuardHouse.revoke(original, change).should.eql(expected);
	});
});