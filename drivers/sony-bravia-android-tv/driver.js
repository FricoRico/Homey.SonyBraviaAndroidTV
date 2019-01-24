"use strict";

const Homey = require('homey');

const sonyBraviaAndroidTvFinder = require('../../helpers/sony-bravia-android-tv-finder');

// var xmlEnvelope = '<?xml version="1.0"?><s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/" s:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/"><s:Body><u:X_SendIRCC xmlns:u="urn:schemas-sony-com:service:IRCC:1"><IRCCCode>%code%</IRCCCode></u:X_SendIRCC></s:Body></s:Envelope>';
// var foundDevices = [];
// var devices = [];
// var api_auth_url = '/sony/accessControl';
// var extInterval;
// var errorMessage;
// var counter = 0;
// var logs = "";
// var failed = 0;
// var failedTime = 0;
// var now = new Date();
// var scriptStarted = now.toJSON();


// function setDeviceAvailability(device_data) {
//   Homey.log("test");
//   if (typeof (devices[device_data.id].settings) !== 'undefined') {
//     var random = Math.floor(Math.random() * 1000000000);

//     var options = {
//       uri: 'http://' + devices[device_data.id].settings.ip + '/sony/system',
//       timeout: 2000,
//       headers: {
//         "X-Auth-PSK": devices[device_data.id].settings.psk,
//         "Content-Type": "application/json",
//         "cache-control": "no-cache",
//         "random": random
//       },
//       json: { "method": "getPowerStatus", "params": [], "id": 5, "version": "1.0" }
//     }
//     httpmin.post(options).then(function (data) {
//       var statusCode = data.response.statusCode;
//       if (statusCode == 200) {
//         module.exports.setAvailable(device_data);
//       } else if (statusCode == 403) {
//         module.exports.setUnavailable(device_data, "please set PSK");
//       } else {
//         module.exports.setUnavailable(device_data, "(" + statusCode + ") unkwn error");
//       }
//       Homey.log("setDeviceAvailability: " + statusCode);
//     }).catch(function (err) {
//       // if err is 'timeout', set device unavailable

//       if (typeof (err) === 'string') {
//         Homey.log("setDeviceAvailability error === string::" + err);
//         if (err.toLowerCase().indexOf('timeout') >= 0) {
//           errorMessage = "timeout";
//         } else if (err.toLowerCase().indexOf('refused') >= 0) {
//           errorMessage = "refused";
//         } else {
//           errorMessage = "unknown err";
//         }
//         module.exports.setUnavailable(device_data, "Req. " + errorMessage);

//         // TRIGGER: token
//         var error_type = { 'error_type': err }
//         Homey.ManagerFlow.getCard('connection_error', error_type).then((result, error) => {
//           Homey.log("trigger App connection_error");
//         });
//         Homey.log(errorMessage + " error");
//       } else {
//         errorMessage = "Unknown error(SDA)";
//         Homey.log('Unknown error(SDA)')
//         var error_type = { 'error_type': errorMessage }
//         Homey.ManagerFlow.getCard('connection_error', error_type).then((errorMessage, result) => {
//           Homey.log("trigger App connection_error");
//         });
//         module.exports.setUnavailable(device_data, "TV 'unreachable'");
//       }
//     });
//   } else {
//     module.exports.setUnavailable(device_data, "no ip");
//     Homey.log("setDeviceAvailability, device has no 'settings.ip'");
//   }
// }

// function getDeviceState(device_data) {

