import * as THREE from "three"
import { BasePart } from "../base"

class LeftLegPart extends BasePart {
  constructor(texture) {
    super(texture)
  }

  name() { return "leg_left" }

  position() {
    return new THREE.Vector3(0.25, -2.75, 0)
  }

  size() {
    return {
      base: [0.5, 1.5, 0.5],
      overlay: [0.6, 1.6, 0.6]
    }
  }

  uvmap() {
    return {
      base: {
        front: [20, 52, 4, 12],
        bottom: [24, 52, 4, -4],
        left: [16, 52, 4, 12],
        right: [24, 52, 4, 12],
        top: [20, 48, 4, 4],
        back: [28, 52, 4, 12],
      },
      overlay: {
        front: [4, 52, 4, 12],
        bottom: [8, 52, 4, -4],
        left: [0, 52, 4, 12],
        right: [8, 52, 4, 12],
        top: [4, 48, 4, 4],
        back: [12, 52, 4, 12],
      }
    }
  }
}

export {LeftLegPart}