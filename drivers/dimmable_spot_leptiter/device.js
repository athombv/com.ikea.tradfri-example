'use strict';

const { ZigBeeLightDevice } = require('homey-zigbeedriver');

class LeptiterDimmableSpot extends ZigBeeLightDevice {

  get energyMap() {
    return {
      'LEPTITER Recessed spot light': {
        approximation: {
          usageOff: 0.5,
          usageOn: 9,
        },
      },
    };
  }

}

module.exports = LeptiterDimmableSpot;