//   //- http://192.168.1.61/sony/system
//   //- {"method":"getPowerStatus","params":[],"id":5,"version":"1.0"}
//   //- {"result":[{"status":"standby"}],"id":5}
//   var random = Math.floor(Math.random() * 1000000000);
//   var options = {
//     uri: 'http://' + devices[device_data.id].settings.ip + '/sony/system',
//     timeout: 2000,
//     headers: {
//       "X-Auth-PSK": devices[device_data.id].settings.psk,
//       "Content-Type": "application/json",
//       "cache-control": "no-cache",
//       "random": random
//     },
//     json: { "method": "getPowerStatus", "params": [], "id": 5, "version": "1.0" }
//   }
//   httpmin.post(options).then(function (data) {
//     if (data.response.statusCode == 200) {
//       if (data.data.result[0].status == 'active') {
//         if (devices[device_data.id].state.onoff != true) {
//           devices[device_data.id].state.onoff = true;
//           Homey.manager('flow').triggerDevice('PowerOn', { device: device_data.id });
//         }
//       } else {
//         if (devices[device_data.id].state.onoff != false) {
//           devices[device_data.id].state.onoff = false;
//           Homey.manager('flow').triggerDevice('PowerOff', { device: device_data.id });
//         }
//       }
//     }
//     Homey.log("xxxxxxx getDeviceState xxxxxxxxx");
//     Homey.log(devices[device_data.id]);
//     Homey.log("xxxxxxx getDeviceState xxxxxxxxx");
//   }).catch(function (err) {
//     Homey.log("getDeviceState");
//     Homey.log(err);
//   });

// }

// function initDevice(device_data) {
//   Homey.log("============ before init =============");
//   Homey.log(device_data);
//   Homey.log("============ before init =============");
//   devices[device_data.id] = { data: device_data, state: { 'onoff': false } }

//   module.exports.getSettings(device_data, function (err, settings) {
//     // INIT: set device settings
//     devices[device_data.id].settings = settings;
//     if (typeof (devices[device_data.id].settings.useWOL) === "undefined") {
//       devices[device_data.id].settings.useWOL = false;
//     }
//     if (typeof (devices[device_data.id].settings.macAddr) === "undefined") {
//       devices[device_data.id].settings.macAddr = "00:00:00:00:00:00";
//     }
//     devices[device_data.id].state.onoff = false;
//     // INIT: get current device status (standby/powerOn)
//     getDeviceState(device_data);
//     // INIT: check current device status and set availability
//     setDeviceAvailability(device_data);
//     // INIT: get extended device info
//     getExtendedDeviceInfo(device_data);

//   });

//   // CRON: Create cron task name
//   var taskName = 'SBATV_' + device_data.id;
//   // CRON: unregister task, to force new cron settings

//   Homey.manager('cron').unregisterTask(taskName, function (err, success) {
//     // CRON: register new cron task
//     Homey.manager('cron').registerTask(taskName, '*/' + (devices[device_data.id].settings.polling) + ' * * * *', device_data, function (err, task) {
//       Homey.log('CRON: task "' + taskName + '" registered, every ' + devices[device_data.id].settings.polling + 'min.');
//     });
//   });

//   /////// CRONset: task listener ///////
//   Homey.manager('cron').on(taskName, function (device_data) {
//     var now = new Date();
//     var jsonDate = now.toJSON();

//     Homey.log('===================================');
//     Homey.log('Cron: Check device availability' + device_data.name + ' every' + devices[device_data.id].settings.polling + 'min.');
//     Homey.log("Cron: Time:", jsonDate);
//     Homey.log('===================================');
//     setDeviceAvailability(device_data);
//     getDeviceState(device_data);
//   })
// }

class SonyBraviaAndroidTvDriver extends Homey.Driver {
  onPair(socket) {
    socket.on('list_devices', (_devices, callback) => this.fetchAvailableDevices(callback));
    socket.on('preshared_key', (device, callback) => this.fetchExpandedDeviceDetails(device, callback));
  }

  async fetchExpandedDeviceDetails(device, callback) {
    try {
      const extendedDevice = await sonyBraviaAndroidTvFinder.fetchExtendDeviceDetails(device);

      console.log('Got extended Sony BRAVIA Android TV data: ', extendedDevice);

      callback(null, extendedDevice);
    } catch (err) {
      callback(err, null);
    }
  }

  async fetchAvailableDevices(callback) {
    const devices = await sonyBraviaAndroidTvFinder.getAllDevices();

    console.log('Found Sony BRAVIA Android TV\'s: ', devices);

    callback(null, devices);
  }
}

module.exports = SonyBraviaAndroidTvDriver;

