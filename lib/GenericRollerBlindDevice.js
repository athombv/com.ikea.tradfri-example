'use strict';

const { ZigBeeDevice } = require('homey-zigbeedriver');

const { CLUSTER } = require('zigbee-clusters');

class GenericRollerBlindDevice extends ZigBeeDevice {

  async onNodeInit({ zclNode }) {
    // This value is set by the system set parser in order to know whether command was sent from
    // Homey
    this._reportDebounceEnabled = false;

    // Register windowcoverings set capability and configure attribute reporting
    this.registerCapability('windowcoverings_set', CLUSTER.WINDOW_COVERING, {
      reportOpts: {
        configureAttributeReporting: {
          minInterval: 0, // No minimum reporting interval
          maxInterval: 60000, // Maximally every ~16 hours
          minChange: 5, // Report when value changed by 5
        },
      },
    });

    // Refactored measure_battery to alarm battery, not all devices will have this capability
    if (this.hasCapability('alarm_battery')) {
      // Set battery threshold under which the alarm should go off
      this.batteryThreshold = 20;

      // Register measure_battery capability and configure attribute reporting
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
    }

    // Legacy: used to have measure_battery capability, removed due to inaccurate readings
    if (this.hasCapability('measure_battery')) {
      this.registerCapability('measure_battery', CLUSTER.POWER_CONFIGURATION, {
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
    }
  }

}

module.exports = GenericRollerBlindDevice;
