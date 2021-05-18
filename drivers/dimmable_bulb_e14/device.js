'use strict';

const { ZigBeeLightDevice } = require('homey-zigbeedriver');

class DimmableBulbE14 extends ZigBeeLightDevice {

  get energyMap() {
    return {
      'TRADFRI bulb E14 W op/ch 400lm': {
        approximation: {
          usageOff: 0.5,
          usageOn: 5.3,
        },
      },
    };
  }

}

module.exports = DimmableBulbE14;
