var should = require('should');
var GuardHouse = require('../index.js');


it('should correctly process permissions', function() {
	var permissions = {
		company: {
			sierrasoftworks: {
				put: true,
				delete: true,
				applications: { post: true }
			}
		}
	};

	var expected = {
		company: {
			sierrasoftworks: {
				put: true,
				delete: true,
				applications: { post: true },
				members: {
					':user': {
						permissions: true
					}
				}
			}
		}
	};

	GuardHouse.grant(permissions, 'company.sierrasoftworks.members.:user.permissions');
	permissions.should.eql(expected);
});