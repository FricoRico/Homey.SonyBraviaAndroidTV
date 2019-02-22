'use strict';

const {EventEmitter} = require('events');

class Entity extends EventEmitter {

	constructor() {
		super();

		Object.defineProperty(this, 'log', {
			value: this.log.bind(this)
		});

		Object.defineProperty(this, 'error', {
			value: this.error.bind(this)
		});

	}

	/**
	 * Log a message to the console (stdout)
	 * @param {...*} message
	 */
	log() {
		console.log.bind( this, `[${this.id||this.name||this.constructor.name}]` ).apply( this, arguments);
	}

	/**
	 * Log a message to the console (stderr)
	 * @param {...*} message
	 */
	error() {
    	console.error.bind( this, `[${this.id||this.name||this.constructor.name}]` ).apply( this, arguments);
	}
    
}

module.exports = Entity;