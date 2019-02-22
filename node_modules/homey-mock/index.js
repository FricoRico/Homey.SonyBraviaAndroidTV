const Homey = require('./homey');
const path = require('path')

const Module = require('module');
const require_ = Module.prototype.require;
Module.prototype.require = function() {
	if( arguments[0] === 'homey' ) return Homey;
	return require_.apply( this, arguments );
};

let root = module.parent.filename.split(path.sep);
root = root.slice(0, root.indexOf('test')).join(path.sep);
Homey.appRoot = root;
Homey.manifest = require(path.join(root, 'app.json'));

module.exports = Homey;