'use strict';

const { ZigBeeLightDevice } = require('homey-zigbeedriver');

class DimmableSpot extends ZigBeeLightDevice {

  get energyMap() {
    return {
      'TRADFRI bulb GU10 W 400lm': {
        approximation: {
          usageOff: 0.5,
          usageOn: 5.3,
        },
      },
      'TRADFRI bulb GU10 WW 400lm': {
        approximation: {
          usageOff: 0.5,
          usageOn: 5.3,
        },
      },
    };
  }

}

module.exports = DimmableSpot;
