const Homey = require('homey');

const SonyBraviaAndroidTvFinder = require('../../helpers/sony-bravia-android-tv-finder');

class SonyBraviaAndroidTvDriver extends Homey.Driver {
  onPair(session) {
    session.setHandler('list_devices', async () => await this.fetchAvailableDevices(session));
    session.setHandler('manual_input', async (data) => await this.fetchDeviceDetails(data));
    session.setHandler('preshared_key', async (device) => await this.fetchExpandedDeviceDetails(device));
  }

  async fetchExpandedDeviceDetails(device, callback) {
    try {
      const extendedDevice =
        await SonyBraviaAndroidTvFinder.fetchExtendDeviceDetails(device);

      this.log('Got extended Sony BRAVIA Android TV data: ', extendedDevice);

      return extendedDevice;
    } catch (err) {
      this.err(err);
    }

    return null;
  }

  async fetchDeviceDetails(data) {
    const device = SonyBraviaAndroidTvFinder.populateDeviceData(
      data.name,
      null,
      data.ipAddress,
      data.macAddress
    );

    try {
      const basicDevice =
        await SonyBraviaAndroidTvFinder.fetchBasicDeviceDetails(device);

      this.log('Got basic Sony BRAVIA Android TV data: ', basicDevice);

      return basicDevice;
    } catch (err) {
      this.err(err);
    }

    return null;
  }

  async fetchAvailableDevices(session) {
    const devices = await SonyBraviaAndroidTvFinder.getAllDevices();

    this.log('Found Sony BRAVIA Android TV\'s: ', devices);

    if (devices.length < 1) {
      session.showView('not_found');
    }

    return devices;
  }
}

module.exports = SonyBraviaAndroidTvDriver;
