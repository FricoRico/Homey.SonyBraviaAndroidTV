const assert = require('assert');
const sandbox = require('sinon').createSandbox();;

const mock = require('mock-require');
mock('homey', require('@milanzor/homey-mock'));

const Homey = require('homey');
const SsdpClient = require('node-ssdp').Client;
const SonyBraviaAndroidTvFinder = require('../../helpers/sony-bravia-android-tv-finder');

describe('SonyBraviaAndroidTvFinder', () => {

  afterEach(() => {
    SonyBraviaAndroidTvFinder.foundDevices = [];

    sandbox.restore();
  });

  it('Should extend Homey.SimpleClass', () => {
    assert.equal(SonyBraviaAndroidTvFinder instanceof Homey.SimpleClass, true);
  });

  it('Should create a new SSDP client on construction', () => {
    assert.equal(SonyBraviaAndroidTvFinder.ssdpClient instanceof SsdpClient, true);
  });

  it('Should register SSDP client response listener on construction', () => {
    assert.equal(SonyBraviaAndroidTvFinder.ssdpClient._events.response instanceof Function, true);
  });

  it('Should create empty device array on construction', () => {
    assert.deepEqual(SonyBraviaAndroidTvFinder.foundDevices, []);
  });

  it('Should clear devices when clearDevices function is called', () => {
    SonyBraviaAndroidTvFinder.foundDevices = [{ name: 'Fake Device' }];

    assert.deepEqual(SonyBraviaAndroidTvFinder.foundDevices, [{ name: 'Fake Device' }]);

    SonyBraviaAndroidTvFinder.clearDevices();

    assert.deepEqual(SonyBraviaAndroidTvFinder.foundDevices, []);
  });

  it('Should validate device headers when onDeviceResponse is called by SSDP client', () => {
    const spy = sandbox.spy(SonyBraviaAndroidTvFinder, 'validateDeviceHeaders');

    SonyBraviaAndroidTvFinder.onDeviceResponse({ LOCATION: 'Philips' });

    assert.equal(spy.called, true);
    assert.equal(spy.calledWith({ LOCATION: 'Philips' }), true);
  });

  it('Should early return undefined if device meet validateDeviceHeaders requirements', async () => {
    sandbox.stub(SonyBraviaAndroidTvFinder, 'validateDeviceHeaders').returns(null);

    assert.equal(await SonyBraviaAndroidTvFinder.onDeviceResponse({ LOCATION: 'Philips' }), undefined);
  });

  it('Should fetch basic device details when Sony header is present', () => {
    sandbox.stub(SonyBraviaAndroidTvFinder, 'validateDeviceHeaders').returns({ name: 'Fake Device' });
    const stub = sandbox.stub(SonyBraviaAndroidTvFinder, 'fetchBasicDeviceDetails').returns(true);

    SonyBraviaAndroidTvFinder.onDeviceResponse({ LOCATION: 'Sony' });

    assert.equal(stub.called, true);
    assert.equal(stub.calledWith({ name: 'Fake Device' }), true);
  });

  it('Should early return undefined if device does not meet fetchBasicDeviceDetails requirements', async () => {
    sandbox.stub(SonyBraviaAndroidTvFinder, 'validateDeviceHeaders').returns({ name: 'Fake Device' });
    sandbox.stub(SonyBraviaAndroidTvFinder, 'fetchBasicDeviceDetails').returns(null);

    assert.equal(await SonyBraviaAndroidTvFinder.onDeviceResponse({ LOCATION: 'Sony' }), undefined);
  });

  it('Should finally push device into foundDevices if all requirements were met', async () => {
    sandbox.stub(SonyBraviaAndroidTvFinder, 'validateDeviceHeaders').returns({ name: 'Fake Device' });
    sandbox.stub(SonyBraviaAndroidTvFinder, 'fetchBasicDeviceDetails').returns({ name: 'Fake Device' });

    await SonyBraviaAndroidTvFinder.onDeviceResponse({ LOCATION: 'Sony' });

    assert.deepEqual(SonyBraviaAndroidTvFinder.foundDevices, [{ name: 'Fake Device' }]);
  });

  it('Should scan for devices when getAllDevices is called', () => {
    const stub = sandbox.stub(SonyBraviaAndroidTvFinder, 'scanForDevices');

    SonyBraviaAndroidTvFinder.getAllDevices();

    assert.equal(stub.called, true);
  });

  it('Should return all found devices after getAllDevices is called and timeout is reached', async () => {
    const clock = sandbox.useFakeTimers();
    sandbox.stub(SonyBraviaAndroidTvFinder, 'scanForDevices');

    SonyBraviaAndroidTvFinder.foundDevices = [{ name: 'Fake Device' }];
    SonyBraviaAndroidTvFinder.getAllDevices().then(devices => {
      assert.deepEqual(devices, [{ name: 'Fake Device' }]);

    });

    clock.tick(5000);
  });

});