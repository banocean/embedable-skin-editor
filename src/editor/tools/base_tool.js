import * as THREE from "three";
import { IMAGE_HEIGHT, IMAGE_WIDTH } from "../main";
import CanvasHelper from "./canvas_helper";

class BaseTool {
  constructor(config) {
    this.config = config;
  }

  down(_texture, _part, _x, _y, _pointerButton) {}
  move(_part, _x, _y, _pointerButton) {}
  up(_x, _y) {}

  tempCanvas() {
    return new CanvasHelper();
  }

  canvasToTexture(canvas) {
    const texture = new THREE.Texture(canvas);
    texture.minFilter = THREE.NearestFilter;
    texture.magFilter = THREE.NearestFilter;

    return texture;
  }
}

export { BaseTool };