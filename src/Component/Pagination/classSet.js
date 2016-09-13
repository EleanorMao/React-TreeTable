var hasOwn = {}.hasOwnProperty;

function classSet() {
	var classes = [];
	for (var i = 0; i < arguments.length; i++) {
		var arg = arguments[i];
		
		if (!arg) continue;

		var argType = typeof arg;

		if (argType === 'string' || argType === 'number') {
			classes.push(arg);
		} else if (Array.isArray(arg)) {
			classes.push(classSet.apply(null, arg));
		} else if (argType === 'object') {
			for (var key in arg) {
				if (hasOwn.call(arg, key) && arg[key]) {
					classes.push(key);
				}
			}
		}
	}

	return classes.join(' ');
}

window.classSet = classSet;
export default classSet;