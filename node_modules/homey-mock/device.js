'use strict';

const Homey = require('homey');
const Entity = require('./entity');


const sDriver = Symbol();
const sReady = Symbol();
const sReadyFns = Symbol();
const sData = Symbol();
const sState = Symbol();
const sAvailable = Symbol();
const sName = Symbol();
const sClass = Symbol();
const sCapabilities = Symbol();
const sSettings = Symbol();
const sStore = Symbol();
const sAppId = Symbol();
const sCapabilityListeners = Symbol();
const sOnSettingsPending = Symbol();

class Device extends Entity {
    constructor({data, settings, state, store, name, deviceClass, capabilities}) {
        super();
        
        this[sName] = name || 'TestDevice';
		this[sClass] = deviceClass || 'TestClass';
		this[sCapabilities] = capabilities || [];
		this[sSettings] = settings || {};
		this[sState] = state || {};
        this[sStore] = store || {};
        this[sData] = data || {};
		this[sAppId] = 'com.test.testapp'; //TODO
        
        this.onInit();
    }
    
    /*
		Public methods
	*/

	getAppId() {
		return this[sAppId];
	}


	/**
	 * Pass a callback method, which is called when the Device is ready ({@link Device#onInit} has been run).
	 * The callback is executed immediately when the Drivers Manager was already ready.
	 * @param callback {Function}
	 */
	ready( callback ) {
		if( this[sReady] ) {
			callback();
		} else {
			this[sReadyFns].push( callback );
		}
	}

	/**
	 * Get the device's driver
	 * @returns {Driver} The device's driver instance
	*/
	getDriver() {
		return this[sDriver];
	}

	/**
	 * Get the device's state (capability values)
	 * @returns {Object} The device's state object
	*/
	getState() {
		return Homey.util.recursiveDeepCopy(this[sState]);
	}

	/**
	 * Get the device's data object
	 * @returns {Object} The device's data object
	*/
	getData() {
		return Homey.util.recursiveDeepCopy(this[sData]);
	}

	/**
	 * Get the device's availability
	 * @returns {boolean} If the device is marked as available
	*/
	getAvailable() {
		return this[sAvailable];
	}

	/**
	 * Set the device's availability to true
	 * @param {genericCallbackFunction} [callback]
	 * @returns {Promise}
	*/
	setAvailable( callback ) {
		this[sAvailable] = true;
		return Promise.resolve();
	}

	/**
	 * Set the device's availability to false, with a message
	 * @param message {string} - Custom unavailable message, or `null` for default
	 * @param {genericCallbackFunction} [callback]
	 * @returns {Promise}
	*/
	setUnavailable( message, callback ) {
		this[sAvailable] = false;
		return Promise.resolve();
	}

	 /**
	  * Get a device's setting value
	  * @param {String} key
	  * @returns {*} The value, or `null` when unknown
	  */
	 getSetting( key ) {
		 if( typeof this[sSettings][ key ] === 'undefined' )
		    return null;

		 return Homey.util.recursiveDeepCopy(this[sSettings][ key ]);
	 }

	/**
	 * Get the device's settings object
	 * @returns {Object} The device's settings object
	 * @tutorial Drivers-Settings
	*/
	getSettings( ) {
		return Homey.util.recursiveDeepCopy(this[sSettings]);
	}

	/**
	 * Set the device's settings object. The `newSettings` object may contain a subset of all settings.
	 * Note that the {@link Device#onSettings} method will not be called when the settings are changed programmatically.
	 * @param {Object} newSettings - A settings object
	 * @param {genericCallbackFunction} [callback]
	 * @returns {Promise}
	 * @tutorial Drivers-Settings
	*/
	setSettings(newSettings, callback) {

		if (typeof callback === 'function')
			return Homey.util.callbackAfterPromise(this, this.setSettings, arguments);

		if (this[sOnSettingsPending]) return Promise.reject(new Error('Cannot set Settings while this.onSettings is still pending'));

		return Promise.resolve();
	}

	/**
	 * Get an array of capabilities
	 * @returns {Array} The device's capabilities array
	 */
	getCapabilities() {
		return this[sCapabilities].slice();
	}

