'use strict';

const Homey = require('homey');
const path = require('path');
const Entity = require('./entity');

const sManifest = Symbol();
const sDevices = Symbol();
const sDevicesById = Symbol();
const sReady = Symbol();
const sReadyFns = Symbol();


function getDeviceClass(appRoot, id) {
    return require(path.join(appRoot, 'drivers', id, 'device.js'));
}

class Driver extends Entity {
    
    constructor(id, deviceDatas) {
        super();
        this.id = id;
        
        this[sManifest] = Homey.manifest;
		this[sDevices] = [];
		this[sDevicesById] = {};
		this[sReady] = false;
		this[sReadyFns] = [];
        
        const DeviceClass = getDeviceClass(Homey.appRoot, id);
        this[sDevices] = deviceDatas.map(data => new DeviceClass(data));
        process.nextTick(() => {
            this[sReady] = true;
            this[sReadyFns].forEach( readyFn => readyFn() );
        });
    }
    
    
	ready( callback ) {
		if( this[sReady] ) {
			callback();
		} else {
			this[sReadyFns].push( callback );
		}
	}

	getDevices() {
		return this[sDevices];
	}


	getDevice( deviceData ) {

		for( let i = 0; i < this[sDevices].length; i++ ) {
			if( Driver.isEqualDeviceData(this[sDevices][i].getData(), deviceData ) )
				return this[sDevices][i];
		}
		return new Error('invalid_device');
	}

	getDeviceById( deviceId ) {
		return this[sDevicesById][ deviceId ] || new Error('invalid_device');
	}

	getManifest() {
		return Homey.util.recursiveDeepCopy(this[sManifest]);
	}

	/*
		Overrideable methods
	*/

	onInit() {
		// placeholder
	}


	onPair( socket ) {
		socket
			.on('list_devices', this.onPairListDevices.bind(this));
	}


	onPairListDevices( data, callback ) {
		callback( null, [] );
	}

	 
	/*
		 Static methods
	*/
	static isEqualDeviceData( deviceDataA, deviceDataB ) {
		return Homey.util.deepCompare( deviceDataA, deviceDataB )
		//return JSON.stringify(deviceDataA) === JSON.stringify(deviceDataB);
	}
    
}

module.exports = Driver;