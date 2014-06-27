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

	if(permissions === undefined || permissions === null)
		return GuardHouse.options.default;

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
	/// <returns type="Object"/>

	GuardHouse.merge(permissions, updates, true);
	GuardHouse.simplify(permissions);
	return permissions;
};

GuardHouse.revoke = function(permissions, updates, options) {
	/// <summary>Merges the permissions, updating the original's with those provided and favouring the lowest access</summary>
	/// <param name="permissions" type="Object">The original permissions to update</param> 
	/// <param name="updates" type="Object">The changes to be made to the original permissions</param>
	/// <returns type="Object"/>

	GuardHouse.merge(permissions, updates, false);
	GuardHouse.simplify(permissions);
	return permissions;
};

GuardHouse.simplify = function(permissions) {
	/// <summary>Simplifies a permission expression to it's lowest form while still ensuring the same results</summary>
	/// <param name="permissions" type="Object">The permission expression to simplify</param>
	/// <returns type="Object"/>

	if(typeof permissions == 'boolean') return permissions;
	
	var keys = Object.keys(permissions);
	if(keys.length == 0) return GuardHouse.options.default;

	for(var i = 0; i < keys.length; i++) {
		permissions[keys[i]] = GuardHouse.simplify(permissions[keys[i]]);
		if(permissions[keys[i]] == GuardHouse.options.default) delete permissions[keys[i]];
	}

	return permissions;
};

GuardHouse.merge = function(permissions, and, prefer) {
	/// <summary>Merges the given permissions with another set, prefering a specific outcome</summary>
	/// <param name="permissions" type="Object">The original permissions to merge into</param>
	/// <param name="and" type="Object">The permissions to merge into the original</param>
	/// <param name="prefer" type="Boolean">The outcome to prefer</param>
	/// <returns type="Object"/>

	if(permissions == and) return permissions;
	if(typeof permissions == 'object' && typeof and == 'object') {
		for(var k in and) {
			if(permissions.hasOwnProperty(k)) permissions[k] = GuardHouse.merge(permissions[k], and[k], prefer);
			else permissions[k] = GuardHouse.merge(GuardHouse.options.default, and[k], prefer);
		}
		return permissions;
	}
	else if(typeof permissions == 'boolean') {
		if(permissions == prefer) return permissions;
		return and;
	}
	else if(typeof and == 'boolean') {
		if(and == prefer) return and;
		return permissions;
	}
};

GuardHouse.wrap = functionWrapper(GuardHouse);
GuardHouse.PathProcessor = pathProcessor;