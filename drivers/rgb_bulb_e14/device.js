'use strict';

const { ZigBeeLightDevice } = require('homey-zigbeedriver');

class RgbBulb extends ZigBeeLightDevice {

  get energyMap() {
    return {
      'TRADFRI bulb E14 CWS opal 600lm': {
        approximation: {
          usageOff: 0.5,
          usageOn: 8.6,
        },
      },
    };
  }

}

module.exports = RgbBulb;