// var self = module.exports = {
//   init: function (devices_data, callback) {
//     Homey.log('.');
//     Homey.log('.');
//     Homey.log('.');
//     Homey.log('Paired devices:', devices_data);
//     devices_data.forEach(initDevice);
//     callback(null, true);//needs to be on the end of init
//   },
//   deleted: function (device_data) {
//     var taskName = 'SBATV_' + device_data.id;
//     Homey.manager('cron').unregisterTask(taskName, function (err, success) {
//       Homey.log('device deleted, task unregistered');
//     });
//     Homey.log(device_data);
//     delete devices[device_data.id];
//   },
//   capabilities: {
//     onoff: {
//       get: function (device_data, callback) {
//         if (device_data instanceof Error || !device_data)
//           return callback(device_data);

//         var device = devices[device_data.id];

//         if (typeof callback == 'function') {
//           Homey.log("callback");

//           if (typeof device.state === "undefined") {

//             Homey.log('State = undefined');
//             callback(null, false);

//           } else {

//             Homey.log(typeof (device.state.onoff));
//             callback(null, device.state.onoff);

//           }

//         }
//       },
//       set: function (device_data, onoff, callback) {
//         if (device_data instanceof Error || !device_data)
//           return callback(device_data);

//         var device = devices[device_data.id];

//         if (onoff == true) {
//           device.state.onoff = onoff;
//           module.exports.realtime(device.data, 'onoff', onoff);
//           sendCommand('WakeUp', device, 'tv on', callback);
//         } else {
//           device.state.onoff = onoff;
//           module.exports.realtime(device.data, 'onoff', onoff);
//           sendCommand('PowerOff', device, 'tv off', callback);
//         }
//         callback(null, onoff);
//       }
//     },
//     volume_set: {
//       get: function (device_data, callback) {
//         callback(null, 1);
//       },
//       set: function (device_data, volume, callback) {
//         callback(null, 1);
//       }
//     }
//   },
//   settings: function (device_data, newSettingsObj, oldSettingsObj, changedKeysArr, callback) {
//     changedKeysArr.forEach(function (key) {
//       devices[device_data.id].settings[key] = newSettingsObj[key];
//       setDeviceAvailability(device_data);
//     })
//     Homey.log(devices[device_data.id]);
//     callback(null, true);
//   },
//   added: function (device_data, callback) {
//     // run when a device has been added by the user (as of v0.8.33)
//     Homey.log(device_data);
//     initDevice(device_data);
//   },
//   pair: function (socket) {

//     socket.on('scanStart', function (data, callback) {
//       Homey.log('START');
//       Homey.log('START:::::paired devices>', devices);
//       Homey.log('START:::::paired foundDevices>', foundDevices);
//       foundDevices = [];

//       var client = new ssdp();
//       client.on('response', function inResponse(headers, code, rinfo) {
//         if (headers.LOCATION.indexOf('sony') > 0) {
//           Homey.log(headers);
//           var r = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/;
//           var t = headers.LOCATION.match(r);
//           Homey.log('add device to Found device', t[0]);
//           foundDevices.push({ 'id': headers.USN, 'name': 'Sony TV', 'settings': { 'ip': t[0], 'psk': '----', 'polling': 5 } });
//         }
//       })

//       // do ssdp search
//       Homey.log('search started');
//       client.search('upnp:rootdevice');

//       var timeoutScanDone = 10500;
//       var timeoutScanDoneInterval = (timeoutScanDone / 1000);

//       function timer() {
//         timeoutScanDoneInterval = timeoutScanDoneInterval - 1;
//         if (timeoutScanDoneInterval <= 0) {
//           clearInterval(scanDone);
//           return;
//         }
//         socket.emit('foundDevice', foundDevices.length);
//       }
//       var scanDone = setInterval(timer, 1000);

//       // And after 10 seconds, you want to stop
//       setTimeout(function () {
//         Homey.log('STOP');
//         Homey.log('STOP:::::founddevices', foundDevices);

//         delete self.client;
//         socket.emit('scanDone', foundDevices);
//       }, timeoutScanDone);
//     });

//     socket.on('list_devices', function (data, callback) {
//       data = foundDevices;
//       foundDevices = [];
//       Homey.log('list_devices', data);

