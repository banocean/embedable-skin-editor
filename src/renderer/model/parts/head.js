import * as THREE from "three"
import { BasePart } from "../base"

class HeadPart extends BasePart {
  constructor(texture) {
    super(texture)
  }

  name() { return "head" }

  position() {
    return new THREE.Vector3(0, 0, 0)
  }

  size() {
    return {
      base: [1, 1, 1],
      overlay: [1.1, 1.1, 1.1]
    }
  }

  uvmap() {
    return {
      base: {
        front: [8, 8, 8, 8],
        bottom: [16, 8, 8, -8],
        left: [0, 8, 8, 8],
        right: [16, 8, 8, 8],
        top: [8, 0, 8, 8],
        back: [24, 8, 8, 8],
      },
      overlay: {
        front: [40, 8, 8, 8],
        bottom: [48, 8, 8, -8],
        left: [32, 8, 8, 8],
        right: [48, 8, 8, 8],
        top: [40, 0, 8, 8],
        back: [56, 8, 8, 8],
      }
    }
  }
}

export {HeadPart}