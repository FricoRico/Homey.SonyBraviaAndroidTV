const SonyBraviaAndroidTvCommunicator = require('../helpers/sony-bravia-android-tv-communicator');

module.exports = [
  {
    name: 'onoff',
    function: async (device, data, value) => {
      console.log(`${data.name} setting device power state to: `, value ? 'ON' : 'OFF');

      return await SonyBraviaAndroidTvCommunicator.setDevicePowerState(device, data, value);
    }
  },
  {
    name: 'channel_up',
    function: async (device, data, _value) => {
      console.log(`${data.name} turning channel up.`);

      return await SonyBraviaAndroidTvCommunicator.sendCommand(device, data, null, 'ChannelUp');
    }
  },
  {
    name: 'channel_down',
    function: async (device, data, _value) => {
      console.log(`${data.name} turning channel down.`);

      return await SonyBraviaAndroidTvCommunicator.sendCommand(device, data, null, 'ChannelDown');
    }
  },
  {
    name: 'volume_up',
    function: async (device, data, _value) => {
      console.log(`${data.name} turning volume up.`);

      return await SonyBraviaAndroidTvCommunicator.sendCommand(device, data, null, 'VolumeUp');
    }
  },
  {
    name: 'volume_down',
    function: async (device, data, _value) => {
      console.log(`${data.name} turning volume down.`);

      return await SonyBraviaAndroidTvCommunicator.sendCommand(device, data, null, 'VolumeDown');
    }
  },
  {
    name: 'volume_mute',
    function: async (device, data, value) => {
      if (value) {
        console.log(`${data.name} muting the sound.`);

        return await SonyBraviaAndroidTvCommunicator.sendCommand(device, data, null, 'Mute');
      }

      console.log(`${data.name} unmuting the sound.`);

      return await SonyBraviaAndroidTvCommunicator.sendCommand(device, data, null, 'UnMute');
    }
  }
]