//       async.each(data, function (device, callback) {
//         // Call an asynchronous function, often a save() to DB
//         getBasicDeviceInfo(device, function () {
//           // Async call is done, alert via callback
//           Homey.log('ASYNC:::::done with:', device);
//           callback();
//         });
//       }, function () {
//         // All tasks are done now
//         Homey.log('ASYNC:::::callback');
//         Homey.log(devices);
//         // this returns the "devices" to the list_devices view
//         callback(null, devices);
//         foundDevices = [];
//       });
//     });
//     socket.on('disconnect', function () {
//       foundDevices = [];
//       Homey.log('User aborted pairing, or pairing is finished');
//     });
//     socket.on('add_device', function (device, callback) {
//       Homey.log('-------- device added ---------');
//       Homey.log(device);
//       Homey.log('-------- device added ---------');
//       devices[device.data.id] = {
//         data: device.data,
//         settings: device.settings,
//         state: device.state
//       }

//       Homey.log('-------- device added ---------');
//       callback(devices, true);
//     })
//   }
// }


// /////////////////////////////
// // listeners, flow related 
// /////////////////////////////
// //
// // ACION
// //
// /////// Power related /////// 
// Homey.manager('flow').on('action.PowerOff', function (callback, args) {
//   self.realtime(devices[args.device.id], 'onoff', false);
//   sendCommand('PowerOff', devices[args.device.id], 'tv off', callback);
// });

// Homey.manager('flow').on('action.PowerOn', function (callback, args) {
//   self.realtime(devices[args.device.id], 'onoff', true);
//   Homey.log("=========== WOL: ===========");
//   Homey.log("WOL: before check");
//   Homey.log(devices[args.device.id].settings);
//   var mac = devices[args.device.id].settings.macAddr;

//   if (devices[args.device.id].settings.useWOL == true && mac != "00:00:00:00:00:00" && mac != "") {
//     Homey.log("WOL: Do for MAC:" + devices[args.device.id].settings.macAddr);
//     if (mac.match("^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$")) {
//       Homey.log("WOL: Wake up TV: ", mac);
//       try {
//         wol.wake(mac);
//       } catch (err) {
//         var MACMessage = 'WOL: *MAC address invalid!';
//         Homey.log(MACMessage);
//         Homey.log(err);
//         callback(MACMessage, false);
//       }

//       callback(null, true);
//     } else {
//       var MACMessage = 'WOL: **MAC address invalid!';
//       Homey.log(MACMessage);
//       callback(MACMessage, false);
//     }
//   } else {
//     sendCommand('WakeUp', devices[args.device.id], 'tv on', callback);
//   }
// });


// Homey.manager('flow').on('action.Sleep', function (callback, args) {
//   self.realtime(devices[args.device.id], 'onoff', false);
//   sendCommand('Sleep', devices[args.device.id], 'Sleep', callback);
// });
// //////////////////////////////
// /////// Channel related /////// 
// Homey.manager('flow').on('action.Netflix', function (callback, args) {
//   //Homey.manager('flow').trigger('Netflix');
//   sendCommand('Netflix', devices[args.device.id], 'Netflix', callback);
// });
// Homey.manager('flow').on('action.ChannelUp', function (callback, args) {
//   //Homey.manager('flow').trigger('ChannelUp');
//   sendCommand('ChannelUp', devices[args.device.id], 'ChannelUp', callback);
// });
// Homey.manager('flow').on('action.ChannelDown', function (callback, args) {
//   //Homey.manager('flow').trigger('ChannelDown');
//   sendCommand('ChannelDown', devices[args.device.id], 'ChannelDown', callback);
// });
// //////////////////////////////
// /////// Volume related /////// 
// Homey.manager('flow').on('action.VolumeUp', function (callback, args) {
//   sendCommand('VolumeUp', devices[args.device.id], 'VolumeUp', callback);
// });
// Homey.manager('flow').on('action.VolumeDown', function (callback, args) {
//   sendCommand('VolumeDown', devices[args.device.id], 'VolumeDown', callback);
// });
// Homey.manager('flow').on('action.Mute', function (callback, args) {
//   sendCommand('Mute', devices[args.device.id], 'Mute', callback);
// });
// Homey.manager('flow').on('action.UnMute', function (callback, args) {
//   ///Homey.manager('flow').trigger('UnMute');
//   sendCommand('Mute', devices[args.device.id], 'UnMute', callback);
// });
// //////////////////////////////
// /////// HDMI Input related /////// 
// Homey.manager('flow').on('action.SetInput', function (callback, args) {
//   sendCommand(args.input.name, devices[args.device.id], 'SetInput', callback);
// });
// Homey.manager('flow').on('action.SetInput.input.autocomplete', function (callback, value) {
//   var inputSearchString = value.query;
//   var items = searchItems(inputSearchString, televisionInputs);
//   callback(null, items);
// });
// //////////////////////////////
// /////// Misc /////// 
// Homey.manager('flow').on('action.Options', function (callback, args) {
//   sendCommand('Options', devices[args.device.id], 'Options', callback);
// });
// Homey.manager('flow').on('action.EPG', function (callback, args) {
//   sendCommand('EPG', devices[args.device.id], 'EPG', callback);
// });
// Homey.manager('flow').on('action.EPG', function (callback, args) {
//   sendCommand('EPG', devices[args.device.id], 'EPG', callback);
// });
// Homey.manager('flow').on('action.Enter', function (callback, args) {
//   sendCommand('Enter', devices[args.device.id], 'Enter', callback);
// });