	/**
	 * Returns true if the device has a certain capability
	 * @param {string} capabilityId
	 * @returns {boolean}
	 */
	hasCapability( capabilityId ) {
		return this[sCapabilities].indexOf( capabilityId ) > -1;
	}

	/**
	 * Get the device's name
	 * @returns {string} The device's name
	 */
	getName() {
		return this[sName];
	}

	/**
	 * Get the device's class
	 * @returns {string} The device's class
	 */
	getClass() {
		return this[sClass];
	}

	/**
	 * Get a device's capability value
	 * @param {string} capabilityId
	 * @returns {*} The value, or `null` when unknown
	 */
	getCapabilityValue( capabilityId ) {
		if (typeof this[sState][ capabilityId ] === 'undefined') return null;
		return Homey.util.recursiveDeepCopy(this[sState][ capabilityId ]);
	}

	/**
	 * Set a device's capability value
	 * @param {string} capabilityId
	 * @param {*} value
	 * @param {genericCallbackFunction} [callback]
	 * @returns {Promise}
	 */
	setCapabilityValue( capabilityId, value, callback ) {

		if( typeof callback === 'function' )
			return Homey.util.callbackAfterPromise( this, this.setCapabilityValue, arguments );

        this[sState][ capabilityId ] = value;
        return Promise.resolve();
	}

	/**
	 * Register a listener for a capability change event.
	 * This is invoked when a device's state change is requested.
	 * @param {string} capabilityId
	 * @param {Function} fn
	 * @param {Mixed} fn.value - The new value
	 * @param {Object} fn.opts - An object with optional properties, e.g. `{ duration: 300 }`
	 * @param {genericCallbackFunction} fn.callback
	 * @example
	 * this.registerCapabilityListener('dim', ( value, opts ) => {
	 *   this.log('value', value);
	 *   this.log('opts', opts);
	 *   return Promise.resolve();
	 * });
	 */
	registerCapabilityListener( capabilityId, fn ) {
		this[sCapabilityListeners][ capabilityId ] = fn;
	}

	/**
	 * Register a listener for multiple capability change events. The callback is debounced with `timeout`
	 * This is invoked when a device's state change is requested.
	 * @param {string[]} capabilityIds
	 * @param {Function} fn
	 * @param {Mixed} fn.valueObj - An object with the changed capability values, e.g. `{ dim: 0.5 }`
	 * @param {Object} fn.optsObj - An object with optional properties, per capability, e.g. `{ dim: { duration: 300 } }`
	 * @param {genericCallbackFunction} fn.callback
	 * @param {number} timeout - The debounce timeout
	 * @example
	 * this.registerMultipleCapabilityListener([ 'dim', 'light_hue', 'light_saturation' ], ( valueObj, optsObj ) => {
	 *   this.log('valueObj', valueObj);
	 *   this.log('optsObj', optsObj);
	 *   return Promise.resolve();
	 * }, 500);
	 */
	registerMultipleCapabilityListener( capabilityIds, fn, timeout ) {

		let valueObj = {};
		let optsObj = {};
		let callbackObj = {};

		let debounceTimeout;
		let debounceFunction = () => {
			if( typeof fn === 'function' ) {

				let callback = ( err, result ) => {
					for( let capabilityId in callbackObj ) {
						if( typeof callbackObj[capabilityId] === 'function' ) {
							callbackObj[capabilityId]( err, result );
						}
					}
					valueObj = {};
					optsObj = {};
					callbackObj = {};
				};

				let result = fn( valueObj, optsObj, callback );
				if( result instanceof Promise ) {
					result
						.then( res => {
							callback( null, res );
						})
						.catch( err => {
							callback( err );
						})
				}


			} else {
				return callback( null );
			}
		};

		capabilityIds.forEach(capabilityId => {
			this.registerCapabilityListener( capabilityId, ( value, opts, callback ) => {

				valueObj[ capabilityId ] = value;
				optsObj[ capabilityId ] = opts;
				callbackObj[ capabilityId ] = callback;

				if( debounceTimeout ) clearTimeout(debounceTimeout);
					debounceTimeout = setTimeout(debounceFunction, timeout);

			});
		});
	}


