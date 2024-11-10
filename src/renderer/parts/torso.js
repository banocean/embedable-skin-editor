import * as THREE from "three"
import { BasePart } from "./base"

class TorsoPart extends BasePart {
  constructor(texture) {
    super(texture)
  }

  name() { return "torso" }

  position() {
    return new THREE.Vector3(0, -1.25, 0)
  }

  size() {
    return {
      base: [1, 1.5, 0.5],
      overlay: [1.1, 1.6, 0.6]
    }
  }

  uvmap() {
    return {
      base: {
        front: [20, 20, 8, 12],
        bottom: [28, 20, 8, -4],
        left: [16, 20, 4, 12],
        right: [28, 20, 4, 12],
        top: [20, 16, 8, 4],
        back: [32, 20, 8, 12],
      },
      overlay: {
        front: [20, 36, 8, 12],
        bottom: [28, 36, 8, -4],
        left: [16, 36, 4, 12],
        right: [28, 36, 4, 12],
        top: [20, 32, 8, 4],
        back: [32, 36, 8, 12],
      }
    }
  }
}

export {TorsoPart}