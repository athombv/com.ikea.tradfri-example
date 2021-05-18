'use strict';

// eslint-disable-next-line no-unused-vars,node/no-unpublished-require
const Homey = require('homey');
const { Util, ZigBeeDevice } = require('homey-zigbeedriver');
const { CLUSTER } = require('zigbee-clusters');

const LevelControlBoundCluster = require('../../lib/LevelControlBoundCluster');

const { throttle, debounce } = Util;

const maxValue = 255;

const FLOW_TRIGGER = {
  DIMMER_ROTATED: 'dimmer_rotated',
  DIMMER_ROTATE_STOPPED: 'dimmer_rotate_stopped',
};

class RemoteRotatingDimmer extends ZigBeeDevice {

  async onNodeInit({ zclNode }) {
    this.moving = false;
    this.movingSince = null;
    this.moveDirection = null;
    this.rate = null;
    this.value = 255;

    // Migration step, adds measure_battery capability if not already available
    if (!this.hasCapability('alarm_battery')) {
      await this.addCapability('alarm_battery');
    }

    // Register measure_battery capability and configure attribute reporting
    this.batteryThreshold = 20;
    this.registerCapability('alarm_battery', CLUSTER.POWER_CONFIGURATION, {
      getOpts: {
        getOnStart: true,
      },
      reportOpts: {
        configureAttributeReporting: {
          minInterval: 0, // No minimum reporting interval
          maxInterval: 60000, // Maximally every ~16 hours
          minChange: 5, // Report when value changed by 5
        },
      },
    });

    // Bind bound cluster which handles incoming commands from the node, must be hardcoded on
    // endpoint 1 for this device
    const moveCommandParser = this.moveCommandParser.bind(this);
    const stopCommandParser = this.stopCommandParser.bind(this);
    this.zclNode.endpoints[1].bind(CLUSTER.LEVEL_CONTROL.NAME, new LevelControlBoundCluster({
      onMove: moveCommandParser,
      onMoveWithOnOff: moveCommandParser,
      onStop: stopCommandParser,
      onStopWithOnOff: stopCommandParser,
    }));

    // Create throttled function for trigger Flow
    this.triggerDimmerRotatedFlow = throttle(() => this.triggerFlow({
      id: FLOW_TRIGGER.DIMMER_ROTATED,
      tokens: { value: this.currentRotateValue },
      state: null,
    }).then(() => this.log(`trigger value ${this.currentRotateValue}`)),
    100);

    // Create debounced function for trigger Flow
    this.triggerDimmerRotateStoppedFlow = debounce(() => this.triggerFlow({
      id: FLOW_TRIGGER.DIMMER_ROTATE_STOPPED,
      tokens: { value: this.currentRotateValue },
      state: null,
    }).then(() => this.log(`stopped trigger value ${this.currentRotateValue}`)),
    500);
  }

  /**
   * Returns currently calculated rotate value.
   * @returns {number}
   */
  get currentRotateValue() {
    return Math.round((this.value / maxValue) * 100) / 100;
  }

  /**
   * Method that parsed an incoming `move` or `moveWithOnOff` command.
   * @param {object} payload
   * @property {string} payload.moveMode - 'up' or 'down'
   * @property {number} payload.rate
   */
  moveCommandParser(payload) {
    this.debug('moveCommandParser', payload);
    this.moving = true;
    this.movingSince = Date.now();
    this.moveDirection = payload.moveMode === 'up' ? 1 : -1;
    this.rate = payload.rate;
    this.triggerDimmerRotatedFlow();
    this.triggerDimmerRotateStoppedFlow();
  }

  /**
   * Method that handles an incoming `stop` or `stopWithOnOff` command.
   */
  stopCommandParser() {
    this.debug('stopCommandParser', {
      moving: this.moving,
      movingSince: this.movingSince,
      value: this.value,
      rate: this.rate,
      direction: this.moveDirection,
    });

    if (this.moving === true || Date.now() - this.movingSince < 3000) {
      const sensitivity = this.getSetting('sensitivity');

      let delta = 0;
      if (typeof sensitivity === 'number' && !Number.isNaN(sensitivity) && sensitivity > 0.1) {
        delta = ((Date.now() - this.movingSince) / 1000) * this.rate * sensitivity;
      } else {
        delta = ((Date.now() - this.movingSince) / 1000) * this.rate;
      }

      this.value += delta * this.moveDirection;

      if (this.value > maxValue) this.value = maxValue;
      if (this.value < 0) this.value = 0;

      this.moving = false;
      this.movingSince = null;
    }
    this.triggerDimmerRotatedFlow();
    this.triggerDimmerRotateStoppedFlow();
  }

}

module.exports = RemoteRotatingDimmer;
