const assert = require('assert');
const sinon = require('sinon');
const sandbox = sinon.createSandbox();

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

    SonyBraviaAndroidTvFinder.onDeviceResponse({ LOCATION: 'http://192.168.1.1:1337/philips' });

    assert.equal(spy.called, true);
    assert.equal(spy.calledWith({ LOCATION: 'http://192.168.1.1:1337/philips' }), true);
  });

  it('Should early return undefined if device meet validateDeviceHeaders requirements', async () => {
    sandbox.stub(SonyBraviaAndroidTvFinder, 'validateDeviceHeaders').returns(null);

    assert.equal(await SonyBraviaAndroidTvFinder.onDeviceResponse({ LOCATION: 'http://192.168.1.1:1337/philips' }), undefined);
  });

  it('Should fetch basic device details when Sony header is present', () => {
    sandbox.stub(SonyBraviaAndroidTvFinder, 'validateDeviceHeaders').returns({ name: 'Fake Device' });
    const stub = sandbox.stub(SonyBraviaAndroidTvFinder, 'fetchBasicDeviceDetails').returns(true);

    SonyBraviaAndroidTvFinder.onDeviceResponse({ LOCATION: 'http://192.168.1.1:1337/sony' });

    assert.equal(stub.called, true);
    assert.equal(stub.calledWith({ name: 'Fake Device' }), true);
  });

  it('Should early return undefined if device does not meet fetchBasicDeviceDetails requirements', async () => {
    sandbox.stub(SonyBraviaAndroidTvFinder, 'validateDeviceHeaders').returns({ name: 'Fake Device' });
    sandbox.stub(SonyBraviaAndroidTvFinder, 'fetchBasicDeviceDetails').returns(null);

    assert.equal(await SonyBraviaAndroidTvFinder.onDeviceResponse({ LOCATION: 'http://192.168.1.1:1337/sony' }), undefined);
  });

  it('Should finally push device into foundDevices if all requirements were met', async () => {
    sandbox.stub(SonyBraviaAndroidTvFinder, 'validateDeviceHeaders').returns({ name: 'Fake Device' });
    sandbox.stub(SonyBraviaAndroidTvFinder, 'fetchBasicDeviceDetails').returns({ name: 'Fake Device' });

    await SonyBraviaAndroidTvFinder.onDeviceResponse({ LOCATION: 'http://192.168.1.1:1337/sony' });

    assert.deepEqual(SonyBraviaAndroidTvFinder.foundDevices, [{ name: 'Fake Device' }]);
  });

  it('Should scan for devices when getAllDevices is called', () => {
    const stub = sandbox.stub(SonyBraviaAndroidTvFinder, 'scanForDevices');

    SonyBraviaAndroidTvFinder.getAllDevices();

    assert.equal(stub.called, true);
  });

  it('Should return all found devices after getAllDevices is called and timeout is reached', done => {
    const clock = sandbox.useFakeTimers();
    sandbox.stub(SonyBraviaAndroidTvFinder, 'scanForDevices');

    SonyBraviaAndroidTvFinder.foundDevices = [{ name: 'Fake Device' }];
    SonyBraviaAndroidTvFinder.getAllDevices().then(devices => {
      assert.deepEqual(devices, [{ name: 'Fake Device' }]);

      done();
    }).catch(err => done(err));

    clock.tick(5000);
  });

  it('Should clear devices before starting scanning for devices', () => {
    sandbox.stub(SonyBraviaAndroidTvFinder.ssdpClient, 'search');
    const spy = sandbox.spy(SonyBraviaAndroidTvFinder, 'clearDevices');

    SonyBraviaAndroidTvFinder.scanForDevices();

    assert.equal(spy.called, true);
  });

  it('Should tell the SSDP client to start searching when scanForDevices is called', () => {
    const stub = sandbox.stub(SonyBraviaAndroidTvFinder.ssdpClient, 'search');

    SonyBraviaAndroidTvFinder.scanForDevices();

    assert.equal(stub.called, true);
    assert.equal(stub.calledWith('upnp:rootdevice'), true);
  });

  it('Should early return undefined if the headers do not contain Sony headers', () => {
    assert.equal(SonyBraviaAndroidTvFinder.validateDeviceHeaders({ LOCATION: 'http://192.168.1.1:1337/philips' }), undefined);
  });

  it('Should extract IP address from device headers and populate default device data with it', () => {
    const stub = sandbox.stub(SonyBraviaAndroidTvFinder, 'populateDeviceData');

    SonyBraviaAndroidTvFinder.validateDeviceHeaders({ LOCATION: 'http://192.168.1.1:1337/sony', USN: '12345678' });

    assert.equal(stub.called, true);
    assert.equal(stub.calledWith(null, '12345678', '192.168.1.1', null), true);
  });

  it('Should return the device that has been populatd after headers were validated by validateDeviceHeaders', () => {
    sandbox.stub(SonyBraviaAndroidTvFinder, 'populateDeviceData').returns({ name: 'Fake device' });

    assert.deepEqual(SonyBraviaAndroidTvFinder.validateDeviceHeaders({ LOCATION: 'http://192.168.1.1:1337/sony' }), { name: 'Fake device' });
  });

  it('Should create populated device based on arguments given by callee', () => {
    const device = SonyBraviaAndroidTvFinder.populateDeviceData('Sony BRAVIA KD-65A1', '12345678', '192.168.1.1', '00:00:00:00:00:00');

    assert.equal(device.name, 'Sony BRAVIA KD-65A1');
    assert.equal(device.data.id, '12345678');
    assert.equal(device.settings.ip, '192.168.1.1');
    assert.equal(device.settings.macAddress, '00:00:00:00:00:00');
  });

  it('Should revert to default values when not all arguments are given by callee', () => {
    const device = SonyBraviaAndroidTvFinder.populateDeviceData(null, null, '192.168.1.1', null);

    assert.equal(device.name, 'Sony BRAVIA Android TV');
    assert.equal(device.data.id, '');
    assert.equal(device.settings.ip, '192.168.1.1');
    assert.equal(device.settings.macAddress, '');
  });

  it('Should create appropriate objects for populated device data', () => {
    const device = SonyBraviaAndroidTvFinder.populateDeviceData();

    assert.equal(typeof device.name === 'string', true);

    assert.equal(device.data instanceof Object, true);
    assert.equal(device.state instanceof Object, true);
    assert.equal(device.settings instanceof Object, true);
    assert.equal(device.capabilities instanceof Array, true);
  });

  it('Should make a request to the device when calling fetchBasicDeviceDetails', () => {
    const server = sandbox.useFakeServer();
    server.respondWith('POST', 'http://192.168.1.1/sony/system', [200, { 'Content-Type': 'application/json' }, JSON.stringify([{ name: 'Fake Device' }])]);
    server.respondImmediately = true;

    SonyBraviaAndroidTvFinder.fetchBasicDeviceDetails({ settings: { ip: '192.168.1.1' } });

    console.log(server.requests);

    assert.equal(server.requests.length > 0, true);

  })

});