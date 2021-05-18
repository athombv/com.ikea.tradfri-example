'use strict';

const { ZigBeeLightDevice } = require('homey-zigbeedriver');

class GunnarpRound extends ZigBeeLightDevice {

  get energyMap() {
    return {
      'GUNNARP panel round': {
        approximation: {
          usageOff: 0.5,
          usageOn: 22,
        },
      },
    };
  }

}

module.exports = GunnarpRound;