// //////////////////////////////
// /////// NumX /////// 
// Homey.manager('flow').on('action.Num0', function (callback, args) {
//   sendCommand('Num0', devices[args.device.id], 'Num0', callback);
// });
// Homey.manager('flow').on('action.Num1', function (callback, args) {
//   sendCommand('Num1', devices[args.device.id], 'Num1', callback);
// });
// Homey.manager('flow').on('action.Num2', function (callback, args) {
//   sendCommand('Num2', devices[args.device.id], 'Num2', callback);
// });
// Homey.manager('flow').on('action.Num3', function (callback, args) {
//   sendCommand('Num3', devices[args.device.id], 'Num3', callback);
// });
// Homey.manager('flow').on('action.Num4', function (callback, args) {
//   sendCommand('Num4', devices[args.device.id], 'Num4', callback);
// });
// Homey.manager('flow').on('action.Num5', function (callback, args) {
//   sendCommand('Num5', devices[args.device.id], 'Num5', callback);
// });
// Homey.manager('flow').on('action.Num6', function (callback, args) {
//   sendCommand('Num6', devices[args.device.id], 'Num6', callback);
// });
// Homey.manager('flow').on('action.Num7', function (callback, args) {
//   sendCommand('Num7', devices[args.device.id], 'Num7', callback);
// });
// Homey.manager('flow').on('action.Num8', function (callback, args) {
//   sendCommand('Num8', devices[args.device.id], 'Num8', callback);
// });
// Homey.manager('flow').on('action.Num9', function (callback, args) {
//   sendCommand('Num9', devices[args.device.id], 'Num9', callback);
// });
// Homey.manager('flow').on('action.Num10', function (callback, args) {
//   sendCommand('Num10', devices[args.device.id], 'Num10', callback);
// });
// Homey.manager('flow').on('action.Num11', function (callback, args) {
//   sendCommand('Num11', devices[args.device.id], 'Num11', callback);
// });
// Homey.manager('flow').on('action.Num12', function (callback, args) {
//   sendCommand('Num12', devices[args.device.id], 'Num12', callback);
// });


// function searchItems(value, optionsArray) {

//   var serveItems = [];
//   for (var i = 0; i < optionsArray.length; i++) {
//     var serveItem = optionsArray[i];
//     if (serveItem.name.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
//       serveItems.push({ icon: "", name: serveItem.name });
//     }
//   }
//   return serveItems;
// }


// function sendCommand(findCode, device, flowName, callback) {
//   if (typeof (device.settings) !== 'undefined') {
//     //trigger flows for this action
//     Homey.manager('flow').triggerDevice(findCode, { device: device.id });

//     if (device.settings.psk != "----") {
//       for (var i = 0; i < remoteControlCodes.length; i++) {
//         if (remoteControlCodes[i]['name'] == findCode) {
//           var sendcode = remoteControlCodes[i]['value'];
//         }
//       }

