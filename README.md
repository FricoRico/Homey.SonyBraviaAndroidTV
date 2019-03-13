[![Build Status](https://travis-ci.com/FricoRico/Homey.SonyBraviaAndroidTV.svg?branch=develop)](https://travis-ci.com/FricoRico/Homey.SonyBraviaAndroidTV)

# Sony BRAVIA Android TV
This app adds support for Sony BRAVIA Android TV devices in Homey. For usage instructions, please follow the in-app instructions page available during pairing and setup.

## Known issues
None

## Confirmed Supported devices:
##### 2017 Models
* A1E OLED
* A1 OLED

## Unconfirmed supported devices:
##### 2018 Models
* A9F OLED
* Z9F LCD
* A8F OLED
* X900F/XF90

##### 2017 Models
* XE94
* XE93
* XE90

##### 2016 Models
* X Series
* W Series
* R Series

##### 2015 Models
* X Series
* W Series
* R Series

##### 2014 Models
* X Series
* W Series
* R Series

## Flows:

##### Triggers:
- Powered on
- Powered off
- Netflix started
- HDMI input changed [Hdmi1 - Hdmi4]
- Numpad input received [Num0 - Num9]
- Options opened
- Electronic Program Guide opened
- Enter command received

##### Actions:
- Turn on
- Turn off
- Toggle on or off
- One channel up
- One channel down
- Turn volume up
- Turn volume down
- Mute the volume
- Unmute the volume
- Start Netflix
- Set HDMI input [Hdmi1 - Hdmi4]
- Open Options
- Open Electronic Program Guide
- Send Enter command
- Numpad input [Num0 - Num9]

## Supported Languages:
* English
* Dutch (Nederlands)

## NOTE:
Future releases will support media playback flow actions through a third-party Android TV application. For now only simple flow actions are available.

## Change Log:

### v1.0.3
- Added custom triggers for default `Channel up`, `Channel down`, `Volume up`, `Volume down`, `Muted`, `Unmuted`
- Made pairing screens full viewport height
- Removed Wake-on-LAN setting, as it did not function properly and can't be fixed at this moment
- Added `setUnavailable` message when authentication with the TV fails

### v1.0.2
- Fixes cases where capabilities timeout, because asynchronous functions are never resolved.
- Should now successfully trigger `Turned on` and `Turned off` flow triggers, also related to asynchronous functions.

### v1.0.1
- Added node_modules to the repository because Homey does not automatically restore them.

### v1.0.0
**ititial release:** Initial release of all basic Sony BRAVIA Android TV functionality available through their SOAP API.
