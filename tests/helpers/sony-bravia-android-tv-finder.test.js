const assert = require('assert');

const mock = require('mock-require');
mock('homey', require('homey-mock'));

const Homey = require('homey');
const SonyBraviaAndroidTvFinder = require('../../helpers/sony-bravia-android-tv-finder');

describe('SonyBraviaAndroidTvFinder', () => {

  it('Must extend Homey.SimpleClass', () => {
    assert.equal(SonyBraviaAndroidTvFinder instanceof Homey.SimleClass, true);
  });

});