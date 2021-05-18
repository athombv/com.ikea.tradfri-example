'use strict';

const { ZigBeeLightDevice } = require('homey-zigbeedriver');

class GunnarpSquare extends ZigBeeLightDevice {

  get energyMap() {
    return {
      'GUNNARP panel 40*40': {
        approximation: {
          usageOff: 0.5,
          usageOn: 22,
        },
      },
    };
  }

}

module.exports = GunnarpSquare;
