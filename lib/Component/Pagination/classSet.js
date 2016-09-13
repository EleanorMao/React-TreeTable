'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var hasOwn = {}.hasOwnProperty;

function classSet() {
	var classes = [];
	for (var i = 0; i < arguments.length; i++) {
		var arg = arguments[i];

		if (!arg) continue;

		var argType = typeof arg === 'undefined' ? 'undefined' : _typeof(arg);

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
exports.default = classSet;