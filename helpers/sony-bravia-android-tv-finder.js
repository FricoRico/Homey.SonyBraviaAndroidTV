const Homey = require('homey');

const SsdpClient = require('node-ssdp').Client;
const Fetch = require('node-fetch');
const DeepMerge = require('deepmerge');

const BaseName = 'Sony BRAVIA Android TV';

class SonyBraviaAndroidTvFinder extends Homey.SimpleClass {
  constructor() {
    super();

    this.ssdpClient = new SsdpClient();
    this.ssdpClient.on('response', headers => this.onDeviceResponse(headers));

    this.foundDevices = [];
  }

  clearDevices() {
    while (this.foundDevices.length > 0) {
      this.foundDevices.pop();
    }
  }

  async onDeviceResponse(headers) {
    const device = this.validateDeviceHeaders(headers);

    if (!device) {
      return;
    }

    const validatedDevice = await this.fetchBasicDeviceDetails(device);

    if (!validatedDevice) {
      return;
    }

    this.foundDevices.push(validatedDevice);
  }

  getAllDevices() {
    this.scanForDevices();

    return new Promise(resolve => {
      setTimeout(() => {
        resolve(this.foundDevices);
      }, 5000); //@TODO: Make timeout variable
    });
  }

  scanForDevices() {
    this.clearDevices();

    this.ssdpClient.search('upnp:rootdevice');
  }

  validateDeviceHeaders(headers) {
    if (headers.LOCATION.indexOf('sony') <= 0) {
      return null;
    }

    const ipAddress = headers.LOCATION.match(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/).shift();
    console.log('Sony BRAVIA Android TV found on: ', ipAddress);

    const device = this.populateDeviceData(null, headers.USN, ipAddress, null);

    return device;
  }

  populateDeviceData(name, id, ipAddress, macAddress) {
    return {
      name: name || BaseName,
      data: {
        id: id || '',
        type: 'device',
        class: 'tv',
        product: '',
        region: '',
        language: '',
        model: '',
        serial: '',
        generation: '',
        name: '',
        area: '',
        cid: '',
        valid: false,
      },
      state: {
        onoff: false
      },
      settings: {
        ip: ipAddress,
        psk: '',
        polling: 5,
        macAddress: macAddress || '',
      },
      capabilities: [
        'onoff',
        'channel_up',
        'channel_down',
        'volume_up',
        'volume_down',
        'volume_mute'
      ]
    }
  }

  async fetchBasicDeviceDetails(device) {
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
          method: 'getInterfaceInformation',
          params: [],
          id: 2,
          version: '1.0'
        })
      });

      const parsedResponse = (await response.json()).result.shift();

      if (parsedResponse.modelName.substring(2, 0) !== 'KD') {
        return null;
      }

      console.log('Sony BRAVIA Android TV basic details found: ', parsedResponse);

      const name = device.name === BaseName ? `Sony ${parsedResponse.productName} ${parsedResponse.modelName}` : device.name;

      return DeepMerge(device, {
        name: name,
        data: {
          valid: true
        }
      });
    } catch (err) {
      console.error('An error occured fetching basic device details: ', err);
      throw err;
    }
  }

  async fetchExtendDeviceDetails(device) {
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
          method: 'getSystemInformation',
          params: [],
          id: 5,
          version: '1.0'
        })
      });

      const parsedResponse = (await response.json()).result.shift();

      console.log('Sony BRAVIA Android TV extended details found: ', parsedResponse);

      const macAddress = device.settings.macAddress ? device.settings.macAddress : parsedResponse.macAddr;

      return DeepMerge(device, {
        data: {
          product: parsedResponse.product,
          region: parsedResponse.region,
          language: parsedResponse.language,
          model: parsedResponse.model,
          serial: parsedResponse.serial,
          generation: parsedResponse.generation,
          name: parsedResponse.name,
          area: parsedResponse.area,
          cid: parsedResponse.cid,
        },
        settings: {
          macAddress: macAddress
        }
      });
    } catch (err) {
      console.error('An error occured fetching extended device details: ', err);
      throw err;
    }
  }
}

module.exports = new SonyBraviaAndroidTvFinder();
