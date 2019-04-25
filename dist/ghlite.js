(function(window) {
	var gh = window.GuardHouse = {
		options: {
			default: !!0
		}
	};

	gh.PathProcessor = function(d) {
		return function(p) {
			p = p.split(d);
			if(!p[0]) p.shift();
			return p;
		}
	};

	gh.options.targetProcessor = gh.PathProcessor('/');

	gh.get = function(p,t) {
		var s = gh.options.targetProcessor(t);
		if(p === undefined || p === null) return gh.options.default;
		for(var i = 0; i < s.length; i++) {
			if(typeof p == 'boolean') return p;
			if(!p.hasOwnProperty(s[i])) {
				if(p.hasOwnProperty('*')) s[i] = '*';
				else return gh.options.default;
			}
			p = p[s[i]];
		}
		
		return p;
	};

	gh.can = function(p,t) {
		p = gh.get(p,t);
		
		if(typeof p == 'boolean') return p;
		return gh.options.default;
	};

	return gh;
})(window);