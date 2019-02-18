const Homey = require('homey');

const SonyBraviaAndroidTvCommunicator = require('../../helpers/sony-bravia-android-tv-communicator');
const SonyBraviaFlowActions = require('../../definitions/flow-actions');

class SonyBraviaAndroidTvDevice extends Homey.Device {
  onInit() {
    this.data = this.generateDeviceObject();

    this.log(`${this.data.name} initialized.`);

    this.registerTasks();
    this.registerFlows();
    this.registerCapabilitiesListeners();
  }

  onDeleted() {
    this.data = this.generateDeviceObject();

    this.log(`${this.data.name} deleting.`);

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

  async registerCapabilitiesListeners() {
    this.registerCapabilityListener('onoff', async value => {
      try {
        console.log(`${this.data.name} setting device power state to: `, value ? 'ON' : 'OFF');

        return await SonyBraviaAndroidTvCommunicator.setDevicePowerState(this, this.data, value);
      } catch (err) {
        console.log(`${this.data.name} could not register onoff capability listener: `, err);
      }
    });

    this.registerCapabilityListener('channel_up', async () => {
      try {
        console.log(`${this.data.name} turning channel up.`);

        return await SonyBraviaAndroidTvCommunicator.sendCommand(this, this.data, null, 'ChannelUp');
      } catch (err) {
        console.log(`${this.data.name} could not turn channel up: `, err);
      }
    });

    this.registerCapabilityListener('channel_down', async () => {
      try {
        console.log(`${this.data.name} turning channel down.`);

        return await SonyBraviaAndroidTvCommunicator.sendCommand(this, this.data, null, 'ChannelDown');
      } catch (err) {
        console.log(`${this.data.name} could not turn volume down: `, err);
      }
    });

    this.registerCapabilityListener('volume_up', async () => {
      try {
        console.log(`${this.data.name} turning volume up.`);

        return await SonyBraviaAndroidTvCommunicator.sendCommand(this, this.data, null, 'VolumeUp');
      } catch (err) {
        console.log(`${this.data.name} could not turn volume up: `, err);
      }
    });

    this.registerCapabilityListener('volume_down', async () => {
      try {
        console.log(`${this.data.name} turning volume down.`);

        return await SonyBraviaAndroidTvCommunicator.sendCommand(this, this.data, null, 'VolumeDown');
      } catch (err) {
        console.log(`${this.data.name} could not turn volume down: `, err);
      }
    });

    this.registerCapabilityListener('volume_mute', async value => {
      try {
        if (value) {
          console.log(`${this.data.name} muting the sound.`);

          return await SonyBraviaAndroidTvCommunicator.sendCommand(this, this.data, null, 'Mute');
        }

        return await SonyBraviaAndroidTvCommunicator.sendCommand(this, this.data, null, 'UnMute');
      } catch (err) {
        console.log(`${this.data.name} could not mute/unmute sound: `, err);
      }
    });
  }

  registerFlows() {
    SonyBraviaFlowActions.forEach(flow => {
      try {
        const flowCard = new Homey.FlowCardAction(flow.action).register();

        flowCard.registerRunListener(async (args, state) => {
          flow.parsedCommand = flow.command;

          if (flow.command instanceof Function) {
            flow.parsedCommand = flow.command(args, state)
          }

          console.log(`${this.data.name} starting flow:  ${flow.action}  and sending command: `, flow.parsedCommand);

          await SonyBraviaAndroidTvCommunicator.sendCommand(this, this.data, flow.action, flow.parsedCommand);
        });
      } catch (err) {
        console.log(`${this.data.name} flow command could not be executed: `, flow, err);
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
      if (err.code === 403) {
        this.setWarning(`Authentication with ${this.data.name} failed, check pre-shared key settings.`);
      }

      return this.setUnavailable();
    }
  }

  async checkDevicePowerState() {
    try {
      const state = await SonyBraviaAndroidTvCommunicator.getDevicePowerState(this.data);

      console.log(`${this.data.name} current power state: `, state);

      this.setCapabilityValue('onoff', state === 'active' ? true : false);
    } catch (err) {
      if (err.code === 403) {
        this.setWarning(`Authentication with ${this.data.name} failed, check pre-shared key settings.`);
      }

      this.setCapabilityValue('onoff', false);
    }
  }
}

module.exports = SonyBraviaAndroidTvDevice;