//       Homey.log("   ");
//       Homey.log("======= send command! ==========");
//       Homey.log("sendCommand: actionCard:" + flowName);
//       var now = new Date();
//       var jsonDate = now.toJSON();
//       Homey.log("sendCommand: Command time:", jsonDate);
//       var random = Math.floor(Math.random() * 1000000000);
//       var options = {
//         uri: 'http://' + device.settings.ip + '/sony/IRCC?_random=' + random,
//         timeout: 1000,
//         headers: {
//           "X-Auth-PSK": device.settings.psk,
//           "SOAPACTION": '"urn:schemas-sony-com:service:IRCC:1#X_SendIRCC"',
//           "cache-control": "no-cache",
//           "random": random
//         },
//         request: function (req) {
//           req.write(xmlEnvelope.replace("%code%", sendcode))
//         }
//       }

//       httpmin.post(options).then(function (data) {

//         var statusCode = data.response.statusCode;
//         Homey.log("statusCode:", statusCode);
//         Homey.log("response:", data.data);
//         if (statusCode == 200) {
//           Homey.log("sendCommand: command succes");
//           callback(null, true);

//         } else {
//           Homey.log("sendCommand: unknown statuscode: " + data.response.statusCode);
//           callback(null, true);
//         }
//       }).catch(function (err) {
//         Homey.log(error);
//         callback(null, false);
//       });


//     } else {
//       Homey.log("sendCommand: No 'pre share key' set.");
//       callback(null, false);
//     }
//   } else {
//     Homey.log("sendCommand: device settings undefined");
//     callback(null, false);
//   }
// }



