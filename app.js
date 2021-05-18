'use strict';

// eslint-disable-next-line node/no-unpublished-require
const Homey = require('homey');
const { Log } = require('homey-log');
const { debug } = require('zigbee-clusters');

// Enable zigbee-cluster logging
debug(true);

class IkeaTradfriApp extends Homey.App {

  onInit() {
    this.log('init');
    this.homeyLog = new Log({ homey: this.homey });
  }

}

module.exports = IkeaTradfriApp;
