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
		if(!permissions.hasOwnProperty(segments[i])) 
			return GuardHouse.options.default;
		if(permissions[segments[i]] === true) return true;
		if(permissions[segments[i]] === false) return false;
		permissions = permissions[segments[i]];
	}
	return GuardHouse.options.default;
};

GuardHouse.wrap = functionWrapper(GuardHouse);
GuardHouse.PathProcessor = pathProcessor;