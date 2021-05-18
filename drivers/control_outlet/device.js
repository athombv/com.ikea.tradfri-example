'use strict';

const { CLUSTER } = require('zigbee-clusters');
const { ZigBeeDevice } = require('homey-zigbeedriver');

class ControlOutlet extends ZigBeeDevice {

  onNodeInit() {
    // Register onoff capability
    this.registerCapability('onoff', CLUSTER.ON_OFF);
  }

}

module.exports = ControlOutlet;
