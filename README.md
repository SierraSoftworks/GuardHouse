# GuardHouse
**A flexible access control permissions framework**

GuardHouse is designed to make the creation and processing of complex access control restrictions using an easy to understand and store JSON data format.

## Installation

```sh
npm install guardhouse
```

## Example

```javascript
var guest_acl = {
	api: {
		account: true,
		users: {
			read: true
		}
	}
};

var admin_acl = {
	api: true,
	admin: true
};

var guardhouse = require('guardhouse');
guardhouse.can(guest_acl, 'admin.user.delete');
// -> False
guardhouse.can(admin_acl, 'admin.user.delete');
// -> True



var securedFunction = guardhouse.wrap('admin.functions', someFunction);
securedFunction.auth(guest_acl)();
// -> throws an error

securedFunction.can(guest_acl);
// -> False

securedFunction.auth(admin_acl)(params);
// -> someFunction(params)
```

## Customization
GuardHouse supports a number of customization options which influence its behaviour, including blacklist/whitelist modes, custom rule parsing logic and a number of other features.

```javascript
var guardhouse = require('guardhouse');

// Set to true for blacklist mode
guardhouse.options.default = false;

// Change to '/' for easy use with web paths
guardhouse.options.targetProcessor = guardhouse.PathProcessor('.');
```

## Licence
This module is made available under the MIT Licence. You can read the full licence in the LICENCE file.