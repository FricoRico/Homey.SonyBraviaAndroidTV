const Homey = require('homey');

const SonyBraviaAndroidTvCommunicator = require('../../helpers/sony-bravia-android-tv-communicator');
const SonyBraviaFlowActions = require('../../definitions/flow-actions');
const SonyBraviaCapabilities = require('../../definitions/capabilities');

class SonyBraviaAndroidTvDevice extends Homey.Device {
  onInit() {
    this.data = this.generateDeviceObject();

    console.log(`${this.data.name} initialized.`);

    this.registerTasks();
    this.registerFlowListeners();
    this.registerCapabilityListeners();
  }

  onDeleted() {
    this.data = this.generateDeviceObject();

    console.log(`${this.data.name} deleting.`);

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
    this.data.settings = newSettings;

    if (changedKeys.indexOf('polling') !== -1) {
      this.registerTasks();
    }

    this.clearWarning();

    callback(null, newSettings);
  }

  async registerTasks() {
    await this.unregisterTasks();

    const cronTaskName = `SBAT:${this.data.data.cid}`;
    const cronPollingInterval = `*/${this.data.settings.polling} * * * *`;

    try {
      const cronTask = await Homey.ManagerCron.registerTask(cronTaskName.toLowerCase(), cronPollingInterval);

      console.log(`${this.data.name} task registerd with name: `, cronTaskName.toLowerCase());

      this.awaitTask(cronTask);
    } catch (err) {
      console.error(`${this.data.name} task could not be registered.`, err);
    }
  }

  async unregisterTasks() {
    const cronTaskName = `SBAT:${this.data.data.cid}`;

    try {
      await Homey.ManagerCron.unregisterTask(cronTaskName.toLowerCase());

      console.log(`${this.data.name} task unregisterd with name: `, cronTaskName.toLowerCase());
    } catch (_err) { }
  }

  async registerCapabilityListeners() {
    SonyBraviaCapabilities.forEach(capability => {
      this.registerCapabilityListener(capability.name, async value => {
        try {
          return await capability.function(this, this.data, value);
        } catch (err) {
          this.showWarning(err);

          console.log(`${this.data.name} capability listener could not be executed: `, err);
        }
      });
    });
  }

  registerFlowListeners() {
    SonyBraviaFlowActions.forEach(flow => {
      try {
        const flowCard = new Homey.FlowCardAction(flow.action).register();

        flowCard.registerRunListener(async (args, state) => {
          try {
            flow.parsedCommand = flow.command;

            if (flow.command instanceof Function) {
              flow.parsedCommand = flow.command(args, state)
            }

            console.log(`${this.data.name} starting flow:  ${flow.action}  and sending command: `, flow.parsedCommand);

            return await SonyBraviaAndroidTvCommunicator.sendCommand(this, this.data, flow.action, flow.parsedCommand);
          } catch (err) {
            this.showWarning(err);

            console.log(`${this.data.name} flow command could not be executed: `, flow, err);
          }
        });
      } catch (err) {
        console.log(`${this.data.name} flow command could not be registered: `, flow, err);
      }
    });
  }

  awaitTask(cronTask) {
    if (!cronTask) {
      return;
    }

    cronTask.on('run', () => {
      const now = new Date().toJSON();

      console.log(`${this.data.name} task executed at time: `, now);

      this.checkDeviceAvailability();
      this.checkDevicePowerState();
    });

    console.log(`${this.data.name} awaiting for task execution, every: ${this.data.settings.polling} minute(s).`);
  }

  async checkDeviceAvailability() {
    try {
      await SonyBraviaAndroidTvCommunicator.getDeviceAvailability(this.data);
      return this.setAvailable();
    } catch (err) {
      this.showWarning(err);

      return this.setUnavailable();
    }
  }

  async checkDevicePowerState() {
    try {
      const state = await SonyBraviaAndroidTvCommunicator.getDevicePowerState(this.data);

      console.log(`${this.data.name} current power state: `, state);

      return this.setCapabilityValue('onoff', state === 'active' ? true : false);
    } catch (err) {
      this.showWarning(err);

      this.setCapabilityValue('onoff', false);
    }
  }

  clearWarning() {
    return this.setAvailable();
  }

  showWarning(err) {
    if (err.code === 403) {
      return this.setUnavailable(Homey.__('errors.authentication'));
    }

    return this.setWarning(Homey.__('errors.unknown'));
  }
}

module.exports = SonyBraviaAndroidTvDevice;