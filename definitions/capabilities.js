const SonyBraviaAndroidTvCommunicator = require('../helpers/sony-bravia-android-tv-communicator');

module.exports = [
  {
    name: 'onoff',
    function: (device, data, value) => {
      console.log(`${data.name} setting device power state to: `, value ? 'ON' : 'OFF');

      return SonyBraviaAndroidTvCommunicator.setDevicePowerState(device, data, value);
    }
  },
  {
    name: 'channel_up',
    function: (device, data, _value) => {
      console.log(`${data.name} turning channel up.`);

      return SonyBraviaAndroidTvCommunicator.sendCommand(device, data, 'ChannelUp', 'ChannelUp');
    }
  },
  {
    name: 'channel_down',
    function: (device, data, _value) => {
      console.log(`${data.name} turning channel down.`);

      return SonyBraviaAndroidTvCommunicator.sendCommand(device, data, 'ChannelDown', 'ChannelDown');
    }
  },
  {
    name: 'volume_up',
    function: (device, data, _value) => {
      console.log(`${data.name} turning volume up.`);

      return SonyBraviaAndroidTvCommunicator.sendCommand(device, data, 'VolumeUp', 'VolumeUp');
    }
  },
  {
    name: 'volume_down',
    function: (device, data, _value) => {
      console.log(`${data.name} turning volume down.`);

      return SonyBraviaAndroidTvCommunicator.sendCommand(device, data, 'VolumeDown', 'VolumeDown');
    }
  },
  {
    name: 'volume_mute',
    function: (device, data, value) => {
      if (value) {
        console.log(`${data.name} muting the sound.`);

        return SonyBraviaAndroidTvCommunicator.sendCommand(device, data, 'Mute', 'Mute');
      }

      console.log(`${data.name} unmuting the sound.`);

      return SonyBraviaAndroidTvCommunicator.sendCommand(device, data, 'UnMute', 'UnMute');
    }
  }
]
