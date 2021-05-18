'use strict';

const { ZigBeeLightDevice } = require('homey-zigbeedriver');

class DimmableBulb extends ZigBeeLightDevice {

  get energyMap() {
    return {
      'TRADFRI bulb E27 opal 1000lm': {
        approximation: {
          usageOff: 0.5,
          usageOn: 12.5,
        },
      },
      'TRADFRI bulb E27 W opal 1000lm': {
        approximation: {
          usageOff: 0.5,
          usageOn: 12.5,
        },
      },
      'TRADFRI bulb E27 WW clear 250lm': {
        approximation: {
          usageOff: 0.5,
          usageOn: 2.7,
        },
      },
      'TRADFRI bulb E27 WW 806lm': {
        approximation: {
          usageOff: 0.5,
          usageOn: 8.9,
        },
      },
    };
  }

}

module.exports = DimmableBulb;
