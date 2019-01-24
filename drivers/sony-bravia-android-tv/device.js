const Homey = require('homey');

const sonyBraviaAndroidTvCommunicator = require('../../helpers/sony-bravia-android-tv-communicator');

class SonyBraviaAndroidTvDevice extends Homey.Device {
  onInit() {
    this.device = this.generateDeviceObject();

    this.log(`${this.device.name} initialized.`);

    this.registerTasks();
  }

  onDeleted() {
    this.device = this.generateDeviceObject();

    this.log(`${this.device.name} deleting.`);

    this.unregisterTasks();
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

  async onSettings(_oldSettings, newSettings, changedKeys, callback) {
    this.device.settings = newSettings;

    if (changedKeys.indexOf('polling') !== -1) {
      this.registerTasks();
    }

    callback(null, newSettings);
  }

  async registerTasks() {
    await this.unregisterTasks();

    const cronTaskName = `SBAT:${this.device.data.cid}`;
    const cronPollingInterval = `*/${this.device.settings.polling} * * * *`;

    try {
      const cronTask = await Homey.ManagerCron.registerTask(cronTaskName.toLowerCase(), cronPollingInterval);

      console.log(`${this.device.name} task registerd with name: `, cronTaskName.toLowerCase());

      this.awaitTask(cronTask);
    } catch (err) {
      console.error(`${this.device.name} task could not be registered.`, err);
    }
  }

  async unregisterTasks() {
    const cronTaskName = `SBAT:${this.device.data.cid}`;

    try {
      await Homey.ManagerCron.unregisterTask(cronTaskName.toLowerCase());

      console.log(`${this.device.name} task unregisterd with name: `, cronTaskName.toLowerCase());
    } catch (_err) { }
  }

  awaitTask(cronTask) {
    if (!cronTask) {
      return;
    }

    cronTask.on('run', () => {
      const now = new Date().toJSON();

      console.log(`${this.device.name} task executed at time: `, now);

      this.checkDeviceAvailability();
      this.checkDevicePowerState();
    });

    console.log(`${this.device.name} awaiting for task execution, every: ${this.device.settings.polling} minute(s).`);
  }

  async checkDeviceAvailability() {
    try {
      await sonyBraviaAndroidTvCommunicator.getDeviceAvailability(this.device);

      return this.setAvailable();
    } catch (err) {
      if (err.code === 403) {
        this.setWarning(`Authentication with ${this.device.name} failed, check pre-shared key settings.`);
      }

      return this.setUnavailable();
    }
  }

  async checkDevicePowerState() {
    try {
      const state = await sonyBraviaAndroidTvCommunicator.getDevicePowerState(this.device);

      console.log(`${this.device.name} current power state: `, state);

      this.setCapabilityValue('onoff', state === 'active' ? true : false);
    } catch (err) {
      if (err.code === 403) {
        this.setWarning(`Authentication with ${this.device.name} failed, check pre-shared key settings.`);
      }

      this.setCapabilityValue('onoff', false);
    }
  }
}

module.exports = SonyBraviaAndroidTvDevice;