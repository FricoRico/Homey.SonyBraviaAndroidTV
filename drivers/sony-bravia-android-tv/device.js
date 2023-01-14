const Homey = require('homey');

const SonyBraviaAndroidTvCommunicator = require('../../helpers/sony-bravia-android-tv-communicator');
const SonyBraviaCapabilities = require('../../definitions/capabilities');

class SonyBraviaAndroidTvDevice extends Homey.Device {
  onInit() {
    this.data = this.generateDeviceObject();

    console.log(`${this.data.name} initialized.`);

    this.setCapabilityListeners();
    this.checkDeviceInterval(this.data.settings.polling);

  }

  onDeleted() {
    this.data = this.generateDeviceObject();

    console.log(`${this.data.name} deleting.`);

    this.clearIntervals();
  }

    /**
   * onSettings is called when the user updates the device's settings.
   * @param {object} event the onSettings event data
   * @param {object} event.oldSettings The old settings object
   * @param {object} event.newSettings The new settings object
   * @param {string[]} event.changedKeys An array of keys changed since the previous version
   * @returns {Promise<string|void>} return a custom message that will be displayed
   */
    async onSettings({ oldSettings, newSettings, changedKeys }) {
      this.log(`[Device] ${this.getName()}: ${this.getData().id} settings where changed: ${changedKeys}`);

      this.clearIntervals();
      this.checkDeviceInterval(newSettings.polling);
    }
  
  generateDeviceObject() {
    return {
      name: this.getName(),
      data: this.getData(),
      state: this.getState(),
      settings: this.getSettings(),
      capabilities: this.getCapabilities()
    }
  }

  async setCapabilityListeners() {
    SonyBraviaCapabilities.forEach(capability => {
      this.registerCapabilityListener(capability.name, async value => {
        try {
          return await capability.function(this, value);
        } catch (err) {
          console.log(`${this.data.name} capability listener could not be executed: `, err);
        }
      });
    });
  }

  async checkDeviceInterval(interval) {
    // Interval settings is in minutes, convert to milliseconds.
    interval = interval * 1000 * 60;
    try {
      this.log(`[Device] ${this.getName()}: ${this.getData().id} onPollInterval =>`, interval);
      this.onPollInterval = setInterval(this.checkDevice.bind(this), interval);
    } catch (error) {
      this.log(error);
    }
  }

  async clearIntervals() {
    try {
      this.log(`[Device] ${this.getName()}: ${this.getData().id} clearIntervals`);
      clearInterval(this.onPollInterval);
    } catch (error) {
      this.log(error);
    }
  }

  async checkDevice() {
    this.checkDeviceAvailability();
    this.checkDevicePowerState();
  }

  async checkDeviceAvailability() {
    try {
      await SonyBraviaAndroidTvCommunicator.getDeviceAvailability(this);
      return this.setAvailable();
    } catch (err) {
      return this.setUnavailable();
    }
  }

  async checkDevicePowerState() {
    try {
      const state = await SonyBraviaAndroidTvCommunicator.getDevicePowerState(this);

      this.log(`[Device] ${this.getName()}: ${this.getData().id} current power state: `, state);

      return this.setCapabilityValue('onoff', state === 'active' ? true : false);
    } catch (err) {
      this.setCapabilityValue('onoff', false);
    }
  }

}

module.exports = SonyBraviaAndroidTvDevice;