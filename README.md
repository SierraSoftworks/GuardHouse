# GuardHouse
**A flexible access control permissions framework**

[![Build Status](https://travis-ci.org/SierraSoftworks/GuardHouse.png?branch=master)](https://travis-ci.org/SierraSoftworks/GuardHouse)
[![](https://badge.fury.io/js/guardhouse.png)](https://npmjs.org/package/guardhouse)

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

GuardHouse comes with a customizable target processor which is capable of parsing standard paths with customizable delimiters. It is possible to create your own processor if you wish, provided it follows the convention layed out below.

```javascript
function CustomPathProcessor(path) {
	return path.split(':'); // Must return an array of path segments
}
```

## Use With Express.js
It is often useful to provide access control for web services and APIs. GuardHouse can easily be integrated with Express using a middleware like the following.

```javascript
var GuardHouse = require('guardhouse');
GuardHouse.options.targetProcessor = GuardHouse.PathProcessor('/');

app.use(authenticationMiddleware);

app.use(function(req, res, next) {
	if(!req.user) 
		return res.json(401, { error: 'You have not provided a valid set of credentials.' });

	if(!Guardhouse.can(req.user.permissions, req.path))
		return res.json(403, { error: 'You do not have permission to access this API feature.' });

	next();
});
```

## Licence
This module is made available under the MIT Licence. You can read the full licence in the LICENCE file.