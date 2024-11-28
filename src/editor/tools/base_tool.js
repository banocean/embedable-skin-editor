import * as THREE from "three";
import { IMAGE_HEIGHT, IMAGE_WIDTH } from "../main";

class BaseTool {
  constructor(config) {
    this.config = config;
  }

  down(texture, x, y) {}
  move(x, y) {}
  up(x, y) {}

  tempCanvas() {
    return new OffscreenCanvas(IMAGE_WIDTH, IMAGE_HEIGHT);
  }

  canvasToTexture(canvas) {
    const texture = new THREE.Texture(canvas);
    texture.minFilter = THREE.NearestFilter;
    texture.magFilter = THREE.NearestFilter;

    return texture;
  }
}

export { BaseTool };