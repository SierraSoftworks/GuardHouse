module.exports = function(delimiter) {
	/// <summary>Creates a new path processor which splits on the given delimiter</summary>
	/// <param name="delimiter" type="String">The characters upon which to split the path</param>
	/// <returns type="Function"/>
	return function(path) {
		/// <summary>Processes a path into a number of path segments</summary>
		/// <param name="path" type="String">The path to process</param>
		/// <returns type="Array" elementType="String"/>
		var parts = path.split(delimiter);
		if(!parts[0])
			parts.shift();
		return parts;
	}
}