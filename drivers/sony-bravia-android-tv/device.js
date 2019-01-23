const Homey = require('homey');

class SonyBraviaAndroidTvDevice extends Homey.Device {
  async onInit() {
    this.log(`${this.getName()} initialized`);

    this.awaitTask(await this.getTask());
  }

  onAdded() {
    this.registerTasks()
  }

  onDeleted() {
    this.unregisterTasks();
  }

  onSettings(_, _, changedKeys) {
    if (changedKeys.indexOf('polling') === -1) {
      return;
    }

    this.registerTasks();
  }

  async getTask() {
    const cronTaskName = `SBAT:${this.getData().id}`;

    try {
      return await Homey.ManagerCron.getTask(cronTaskName);
    } catch (err) {
      console.log(`${this.getName()} task could not be found with name: `, cronTaskName);
    }
  }

  async registerTasks() {
    await this.unregisterTasks();

    const cronTaskName = `SBAT:${this.getData().id}`;
    const cronPollingInterval = `*/${this.getSetting('polling')}' * * * *`;

    try {
      const cronTask = await Homey.ManagerCron.registerTask(cronTaskName, cronPollingInterval, this.getData());

      console.log(`${this.getName()} task registerd.`);

      this.awaitTask(cronTask);
    } catch (err) {
      console.error(`${this.getName()} task could not be registered.`, err);
    }
  }

  async unregisterTasks() {
    const cronTaskName = `SBAT:${this.getData().id}`;

    try {
      await Homey.ManagerCron.unregisterTask(cronTaskName);

      console.log(`${this.getName()} task unregisterd.`);
    } catch (_) { }
  }

  async awaitTask(cronTask) {
    if (!cronTask) {
      return;
    }

    cronTask.on('run', (device) => {
      const now = new Date().toJSON();

      console.log(`${this.getName()} task executed at time: `, now, ' with data: ', device);
    });

    console.log(`${this.getName()} awaiting for task execution, every: ${this.getSetting('polling')} minute(s).`);
  }
}

module.exports = SonyBraviaAndroidTvDevice;