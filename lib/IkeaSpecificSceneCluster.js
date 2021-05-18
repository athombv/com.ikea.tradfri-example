'use strict';

const { ScenesCluster, ZCLDataTypes } = require('zigbee-clusters');

class IkeaSpecificSceneCluster extends ScenesCluster {

  static get COMMANDS() {
    return {
      ...super.COMMANDS,
      ikeaSceneStep: {
        id: 0x07,
        manufacturerId: 0x117C,
        args: {
          mode: ZCLDataTypes.enum8({
            up: 0,
            down: 1,
          }),
          stepSize: ZCLDataTypes.uint8,
          transitionTime: ZCLDataTypes.uint16,
        },
      },
      ikeaSceneMove: {
        id: 0x08,
        manufacturerId: 0x117C,
        args: {
          mode: ZCLDataTypes.enum8({
            up: 0,
            down: 1,
          }),
          transitionTime: ZCLDataTypes.uint16,
        },
      },
      ikeaSceneMoveStop: {
        id: 0x09,
        manufacturerId: 0x117C,
        args: {
          duration: ZCLDataTypes.uint16,
        },
      },
    };
  }

}

module.exports = IkeaSpecificSceneCluster;
