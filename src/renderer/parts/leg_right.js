import * as THREE from "three"
import { BasePart } from "./base"

class RightLegPart extends BasePart {
  constructor(texture) {
    super(texture)
  }

  position() {
    return new THREE.Vector3(-0.25, -2.75, 0)
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
        front: [4, 20, 4, 12],
        bottom: [8, 20, 4, -4],
        left: [0, 20, 4, 12],
        right: [8, 20, 4, 12],
        top: [4, 16, 4, 4],
        back: [12, 20, 4, 12],
      },
      overlay: {
        front: [4, 36, 4, 12],
        bottom: [8, 36, 4, -4],
        left: [0, 36, 4, 12],
        right: [8, 36, 4, 12],
        top: [4, 32, 4, 4],
        back: [12, 36, 4, 12],
      }
    }
  }
}

export {RightLegPart}