	/**
	 * Trigger a capability listener programmatically.
	 * @param {string} capabilityId
	 * @param {Mixed} value
	 * @param {Object} opts
	 * @param {genericCallbackFunction} [callback]
	 * @returns {Promise}
	 */
	triggerCapabilityListener( capabilityId, value, opts = {}, callback ) {

		if( typeof callback === 'function' )
			return Homey.util.callbackAfterPromise( this, this.triggerCapabilityListener, arguments );

		let capabilityListener = this[sCapabilityListeners][ capabilityId ] || new Error('invalid_capability_listener');
		if( capabilityListener instanceof Error ) return Promise.reject( capabilityListener );

		return new Promise((resolve, reject) => {
			let result = capabilityListener(value, opts, (err) => err ? reject(err) : resolve());
			if (result instanceof Promise) resolve(result);
		}).then(() => {
			return this.setCapabilityValue(capabilityId, value)
				.catch(err => {
					// Handle capability_not_getable error since we have no way to check this at the app side
					if (err && err.message === 'capability_not_getable') {
						return;
					}
					return Promise.reject(err);
				});
		});
	}

	/**
	 * Get the entire store
	 * @returns {Object}
	 */
	getStore() {
		return Homey.util.recursiveDeepCopy(this[sStore]);
	}

	/**
	 * Get all store keys.
	 * @returns {String[]}
	 */
	getStoreKeys() {
		return Object.keys(this[sStore]);
	}

	/**
	 * Get a store value.
	 * @param {string} key
	 * @returns {*} value
	 */
	getStoreValue( key ) {

		if( typeof key !== 'string' )
			throw new Error('Cannot get store value, key must be of type string');

		if (typeof this[sStore][ key ] === 'undefined')
			return null;

		return Homey.util.recursiveDeepCopy(this[sStore][ key ]);
	}

	/**
	 * Set a store value.
	 * @param {string} key
	 * @param {*} value
	 * @param {Function} [callback]
	 * @param {Error} callback.err
	 * @param {Object} callback.store - The new store
	 * @returns {Promise}
	 */
	setStoreValue( key, value, callback ) {

		if( typeof key !== 'string' )
			throw new Error('Cannot get store value, key must be of type string');

		this[sStore][ key ] = Homey.util.recursiveDeepCopy(value);

		return Promise.resolve();

	}


	/**
	 * Unset a store value.
	 * @param {string} key
	 * @param {Function} [callback]
	 * @param {Error} callback.err
	 * @param {Object} callback.store - The new store
	 * @returns {Promise}
	 */
	unsetStoreValue( key, callback ) {

		if( typeof key !== 'string' )
			throw new Error('Cannot get store value, key must be of type string');

		delete this[sStore][ key ];

		return Promise.resolve();

	}

	destroy() {
		this.removeAllListeners();
	}


	/*
		Overrideable methods
	*/

	/**
	 * @callback Device~settingsCallback
	 * @param {Error} [err] - Show a custom error message to the user upon saving the settings
	 * @param {string} [result] - A custom success message. Leave empty for the default message.
	*/

	/**
	 * This method is called when the user updates the device's settings.
	 * @param oldSettings {Object} The old settings object
	 * @param newSettings {Object} The new settings object
	 * @param changedKeys {Array} An array of keys changed since the previous version
	 * @param callback {Device~settingsCallback}
	 * @tutorial Drivers-Settings
	*/
	onSettings( oldSettings, newSettings, changedKeys, callback ) {
		callback( null, true );
	}

	/**
	 * This method is called when the user updates the device's name. Use this to synchronize the name to the device or bridge.
	 * @param name {string} The new name
	*/
	onRenamed( name ) {

	}

	/**
	 * This method is called when the user deleted the device.
	*/
	onDeleted() {

	}

	/**
	 * This method is called when the user adds the device, called just after pairing.
	*/
	onAdded() {

	}

	/**
	 * This method is called when the device is loaded, and properties such as name, capabilities and state are available.
	*/
	onInit() {

	}
}

module.exports = Device;