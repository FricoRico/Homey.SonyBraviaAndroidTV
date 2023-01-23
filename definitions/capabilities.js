const SonyBraviaAndroidTvCommunicator = require('../helpers/sony-bravia-android-tv-communicator');

module.exports = [
  {
    name: 'onoff',
    function: (device, _value) => {
      console.log(`setting device power state to: `, _value );

      return SonyBraviaAndroidTvCommunicator.setDevicePowerState(device, _value);
    }
  },
  {
    name: 'channel_up',
    function: (device, _value) => {
      console.log(`turning channel up.`);

      return SonyBraviaAndroidTvCommunicator.sendCommand(device, 'ChannelUp');
    }
  },
  {
    name: 'channel_down',
    function: (device, _value) => {
      console.log(`turning channel down.`);

      return SonyBraviaAndroidTvCommunicator.sendCommand(device, 'ChannelDown');
    }
  },
  {
    name: 'volume_up',
    function: (device, _value) => {
      console.log(`turning volume up.`);

      return SonyBraviaAndroidTvCommunicator.sendCommand(device, 'VolumeUp');
    }
  },
  {
    name: 'volume_down',
    function: (device, _value) => {
      console.log(`turning volume down.`);

      return SonyBraviaAndroidTvCommunicator.sendCommand(device, 'VolumeDown');
    }
  },
  {
    name: 'volume_mute',
    function: (device, _value) => {
      if (_value) {
        console.log(`muting the sound.`);

        return SonyBraviaAndroidTvCommunicator.sendCommand(device, 'Mute');
      }

      console.log(`unmuting the sound.`);

      return SonyBraviaAndroidTvCommunicator.sendCommand(device, 'UnMute');
    }
  }
]
