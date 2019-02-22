'use strict';

class Util {
    static callbackAfterPromise(self, func, args, cb) {
		args = Array.prototype.slice.apply(args);
		let lastarg = args.pop();
		if(!cb) cb = lastarg;
		func.apply(self, args).then(res => {
			try {
				cb(null, res);
			} catch(e) {
				process.nextTick(() => { throw e });
			}
		}).catch((err) => {
			try {
				cb(err);
			} catch(e) {
				process.nextTick(() => { throw e });
			}
		});
	}

	static capitalizeFirstLetter(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}

	static uuid() {
		function s4() {
			return Math.floor((1 + Math.random()) * 0x10000)
				.toString(16)
				.substring(1);
		}

		return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
	}

	static recursiveDeepCopy(o, visited = new Set()) {
		if (typeof o !== 'object') return o;
		if (!o) return o;
		if (visited.has(o)) return null;
		visited.add(o);
		if (o.constructor === Array) return o.map(e => this.recursiveDeepCopy(e, visited));
		if (o.constructor === Date) return new Date(o);
		if (o instanceof Error) return o;
		const r = {};
		if (o.constructor === Object) {
			for (const i in o) r[i] = this.recursiveDeepCopy(o[i], visited);
		}
		return r;
	}

	static protectClass( c, map ) {
		Object.getOwnPropertyNames( c.prototype ).forEach( key => {
			if( key === '__debug' ) return;
			if( key.indexOf('__') !== 0 ) return;

			let fn = c.prototype[ key ];
			delete c.prototype[ key ];

			map[key] = Symbol();
			c.prototype[map[key]] = fn;
		});
	}

	static deepCompare() {
		var i, l, leftChain, rightChain;

		function compare2Objects(x, y) {
		    var p;

		    // remember that NaN === NaN returns false
		    // and isNaN(undefined) returns true
		    if (isNaN(x) && isNaN(y) && typeof x === 'number' && typeof y === 'number') {
		        return true;
		    }

		    // Compare primitives and functions.
		    // Check if both arguments link to the same object.
		    // Especially useful on the step where we compare prototypes
		    if (x === y) {
		        return true;
		    }

		    // Works in case when functions are created in constructor.
		    // Comparing dates is a common scenario. Another built-ins?
		    // We can even handle functions passed across iframes
		    if ((typeof x === 'function' && typeof y === 'function') ||
		        (x instanceof Date && y instanceof Date) ||
		        (x instanceof RegExp && y instanceof RegExp) ||
		        (x instanceof String && y instanceof String) ||
		        (x instanceof Number && y instanceof Number)) {
		        return x.toString() === y.toString();
		    }

		    // At last checking prototypes as good as we can
		    if (!(x instanceof Object && y instanceof Object)) {
		        return false;
		    }

		    if (x.isPrototypeOf(y) || y.isPrototypeOf(x)) {
		        return false;
		    }

		    if (x.constructor !== y.constructor) {
		        return false;
		    }

		    if (x.prototype !== y.prototype) {
		        return false;
		    }

		    // Check for infinitive linking loops
		    if (leftChain.indexOf(x) > -1 || rightChain.indexOf(y) > -1) {
		        return false;
		    }

		    // Quick checking of one object being a subset of another.
		    // todo: cache the structure of arguments[0] for performance
		    for (p in y) {
		        if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
		            return false;
		        } else if (typeof y[p] !== typeof x[p]) {
		            return false;
		        }
		    }

		    for (p in x) {
		        if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
		            return false;
		        } else if (typeof y[p] !== typeof x[p]) {
		            return false;
		        }

		        switch (typeof(x[p])) {
		            case 'object':
		            case 'function':

		                leftChain.push(x);
		                rightChain.push(y);

		                if (!compare2Objects(x[p], y[p])) {
		                    return false;
		                }

		                leftChain.pop();
		                rightChain.pop();
		                break;

		            default:
		                if (x[p] !== y[p]) {
		                    return false;
		                }
		                break;
		        }
		    }

		    return true;
		}

		if (arguments.length < 1) {
		    return true; //Die silently? Don't know how to handle such case, please help...
		    // throw "Need two or more arguments to compare";
		}

		for (i = 1, l = arguments.length; i < l; i++) {

		    leftChain = []; //Todo: this can be cached
		    rightChain = [];

		    if (!compare2Objects(arguments[0], arguments[i])) {
		        return false;
		    }
		}

		return true;
	}
}

module.exports = Util;