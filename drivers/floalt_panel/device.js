'use strict';

const { ZigBeeLightDevice } = require('homey-zigbeedriver');

/**
 * It appears a few FLOALT panels do not support colorControl (768).
 */
class FloaltPanel extends ZigBeeLightDevice {

  get energyMap() {
    return {
      'FLOALT panel WS 30x30': {
        approximation: {
          usageOff: 0.5,
          usageOn: 12.5,
        },
      },
      'FLOALT panel WS 30x90': {
        approximation: {
          usageOff: 0.5,
          usageOn: 25,
        },
      },
      'FLOALT panel WS 90x30': {
        approximation: {
          usageOff: 0.5,
          usageOn: 25,
        },
      },
      'FLOALT panel WS 60x60': {
        approximation: {
          usageOff: 0.5,
          usageOn: 34,
        },
      },
    };
  }

}

module.exports = FloaltPanel;
