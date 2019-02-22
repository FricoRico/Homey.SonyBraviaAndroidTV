// Fetch assert
const assert = require('assert');

// Fetch homey-mock
const Homey = require('../');

describe('homey-mock', () => {

    it('must be an Object', () => {
        assert.strictEqual(Homey instanceof Object, true);
    });
    
    it('must mock Api', () => {
        assert.strictEqual(Homey.hasOwnProperty('Api'), true);
    });

    it('must mock ApiApp', () => {
        assert.strictEqual(Homey.hasOwnProperty('ApiApp'), true);
    });

    it('must mock App', () => {
        assert.strictEqual(Homey.hasOwnProperty('App'), true);
    });

    it('must mock BleAdvertisement', () => {
        assert.strictEqual(Homey.hasOwnProperty('BleAdvertisement'), true);
    });

    it('must mock BleCharacteristic', () => {
        assert.strictEqual(Homey.hasOwnProperty('BleCharacteristic'), true);
    });

    it('must mock BleDescriptor', () => {
        assert.strictEqual(Homey.hasOwnProperty('BleDescriptor'), true);
    });

    it('must mock BlePeripheral', () => {
        assert.strictEqual(Homey.hasOwnProperty('BlePeripheral'), true);
    });

    it('must mock BleService', () => {
        assert.strictEqual(Homey.hasOwnProperty('BleService'), true);
    });

    it('must mock CloudOAuth2Callback', () => {
        assert.strictEqual(Homey.hasOwnProperty('CloudOAuth2Callback'), true);
    });

    it('must mock CloudWebhook', () => {
        assert.strictEqual(Homey.hasOwnProperty('CloudWebhook'), true);
    });

    it('must mock CronTask', () => {
        assert.strictEqual(Homey.hasOwnProperty('CronTask'), true);
    });

    it('must mock Device', () => {
        assert.strictEqual(Homey.hasOwnProperty('Device'), true);
    });

    it('must mock Driver', () => {
        assert.strictEqual(Homey.hasOwnProperty('Driver'), true);
    });

    it('must mock FlowArgument', () => {
        assert.strictEqual(Homey.hasOwnProperty('FlowArgument'), true);
    });

    it('must mock FlowCard', () => {
        assert.strictEqual(Homey.hasOwnProperty('FlowCard'), true);
    });

    it('must mock FlowCardAction', () => {
        assert.strictEqual(Homey.hasOwnProperty('FlowCardAction'), true);
    });

    it('must mock FlowCardCondition', () => {
        assert.strictEqual(Homey.hasOwnProperty('FlowCardCondition'), true);
    });

    it('must mock FlowCardTrigger', () => {
        assert.strictEqual(Homey.hasOwnProperty('FlowCardTrigger'), true);
    });

    it('must mock FlowCardTriggerDevice', () => {
        assert.strictEqual(Homey.hasOwnProperty('FlowCardTriggerDevice'), true);
    });

    it('must mock FlowToken', () => {
        assert.strictEqual(Homey.hasOwnProperty('FlowToken'), true);
    });

    it('must mock Image', () => {
        assert.strictEqual(Homey.hasOwnProperty('Image'), true);
    });

    it('must mock InsightsLog', () => {
        assert.strictEqual(Homey.hasOwnProperty('InsightsLog'), true);
    });

    it('must mock LedringAnimation', () => {
        assert.strictEqual(Homey.hasOwnProperty('LedringAnimation'), true);
    });

    it('must mock LedringAnimationSystem', () => {
        assert.strictEqual(Homey.hasOwnProperty('LedringAnimationSystem'), true);
    });

    it('must mock LedringAnimationSystemProgress', () => {
        assert.strictEqual(Homey.hasOwnProperty('LedringAnimationSystemProgress'), true);
    });

    it('must mock ManagerApi', () => {
        assert.strictEqual(Homey.hasOwnProperty('ManagerApi'), true);
    });

    it('must mock ManagerApps', () => {
        assert.strictEqual(Homey.hasOwnProperty('ManagerApps'), true);
    });

    it('must mock ManagerArp', () => {
        assert.strictEqual(Homey.hasOwnProperty('ManagerArp'), true);
    });

    it('must mock ManagerAudio', () => {
        assert.strictEqual(Homey.hasOwnProperty('ManagerAudio'), true);
    });

    it('must mock ManagerBLE', () => {
        assert.strictEqual(Homey.hasOwnProperty('ManagerBLE'), true);
    });

    it('must mock ManagerClock', () => {
        assert.strictEqual(Homey.hasOwnProperty('ManagerClock'), true);
    });

    it('must mock ManagerCloud', () => {
        assert.strictEqual(Homey.hasOwnProperty('ManagerCloud'), true);
    });

    it('must mock ManagerCron', () => {
        assert.strictEqual(Homey.hasOwnProperty('ManagerCron'), true);
    });

    it('must mock ManagerDrivers', () => {
        assert.strictEqual(Homey.hasOwnProperty('ManagerDrivers'), true);
    });

    it('must mock ManagerFlow', () => {
        assert.strictEqual(Homey.hasOwnProperty('ManagerFlow'), true);
    });

    it('must mock ManagerGeolocation', () => {
        assert.strictEqual(Homey.hasOwnProperty('ManagerGeolocation'), true);
    });

    it('must mock ManagerI18n', () => {
        assert.strictEqual(Homey.hasOwnProperty('ManagerI18n'), true);
    });

    it('must mock ManagerImages', () => {
        assert.strictEqual(Homey.hasOwnProperty('ManagerImages'), true);
    });

    it('must mock ManagerInsights', () => {
        assert.strictEqual(Homey.hasOwnProperty('ManagerInsights'), true);
    });

    it('must mock ManagerLedring', () => {
        assert.strictEqual(Homey.hasOwnProperty('ManagerLedring'), true);
    });

    it('must mock ManagerNFC', () => {
        assert.strictEqual(Homey.hasOwnProperty('ManagerNFC'), true);
    });

    it('must mock ManagerNotifications', () => {
        assert.strictEqual(Homey.hasOwnProperty('ManagerNotifications'), true);
    });

    it('must mock ManagerRF', () => {
        assert.strictEqual(Homey.hasOwnProperty('ManagerRF'), true);
    });

    it('must mock ManagerSettings', () => {
        assert.strictEqual(Homey.hasOwnProperty('ManagerSettings'), true);
    });

    it('must mock ManagerSpeechInput', () => {
        assert.strictEqual(Homey.hasOwnProperty('ManagerSpeechInput'), true);
    });

    it('must mock ManagerSpeechOutput', () => {
        assert.strictEqual(Homey.hasOwnProperty('ManagerSpeechOutput'), true);
    });

    it('must mock ManagerZigBee', () => {
        assert.strictEqual(Homey.hasOwnProperty('ManagerZigBee'), true);
    });

    it('must mock ManagerZwave', () => {
        assert.strictEqual(Homey.hasOwnProperty('ManagerZwave'), true);
    });

    it('must mock Notification', () => {
        assert.strictEqual(Homey.hasOwnProperty('Notification'), true);
    });

    it('must mock Signal', () => {
        assert.strictEqual(Homey.hasOwnProperty('Signal'), true);
    });

    it('must mock Signal433', () => {
        assert.strictEqual(Homey.hasOwnProperty('Signal433'), true);
    });

    it('must mock Signal868', () => {
        assert.strictEqual(Homey.hasOwnProperty('Signal868'), true);
    });

    it('must mock SignalInfrared', () => {
        assert.strictEqual(Homey.hasOwnProperty('SignalInfrared'), true);
    });

    it('must mock SimpleClass', () => {
        assert.strictEqual(Homey.hasOwnProperty('SimpleClass'), true);
    });

    it('must mock Speaker', () => {
        assert.strictEqual(Homey.hasOwnProperty('Speaker'), true);
    });

    it('must mock ZigBeeCluster', () => {
        assert.strictEqual(Homey.hasOwnProperty('ZigBeeCluster'), true);
    });

    it('must mock ZigBeeEndpoint', () => {
        assert.strictEqual(Homey.hasOwnProperty('ZigBeeEndpoint'), true);
    });

    it('must mock ZigBeeNode', () => {
        assert.strictEqual(Homey.hasOwnProperty('ZigBeeNode'), true);
    });

    it('must mock ZwaveCommandClass', () => {
        assert.strictEqual(Homey.hasOwnProperty('ZwaveCommandClass'), true);
    });

    it('must mock ZwaveNode', () => {
        assert.strictEqual(Homey.hasOwnProperty('ZwaveNode'), true);
    });

});

