'use strict';

const { ZigBeeDevice } = require('homey-zigbeedriver');
const { Cluster, CLUSTER } = require('zigbee-clusters');

const IkeaSpecificSceneCluster = require('../../lib/IkeaSpecificSceneCluster');
const IkeaSpecificSceneBoundCluster = require('../../lib/IkeaSpecificSceneBoundCluster');
const OnOffBoundCluster = require('../../lib/OnOffBoundCluster');
const LevelControlBoundCluster = require('../../lib/LevelControlBoundCluster');

Cluster.addCluster(IkeaSpecificSceneCluster);

class RemoteControl extends ZigBeeDevice {

  async onNodeInit({ zclNode }) {
    this._currentLongPress = null;
    this._currentSceneLongPress = null;

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

    // Bind on/off button commands
    zclNode.endpoints[1].bind(CLUSTER.ON_OFF.NAME, new OnOffBoundCluster({
      onToggle: this._toggleCommandHandler.bind(this),
    }));

    // Bind Ikea scene button commands
    zclNode.endpoints[1].bind(CLUSTER.SCENES.NAME, new IkeaSpecificSceneBoundCluster({
      onIkeaSceneStep: this._ikeaStepCommandHandler.bind(this),
      onIkeaSceneMove: this._ikeaMoveCommandHandler.bind(this),
      onIkeaSceneMoveStop: this._ikeaStopCommandHandler.bind(this),
    }));

    // Bind dim button commands
    zclNode.endpoints[1].bind(CLUSTER.LEVEL_CONTROL.NAME, new LevelControlBoundCluster({
      onStep: this._stepCommandHandler.bind(this),
      onStepWithOnOff: this._stepCommandHandler.bind(this),

      onMove: this._moveCommandHandler.bind(this),
      onMoveWithOnOff: this._moveCommandHandler.bind(this),

      onStop: this._stopCommandHandler.bind(this),
      onStopWithOnOff: this._stopCommandHandler.bind(this),
    }));
  }

  /**
   * Triggers the 'toggled' Flow.
   * @private
   */
  _toggleCommandHandler() {
    this.triggerFlow({ id: 'toggled' })
      .then(() => this.log('flow was triggered', 'toggled'))
      .catch(err => this.error('Error: triggering flow', 'toggled', err));
  }

  /**
   * Stores the last known long press move mode.
   * @param {'up'|'down'} moveMode
   * @private
   */
  _moveCommandHandler({ moveMode }) {
    this._currentLongPress = moveMode;
  }

  /**
   * Handles Ikea specific move command `onIkeaSceneMove`, will store the last known long press
   * scene move mode.
   * @param {'up'|'down'} mode
   * @param {number} stepSize - A change of `currentLevel` in step size units.
   * @param {number} transitionTime - Time in 1/10th seconds specified performing the step
   * should take.
   * @private
   */
  _ikeaMoveCommandHandler({ mode, stepSize, transitionTime }) {
    this._currentSceneLongPress = mode;
  }

  /**
   * Handles `onStep` and `onStepWithOnOff` commands and triggers a Flow based on the `mode`
   * parameter.
   * @param {'up'|'down'} mode
   * @param {number} stepSize - A change of `currentLevel` in step size units.
   * @param {number} transitionTime - Time in 1/10th seconds specified performing the step
   * should take.
   * @private
   */
  _stepCommandHandler({ mode, stepSize, transitionTime }) {
    if (typeof mode === 'string') {
      this.triggerFlow({ id: `dim_${mode}` })
        .then(() => this.log('flow was triggered', `dim_${mode}`))
        .catch(err => this.error('Error: triggering flow', `dim_${mode}`, err));
    }
  }

  /**
   * Handles Ikea specific scene step command `onIkeaSceneStep` and triggers a Flow based on the
   * `mode` parameter.
   * @param {'up'|'down'} mode
   * @param {number} stepSize - A change of `currentLevel` in step size units.
   * @param {number} transitionTime - Time in 1/10th seconds specified performing the step
   * should take.
   * @private
   */
  _ikeaStepCommandHandler({ mode, stepSize, transitionTime }) {
    if (typeof mode === 'string') {
      this.triggerFlow({ id: `scene_${mode}` })
        .then(() => this.log('flow was triggered', `scene_${mode}`))
        .catch(err => this.error('Error: triggering flow', `scene_${mode}`, err));
    }
  }

  /**
   * Handles `onStop` and `onStopWithOnOff` commands and triggers a Flow based on the last known
   * long press move mode.
   * @private
   */
  _stopCommandHandler() {
    if (this._currentLongPress) {
      const flowId = `dim_${this._currentLongPress}_long_press`;
      this.triggerFlow({ id: flowId })
        .then(() => this.log('flow was triggered', flowId))
        .catch(err => this.error('Error: triggering flow', flowId, err));
      this._currentLongPress = null;
    }
  }

  /**
   * Handles Ikea specific stop command `onIkeaSceneMoveStop` and triggers a Flow based on the
   * last known long press scene move mode.
   * @private
   */
  _ikeaStopCommandHandler() {
    if (this._currentSceneLongPress) {
      const flowId = `scene_${this._currentSceneLongPress}_long_press`;
      this.triggerFlow({ id: flowId })
        .then(() => this.log('flow was triggered', flowId))
        .catch(err => this.error('Error: triggering flow', flowId, err));
      this._currentSceneLongPress = null;
    }
  }

}

module.exports = RemoteControl;
