let hasOwn = {}.hasOwnProperty;

function classSet() {
	let classes = [];
	for (let i = 0; i < arguments.length; i++) {
		let arg = arguments[i];
		
		if (!arg) continue;

		let argType = typeof arg;

		if (argType === 'string' || argType === 'number') {
			classes.push(arg);
		} else if (Array.isArray(arg)) {
			classes.push(classSet.apply(null, arg));
		} else if (argType === 'object') {
			for (let key in arg) {
				if (hasOwn.call(arg, key) && arg[key]) {
					classes.push(key);
				}
			}
		}
	}

	return classes.join(' ');
}

export default classSet;