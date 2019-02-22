'use strict';

const Entity = require('./entity');

class Homey extends Entity {
    
    static get Driver() {
        return require('./driver');
    }   
     
    static get Device() {
        return require('./device');
    }
    
    static get util() {
        return require('./util');
    }
    
}

module.exports = Homey;