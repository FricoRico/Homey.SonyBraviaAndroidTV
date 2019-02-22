const Homey = require('homey');

const Fetch = require('node-fetch');
const WakeOnLan = require('wol');

const RemoteControlCodes = require('../../definitions/remote-control-codes')

class SonyBraviaAndroidTVCommunicator extends Homey.SimpleClass {
  constructor() {
    super();
  }

  async getDeviceAvailability(data) {
    try {
      const response = await Fetch(`http://${data.settings.ip}/sony/system`, {
        method: 'POST',
        cache: 'no-cache',
        headers: {
          'X-Auth-PSK': data.settings.psk,
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
      console.error(`An error occured fetching ${data.name} availability: `, err);
      throw err;
    }
  }

  async getDevicePowerState(data) {
    try {
      const response = await Fetch(`http://${data.settings.ip}/sony/system`, {
        method: 'POST',
        cache: 'no-cache',
        headers: {
          'X-Auth-PSK': data.settings.psk,
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
      console.error(`An error occured fetching ${data.name} power state: `, err);
      throw err;
    }
  }

  async setDevicePowerState(device, data, state) {
    if (!state) {
      return await this.sendCommand(device, data, null, 'PowerOff');
    }

    if (!data.settings.useWOL) {
      return await this.sendCommand(device, data, null, 'PowerOn');
    }

    return await this.sendWakeOnLanCommand(data);
  }

  async sendWakeOnLanCommand(data) {
    try {
      return await WakeOnLan.wake(data.settings.macAddress, (err, result) => {
        if (err) {
          throw err;
        }

        return result;
      });
    } catch (err) {
      console.error(`An error occured trying to wake ${data.name} with wake-on-lan command: `, err);
      throw err;
    }
  }

  async sendCommand(device, data, action, command) {
    try {
      if (action) {
        new Homey.FlowCardTriggerDevice(action).register().trigger(device, { token: command });
      }

      const response = await Fetch(`http://${data.settings.ip}/sony/IRCC`, {
        method: 'POST',
        cache: 'no-cache',
        headers: {
          'X-Auth-PSK': data.settings.psk,
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
      console.error(`An error occured sending command to ${data.name}: `, err);
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