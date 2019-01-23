const Homey = require('homey');

const SsdpClient = require('node-ssdp').Client;
const Fetch = require('node-fetch');
const DeepMerge = require('deepmerge');

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

    const validatedDevice = await this.fetchBasicDeviceDetais(device);

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

    const device = {
      name: 'Sony BRAVIA Android TV',
      data: {
        id: headers.USN,
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
        macAddress: '',
        valid: false,
      },
      state: {
        onoff: false
      },
      settings: {
        ip: ipAddress,
        psk: '',
        polling: 5,
      },
      capabilities: [
        'onoff',
        'volume_set'
      ]
    }

    return device;
  }

  async fetchBasicDeviceDetais(device) {
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

      return DeepMerge(device, {
        name: `Sony ${parsedResponse.productName} ${parsedResponse.modelName}`,
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
          macAddress: parsedResponse.macAddr
        }
      });
    } catch (err) {
      console.error('An error occured fetching extended device details: ', err);
      throw err;
    }
  }
}

module.exports = new SonyBraviaAndroidTvFinder()