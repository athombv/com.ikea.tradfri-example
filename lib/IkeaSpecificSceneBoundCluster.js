'use strict';

const { BoundCluster } = require('zigbee-clusters');

class IkeaSpecificSceneBoundCluster extends BoundCluster {

  constructor({
    onIkeaSceneStep,
    onIkeaSceneMove,
    onIkeaSceneMoveStop,
  }) {
    super();
    this._onIkeaSceneStep = onIkeaSceneStep;
    this._onIkeaSceneMove = onIkeaSceneMove;
    this._onIkeaSceneMoveStop = onIkeaSceneMoveStop;
  }

  async ikeaSceneStep(payload) {
    if (typeof this._onIkeaSceneStep === 'function') {
      this._onIkeaSceneStep(payload);
    }
  }

  async ikeaSceneMove(payload) {
    if (typeof this._onIkeaSceneMove === 'function') {
      this._onIkeaSceneMove(payload);
    }
  }

  async ikeaSceneMoveStop(payload) {
    if (typeof this._onIkeaSceneMoveStop === 'function') {
      this._onIkeaSceneMoveStop(payload);
    }
  }

}

module.exports = IkeaSpecificSceneBoundCluster;
