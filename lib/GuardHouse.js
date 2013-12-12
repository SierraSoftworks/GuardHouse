var functionWrapper = require('./FunctionWrapper.js');
var pathProcessor = require('./PathProcessor.js');

var GuardHouse = module.exports = {
	options: {
		default: false,
		targetProcessor: pathProcessor('.')
	}
};

GuardHouse.can = function(permissions, target) {
	/// <summary>Checks whether or not the given permissions have access to the specified target</summary>
	/// <param name="permissions" type="Object">The permissions posessed by a user</param>
	/// <param name="target" type="String">The target to check permission for</param>
	/// <returns type="Boolean"/>
	var segments = GuardHouse.options.targetProcessor(target);
	for(var i = 0; i < segments.length; i++) {
		if(typeof permissions == 'boolean') return permissions;
		
		if(!permissions.hasOwnProperty(segments[i])) {
			if(permissions.hasOwnProperty('*'))
				segments[i] = '*';
			else
				return GuardHouse.options.default;
		}

		permissions = permissions[segments[i]];
	}

	if(typeof permissions == 'boolean') return permissions;
	return GuardHouse.options.default;
};

GuardHouse.grant = function(permissions, updates, options) {
	/// <summary>Merges the permissions, updating the original's with those provided and favouring the highest access</summary>
	/// <param name="permissions" type="Object">The original permissions to update</param> 
	/// <param name="updates" type="Object">The changes to be made to the original permissions</param>
	/// <returns type="Object">

	mergeInternal(permissions, updates, false);
	simplifyInternal(permissions, GuardHouse.options.default);
	return permissions;
};

GuardHouse.revoke = function(permissions, updates, options) {
	/// <summary>Merges the permissions, updating the original's with those provided and favouring the lowest access</summary>
	/// <param name="permissions" type="Object">The original permissions to update</param> 
	/// <param name="updates" type="Object">The changes to be made to the original permissions</param>
	/// <returns type="Object">

	mergeInternal(permissions, updates, true);
	simplifyInternal(permissions, GuardHouse.options.default);
	return permissions;
};

GuardHouse.wrap = functionWrapper(GuardHouse);
GuardHouse.PathProcessor = pathProcessor;


function mergeInternal(permissions, updates, avoid) {
	for(var k in updates) {
		if(!permissions.hasOwnProperty(k))
			permissions[k] = updates[k];
		else if(permissions[k] === avoid)
			permissions[k] = updates[k];
		else if(typeof permissions[k] == 'object')
			mergeInternal(permissions[k], updates[k], avoid);
	}
}

function simplifyInternal(permissions, defaultResult) {
	if(typeof permissions == 'boolean') return permissions;

	var last = null;
	var toDelete = [];

	for(var k in permissions) {
		var simplified = simplifyInternal(permissions[k]);
		if(typeof simplified == 'boolean') permissions[k] = simplified;

		// Cannot simplify complex permissions (which aren't themselves simplifyable)
		if(typeof permissions[k] != 'boolean') return permissions;

		// Remove pointless wildcard
		if(k == '*' && permissions[k] == defaultResult)
			toDelete.push(k);

		if(!permissions.hasOwnProperty('*') && permissions[k] == defaultResult)
			toDelete.push(k);

		// Set our last known item if it isn't set already
		if(last === null) last = permissions[k];

		// Cannot simplify if there are different permissions
		if(permissions[k] != last) return permissions;
		last = permissions[k];
	}

	toDelete.forEach(function(rm) {
		delete permissions[rm];
	});

	return last === null ? defaultResult : last;
}