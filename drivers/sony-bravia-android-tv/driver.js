const Homey = require('homey');

const SonyBraviaAndroidTvFinder = require('../../helpers/sony-bravia-android-tv-finder');

class SonyBraviaAndroidTvDriver extends Homey.Driver {
  onPair(socket) {
    socket.on('list_devices', (_devices, callback) => this.fetchAvailableDevices(callback, socket));
    socket.on('manual_input', (data, callback) => this.fetchDeviceDetails(data, callback));
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

  async fetchDeviceDetails(data, callback) {
    const device = SonyBraviaAndroidTvFinder.populateDeviceData(data.name, null, data.ipAddress, data.macAddress);

    try {
      const basicDevice = await SonyBraviaAndroidTvFinder.fetchBasicDeviceDetails(device);

      console.log('Got basic Sony BRAVIA Android TV data: ', basicDevice);

      callback(null, basicDevice);
    } catch (err) {
      callback(err, null);
    }
  }

  async fetchAvailableDevices(callback, socket) {
    const devices = await SonyBraviaAndroidTvFinder.getAllDevices();

    console.log('Found Sony BRAVIA Android TV\'s: ', devices);

    if (devices.length < 1) {
      socket.showView('not_found');
    }

    callback(null, devices);
  }
}

module.exports = SonyBraviaAndroidTvDriver;
