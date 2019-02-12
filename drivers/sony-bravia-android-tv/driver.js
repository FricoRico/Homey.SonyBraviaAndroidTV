"use strict";

const Homey = require('homey');

const SonyBraviaAndroidTvFinder = require('../../helpers/sony-bravia-android-tv-finder');

class SonyBraviaAndroidTvDriver extends Homey.Driver {
  onPair(socket) {
    socket.on('list_devices', (_devices, callback) => this.fetchAvailableDevices(callback));
    socket.on('preshared_key', (device, callback) => this.fetchExpandedDeviceDetails(device, callback));
  }

  async fetchExpandedDeviceDetails(device, callback) {
    try {
      const extendedDevice = await SonyBraviaAndroidTvFinder.fetchExtendDeviceDetails(device);

      console.log('Got extended Sony BRAVIA Android TV data: ', extendedDevice);

      callback(null, extendedDevice);
    } catch (err) {
      callback(err, null);
    }
  }

  async fetchAvailableDevices(callback) {
    const devices = await SonyBraviaAndroidTvFinder.getAllDevices();

    console.log('Found Sony BRAVIA Android TV\'s: ', devices);

    callback(null, devices);
  }
}

module.exports = SonyBraviaAndroidTvDriver;


// function searchItems(value, optionsArray) {

//   var serveItems = [];
//   for (var i = 0; i < optionsArray.length; i++) {
//     var serveItem = optionsArray[i];
//     if (serveItem.name.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
//       serveItems.push({ icon: "", name: serveItem.name });
//     }
//   }
//   return serveItems;
// }

