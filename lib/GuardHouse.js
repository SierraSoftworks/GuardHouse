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
	
	permissions = this.get(permissions, target);

	if(typeof permissions == 'boolean') return permissions;
	return GuardHouse.options.default;
};

GuardHouse.get = function(permissions, target) {
	/// <summary>Gets the permissions available for the specified target</summary>
	/// <param name="permissions" type="Object">The permissions posessed by a user</param>
	/// <param name="target" type="String">The target to retreive permission for</param>
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

	return permissions;
};

GuardHouse.grant = function(permissions, updates) {
	/// <signature>
	/// <summary>Merges the permissions, updating the original's with those provided and favouring the highest access</summary>
	/// <param name="permissions" type="Object">The original permissions to update</param> 
	/// <param name="updates" type="Object">The changes to be made to the original permissions</param>
	/// <returns type="Object"/>
	/// </signature>
	/// <signature>
	/// <summary>Merges the permissions, updating the original's with those provided and favouring the highest access</summary>
	/// <param name="permissions" type="Object">The original permissions to update</param> 
	/// <param name="path" type="String">The path of the permissions to grant</param>
	/// <returns type="Object"/>
	/// </signature>

	if('object' == typeof updates)
		GuardHouse.merge(permissions, updates, true);
	else if('string' == typeof updates)
		GuardHouse.set(permissions, updates, true);

	GuardHouse.simplify(permissions);
	return permissions;
};

GuardHouse.revoke = function(permissions, updates) {
	/// <signature>
	/// <summary>Merges the permissions, updating the original's with those provided and favouring the lowest access</summary>
	/// <param name="permissions" type="Object">The original permissions to update</param> 
	/// <param name="updates" type="Object">The changes to be made to the original permissions</param>
	/// <returns type="Object"/>
	/// </signature>
	/// <signature>
	/// <summary>Merges the permissions, updating the original's with those provided and favouring the lowest access</summary>
	/// <param name="permissions" type="Object">The original permissions to update</param> 
	/// <param name="path" type="String">The path of the permissions to revoke</param>
	/// <returns type="Object"/>
	/// </signature>

	if('object' == typeof updates)
		GuardHouse.merge(permissions, updates, false);
	else if('string' == typeof updates)
		GuardHouse.set(permissions, updates, false);

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

	if(Object.keys(permissions).length == 0) return GuardHouse.options.default;

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

GuardHouse.set = function(permissions, path, value) {
	/// <summary>Sets the nested property to the given value</summary>
	/// <param name="permissions" type="Object">The permissions posessed by a user</param>
	/// <param name="path" type="String">The target to set permission for</param>
	/// <param name="value" type="Boolean">The permissions to assign to the target</param>
	/// <returns type="Object"/>
	var segments = GuardHouse.options.targetProcessor(path);
	var current = permissions, tp, next;
	while(segments.length > 1) {
		tp = segments.shift();

		if('object' == typeof current[tp]) next = current[tp];
		else if(current[tp] == value) return permissions;
		else next = {};

		current = current[tp] = next;
	}

	current[segments.shift()] = value;
	return permissions;
};

GuardHouse.wrap = functionWrapper(GuardHouse);
GuardHouse.PathProcessor = pathProcessor;