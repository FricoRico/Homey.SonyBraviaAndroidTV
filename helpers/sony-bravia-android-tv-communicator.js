const Homey = require('homey');

const Fetch = require('node-fetch');

class SonyBraviaAndroidTVCommunicator extends Homey.SimpleClass {
  constructor() {
    super();
  }

  async getDeviceAvailability(device) {
    try {
      return await Fetch(`http://${device.settings.ip}/sony/system`, {
        method: 'POST',
        cache: 'no-cache',
        headers: {
          'X-Auth-PSK': device.settings.psk,
          'Content-Type': 'application/json',
          'cache-control': 'no-cache'
        },
        body: JSON.stringify({
          method: 'getPowerStatus',
          params: [],
          id: 2,
          version: '1.0'
        })
      });
    } catch (err) {
      console.error(`An error occured fetching ${device.name} availability: `, err);
      throw err;
    }
  }

  async getDevicePowerState(device) {
    try {
      const response = await Fetch(`http://${device.settings.ip}/sony/system`, {
        method: 'POST',
        cache: 'no-cache',
        headers: {
          'X-Auth-PSK': device.settings.psk,
          'Content-Type': 'application/json',
          'cache-control': 'no-cache'
        },
        body: JSON.stringify({
          method: 'getPowerStatus',
          params: [],
          id: 2,
          version: '1.0'
        })
      });

      const parsedResponse = (await response.json()).result.shift();

      return parsedResponse.status;
    } catch (err) {
      console.error(`An error occured fetching ${device.name} power state: `, err);
      throw err;
    }
  }
}

module.exports = new SonyBraviaAndroidTVCommunicator()