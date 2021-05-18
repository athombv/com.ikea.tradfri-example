'use strict';

const { ZigBeeDevice } = require('homey-zigbeedriver');

const { CLUSTER } = require('zigbee-clusters');

const OnOffBoundCluster = require('../../lib/OnOffBoundCluster');

class MotionSensor extends ZigBeeDevice {

  onNodeInit({ zclNode }) {
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
    this.zclNode.endpoints[1].bind(CLUSTER.ON_OFF.NAME, new OnOffBoundCluster({
      onWithTimedOff: this._onWithTimedOffCommandHandler.bind(this),
    }));
  }

  /**
   * Handles `onWithTimedOff` commands, these indicate motion detected.
   * @param {0|1} onOffControl - 1 if set to night mode, 0 if set to day mode
   * @param {number} onTime - Time in 1/10th seconds for which the alarm should be active
   * @param {number} offWaitTime - Time in 1/10th seconds for which the alarm should be off
   */
  _onWithTimedOffCommandHandler({ onOffControl, onTime, offWaitTime }) {
    this.setCapabilityValue('alarm_motion', true)
      .catch(err => this.error('Error: could not set alarm_motion capability value', err));
    clearTimeout(this._motionAlarmTimeout);
    this._motionAlarmTimeout = setTimeout(() => {
      this.setCapabilityValue('alarm_motion', false)
        .catch(err => this.error('Error: could not set alarm_motion capability value', err));
    }, (onTime / 10) * 1000);
  }

}

module.exports = MotionSensor;
