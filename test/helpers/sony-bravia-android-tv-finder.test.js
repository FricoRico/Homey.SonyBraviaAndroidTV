const assert = require('assert');

const mock = require('mock-require');
mock('homey', require('@milanzor/homey-mock'));

const Homey = require('homey');
const SsdpClient = require('node-ssdp').Client;
const SonyBraviaAndroidTvFinder = require('../../helpers/sony-bravia-android-tv-finder');

describe('SonyBraviaAndroidTvFinder', () => {

  it('Should extend Homey.SimpleClass', () => {
    assert.equal(SonyBraviaAndroidTvFinder instanceof Homey.SimpleClass, true);
  });

  it('Should create a new SSDP client on construction', () => {
    assert.equal(SonyBraviaAndroidTvFinder.ssdpClient instanceof SsdpClient, true);
  });

  it('Should create empty device array on construction', () => {
    assert.deepEqual(SonyBraviaAndroidTvFinder.foundDevices, []);
  })


});