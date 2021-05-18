'use strict';

const { ZigBeeDevice } = require('homey-zigbeedriver');

const { CLUSTER } = require('zigbee-clusters');

const WindowCoveringBoundCluster = require('../../lib/WindowCoveringBoundCluster');

class UpDownRemoteControl extends ZigBeeDevice {

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

    zclNode.endpoints[1].bind(CLUSTER.WINDOW_COVERING.NAME, new WindowCoveringBoundCluster({
      onDownClose: this._onUpDownCommandHandler.bind(this, 'down'),
      onUpOpen: this._onUpDownCommandHandler.bind(this, 'up'),
    }));
  }

  /**
   * Triggers a Flow based on the provided `type` parameter.
   * @param {'down'|'up'} type
   * @private
   */
  _onUpDownCommandHandler(type) {
    if (type !== 'up' && type !== 'down') throw new Error('invalid_up_down_type');
    this.triggerFlow({ id: type })
      .then(() => this.log(`flow was triggered: ${type}`))
      .catch(err => this.error(`Error: triggering flow: ${type}`, err));
  }

}

module.exports = UpDownRemoteControl;
