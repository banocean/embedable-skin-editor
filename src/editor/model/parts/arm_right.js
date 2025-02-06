import * as THREE from "three"
import { ArmBasePart } from "./arm_base"

class RightArmPart extends ArmBasePart {
  constructor(texture, variant) {
    super(texture, variant)
  }

  name() { return "arm_right" }
  
  position() {
    return new THREE.Vector3(-0.75, -1.25, 0)
  }

  uvmap() {
    return {
      base: {
        front: [44, 20, 4, 12],
        bottom: [48, 20, 4, -4],
        left: [40, 20, 4, 12],
        right: [48, 20, 4, 12],
        top: [44, 16, 4, 4],
        back: [52, 20, 4, 12],
      },
      overlay: {
        front: [44, 36, 4, 12],
        bottom: [48, 36, 4, -4],
        left: [40, 36, 4, 12],
        right: [48, 36, 4, 12],
        top: [44, 32, 4, 4],
        back: [52, 36, 4, 12],
      }
    }
  }
}

export {RightArmPart}