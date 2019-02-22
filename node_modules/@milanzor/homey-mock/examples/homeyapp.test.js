// NOTE: This is pseudo code for exampling purpose only

// Fetch assert
const assert = require('assert');

// Fetch mock-require, this package can make Node think a package is available
// We need this because in our development environment `require('homey')` does not work, so your app will never be able to run there
const mock = require('mock-require');

// Do the actual mocking
mock('homey', require('homey-mock'));

// For unit testing purposes
const Homey = require('homey');

// Somewhere within this file, you will do `require('homey');
const yourAppsMainClass = require('../some-js-file');

describe('homeyapp-example', () => {

    it('must extend Homey.App', () => {
        let yourAppInstance = new yourAppsMainClass;
        assert.equal(yourAppInstance instanceof Homey.App, true);
    });

    it('someProperty must be someValue', () => {
        assert.strictEqual(yourAppsMainClass.someProperty, 'someValue');
    });

});