/*
 var calls = {
 "results": [

 // not tested API points
 // ["getDeviceMode", ["{\"value\":\"string\"}"],
 // ["{\"isOn\":\"bool\"}"], "1.0"
 // ],

 // ["getNetworkSettings", ["{\"netif\":\"string\"}"],
 // ["{\"netif\":\"string\", \"hwAddr\":\"string\", \"ipAddrV4\":\"string\", \"ipAddrV6\":\"string\", \"netmask\":\"string\", \"gateway\":\"string\", \"dns\":\"string*\"}*"], "1.0"
 // ],

 // ["getRemoteDeviceSettings", ["{\"target\":\"string\"}"],
 // ["{\"target\":\"string\", \"currentValue\":\"string\", \"deviceUIInfo\":\"string\", \"title\":\"string\", \"titleTextID\":\"string\", \"type\":\"string\", \"isAvailable\":\"bool\", \"candidate\":\"RemoteDeviceSettingsCandidate[]\"}*"], "1.0"
 // ],


 ////////////////////////
 /
 / Tested API point @ Sony Bravia KD-49X8309C
 / - url
 / - reqeust JSON PAYLOAD
 / - response JSON
 /
 ////////////////////////
 - http://192.168.1.61/sony/system
 - {"method":"getInterfaceInformation","params":[],"id":5,"version":"1.0"}
 - {"result":[{"productCategory":"tv","productName":"BRAVIA","modelName":"KD-49X8309C","serverName":"","interfaceVersion":"3.8.0"}],"id":5}

 - http://192.168.1.61/sony/system
 - {"method":"getLEDIndicatorStatus","params":[],"id":5,"version":"1.0"}
 - {"result":[{"mode":"AutoBrightnessAdjust"}],"id":5}

 - http://192.168.1.61/sony/system
 - {"method":"getPowerSavingMode","params":[],"id":5,"version":"1.0"}
 - {"result":[{"mode":"low"}],"id":5}

 - http://192.168.1.61/sony/system
 - {"method":"getPowerStatus","params":[],"id":5,"version":"1.0"}
 - {"result":[{"status":"standby"}],"id":5}

 - http://192.168.1.61/sony/system
 - {"method":"getRemoteControllerInfo","params":[],"id":5,"version":"1.0"}
 - {"result": [{"bundled": true,"type": "IR_REMOTE_BUNDLE_TYPE_AEP_N"},{}]}

 - http://192.168.1.61/sony/system
 - {"method":"getSystemInformation","params":[],"id":5,"version":"1.0"}
 - {"result":[{"product":"TV","region":"XEU","language":"dut","model":"KD-49X8309C","serial":"xxxxxx","macAddr":"xx:xx:xx:xx:xx:xx","name":"BRAVIA","generation":"3.8.0","area":"NLD","cid":"xxxxxx"}],"id":5}


 - http://192.168.1.61/sony/system
 - {"method":"getSystemSupportedFunction","params":[],"id":5,"version":"1.0"}
 - {"result":[[{"option":"WOL","value":"xx:xx:xx:xx:xx:xx"}]],"id":5}

 - http://192.168.1.61/sony/system
 - {"method":"getWolMode","params":[],"id":5,"version":"1.0"}
 - {"result":[{"enabled":true}],"id":5}

 - http://192.168.1.61/sony/system
 - {"method":"getMethodTypes","params":[""],"id":5,"version":"1.0"}
 - {"results":[["getCurrentTime",[],["string"],"1.0"],["getDeviceMode",["{\"value\":\"string\"}"],["{\"isOn\":\"bool\"}"],"1.0"],["getInterfaceInformation",[],["{\"productCategory\":\"string\", \"productName\":\"string\", \"modelName\":\"string\", \"serverName\":\"string\", \"interfaceVersion\":\"string\"}"],"1.0"],["getLEDIndicatorStatus",[],["{\"mode\":\"string\", \"status\":\"string\"}"],"1.0"],["getNetworkSettings",["{\"netif\":\"string\"}"],["{\"netif\":\"string\", \"hwAddr\":\"string\", \"ipAddrV4\":\"string\", \"ipAddrV6\":\"string\", \"netmask\":\"string\", \"gateway\":\"string\", \"dns\":\"string*\"}*"],"1.0"],["getPowerSavingMode",[],["{\"mode\":\"string\"}"],"1.0"],["getPowerStatus",[],["{\"status\":\"string\"}"],"1.0"],["getRemoteControllerInfo",[],["{\"bundled\":\"bool\", \"type\":\"string\"}","{\"name\":\"string\", \"value\":\"string\"}*"],"1.0"],["getRemoteDeviceSettings",["{\"target\":\"string\"}"],["{\"target\":\"string\", \"currentValue\":\"string\", \"deviceUIInfo\":\"string\", \"title\":\"string\", \"titleTextID\":\"string\", \"type\":\"string\", \"isAvailable\":\"bool\", \"candidate\":\"RemoteDeviceSettingsCandidate[]\"}*"],"1.0"],["getSystemInformation",[],["{\"product\":\"string\", \"region\":\"string\", \"language\":\"string\", \"model\":\"string\", \"serial\":\"string\", \"macAddr\":\"string\", \"name\":\"string\", \"generation\":\"string\", \"area\":\"string\", \"cid\":\"string\"}"],"1.0"],["getSystemSupportedFunction",[],["{\"option\":\"string\", \"value\":\"string\"}*"],"1.0"],["getWolMode",[],["{\"enabled\":\"bool\"}"],"1.0"],["requestReboot",[],[],"1.0"],["setDeviceMode",["{\"value\":\"string\", \"isOn\":\"bool\"}"],[],"1.0"],["setLanguage",["{\"language\":\"string\"}"],[],"1.0"],["setPowerSavingMode",["{\"mode\":\"string\"}"],[],"1.0"],["setPowerStatus",["{\"status\":\"bool\"}"],[],"1.0"],["setWolMode",["{\"enabled\":\"bool\"}"],[],"1.0"],["getMethodTypes",["string"],["string","string*","string*","string"],"1.0"],["getVersions",[],["string*"],"1.0"],["getCurrentTime",[],["{\"dateTime\":\"string\", \"timeZoneOffsetMinute\":\"int\", \"dstOffsetMinute\":\"int\"}"],"1.1"],["setLEDIndicatorStatus",["{\"mode\":\"string\", \"status\":\"string\"}"],[],"1.1"]],"id":5}

 - http://192.168.1.61/sony/system
 - {"method":"getVersions","params":[],"id":5,"version":"1.0"}
 - {"result":[["1.0","1.1"]],"id":5}

 - http://192.168.1.61/sony/system
 - {"method":"getCurrentTime","params":[],"id":5,"version":"1.0"}
 - {"result":["2016-05-26T11:41:48+0200"],"id":5}

 */

/*



 http://192.168.1.61/sony/system
 {"method":"getPowerStatus","params":[],"id":1,"version":"1.0"}
 {"result":[{"status":"active"}],"id":1}
 {"result":[{"status":"standby"}],"id":1}

 http://192.168.1.61/sony/system
 {"method":"getWOLStatus","params":[],"id":1,"version":"1.0"}
 {"error":[12,"getWOLStatus"],"id":1}
 */
