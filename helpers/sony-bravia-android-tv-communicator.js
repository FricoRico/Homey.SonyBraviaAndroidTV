const Homey = require('homey');

const Fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const RemoteControlCodes = require('../../definitions/remote-control-codes')

class SonyBraviaAndroidTVCommunicator extends Homey.SimpleClass {
  constructor() {
    super();
  }

  async getDeviceAvailability(device) {
    const settings = device.getSettings();

    try {
      const response = await Fetch(`http://${settings.ip}/sony/system`, {
        method: 'POST',
        cache: 'no-cache',
        headers: {
          'X-Auth-PSK': settings.psk,
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

      if (response.status !== 200) {
        throw this.generateError(response);
      }

      const parsedResponse = (await response.json()).result.shift();

      return parsedResponse;
    } catch (err) {
      console.error(`An error occured fetching availability: `, err);
      throw err;
    }
  }

  async getDevicePowerState(device) {
    const settings = device.getSettings();
    try {
      const response = await Fetch(`http://${settings.ip}/sony/system`, {
        method: 'POST',
        cache: 'no-cache',
        headers: {
          'X-Auth-PSK': settings.psk,
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

      if (response.status !== 200) {
        throw this.generateError(response);
      }

      const parsedResponse = (await response.json()).result.shift();

      return parsedResponse.status;
    } catch (err) {
      console.error(`An error occured fetching power state: `, err);
      throw err;
    }
  }

  async setDevicePowerState(device, state) {
    if (!state) {
      return await this.sendCommand(device, 'PowerOff');
    }

    return await this.sendCommand(device, 'PowerOn');
  }

  async sendCommand(device, command) {
    const settings = device.getSettings();
    console.log(settings);

    try {
      const response = await Fetch(`http://${settings.ip}/sony/IRCC`, {
        method: 'POST',
        cache: 'no-cache',
        headers: {
          'X-Auth-PSK': settings.psk,
          'SOAPACTION': '"urn:schemas-sony-com:service:IRCC:1#X_SendIRCC"',
          'cache-control': 'no-cache'
        },
        body: this.generateCommandRequest(RemoteControlCodes[command])
      });

      if (response.status !== 200) {
        throw this.generateError(response);
      }

      return response;
    } catch (err) {
      console.error(`An error occured sending command: `, err);
      throw err;
    }
  }

  generateError(err) {
    const error = new Error(err.statusText);
    error.code = err.status;

    return error;
  }

  generateCommandRequest(code) {
    return `<?xml version="1.0"?>
      <s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/" s:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
        <s:Body>
          <u:X_SendIRCC xmlns:u="urn:schemas-sony-com:service:IRCC:1">
            <IRCCCode>${code}</IRCCCode>
          </u:X_SendIRCC>
        </s:Body>
      </s:Envelope>`;
  }
}

module.exports = new SonyBraviaAndroidTVCommunicator()