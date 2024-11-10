import * as THREE from "three"
import { ArmBasePart } from "./arm_base"

class LeftArmPart extends ArmBasePart {
  constructor(texture) {
    super(texture)
  }

  position() {
    return new THREE.Vector3(0.75, -1.25, 0)
  }

  uvmap() {
    return {
      base: {
        front: [36, 52, 4, 12],
        bottom: [40, 52, 4, -4],
        left: [32, 52, 4, 12],
        right: [40, 52, 4, 12],
        top: [36, 48, 4, 4],
        back: [44, 52, 4, 12],
      },
      overlay: {
        front: [52, 52, 4, 12],
        bottom: [56, 52, 4, -4],
        left: [48, 52, 4, 12],
        right: [56, 52, 4, 12],
        top: [52, 48, 4, 4],
        back: [60, 52, 4, 12],
      }
    }
  }
}

export {LeftArmPart}