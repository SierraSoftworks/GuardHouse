module.exports = function(GuardHouse) {
	function Wrapper(permission, toWrap) {
		if(!(this instanceof Wrapper)) return new Wrapper(permission, toWrap);

		this.wrapped = toWrap;
		this.permission = permission;
	}

	Wrapper.prototype.auth = function(permissions) {
		/// <summary>Attempts to authorize the use of the wrapped function given a set of permissions</summary>
		/// <param name="permissions" type="Object">The permissions against which to check the function</param>
		/// <returns type="Function"/>

		if(!GuardHouse.can(permissions, this.permission)) {
			var error = new Error('You do not have permission to call this function, you require the "' + this.permission + '" permission.');
			error.GuardHouse = true;

			throw error;
		}

		return this.wrapped;
	};

	Wrapper.prototype.can = function(permissions) {
		/// <summary>Checks whether or not the given permissions have access to the specified target</summary>
		/// <param name="permissions" type="Object">The permissions posessed by a user</param>
		/// <returns type="Boolean"/>

		return GuardHouse.can(permissions, this.permission);
	};

	return Wrapper;
};