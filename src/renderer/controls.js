import * as THREE from "three";
import { OrbitControls } from "./orbit";

class Controls {
  constructor(parent) {
    this.parent = parent;
    this.orbit = this._setupOrbit(parent.camera, parent);
    this._setupEvents(parent);
  }

  pointer = new THREE.Vector2(100000, 100000);
  pointerDown = false;
  panning = false;
  firstClickOutside = false;
  targetingModel = false;

  handleIntersects() {
    const intersects = this.raycast();

    if (intersects.length > 0) {
      this.targetingModel = false;

      intersects.forEach(part => {
        if (part.object.type == "Mesh") {
          this.targetingModel = true;

          if (this.pointerDown && !this.firstClickOutside) {
            this.parent.toolAction(part);
          }

          return;
        }
      });

    } else {
      this.targetingModel = false;
    }
  }

  raycast() {
    const raycaster = this.parent.raycaster;
    raycaster.setFromCamera(this.pointer, this.parent.camera);

    return raycaster.intersectObjects(this.parent.scene.children);
  }

  onMouseDown(event) {
    const domElement = this.parent.renderer.canvas();
    this.setPointer(
      event.pageX - domElement.offsetLeft,
      event.pageY - domElement.offsetTop
    );
    this.handleIntersects();
    switch (event.buttons) {
      case 1: {
        this.pointerDown = true;
        if (this.targetingModel) {
          this.orbit.enabled = false;
        } else {
          this.firstClickOutside = true;
        }
        break;
      }
      case 4: {
        this.panning = true;
        break;
      }
    }
  }

  onMouseMove(event) {
    const domElement = this.parent.renderer.canvas();
    this.setPointer(
      event.pageX - domElement.offsetLeft,
      event.pageY - domElement.offsetTop
    );
  }

  onMouseUp() {
    this.pointerDown = false;
    this.panning = false;
    this.firstClickOutside = false;
    this.orbit.enabled = true;
  }

  setPointer(x, y) {
    const domElement = this.parent.renderer.canvas();
    this.pointer.x = (x / domElement.clientWidth) * 2 - 1;
    this.pointer.y = -(y / domElement.clientHeight) * 2 + 1;
  }

  getCursorStyle() {
    if (this.panning) { return "all-scroll"; }
    if ((this.targetingModel || this.pointerDown ) && !this.firstClickOutside) { return "crosshair"; }
    if (this.pointerDown) { return "grabbing"; }
    return "grab";
  }

  _setupOrbit(camera, parent) {
    const orbit = new OrbitControls(camera, parent);
    orbit.minDistance = 1;
    orbit.maxDistance = 15;
    orbit.panSpeed = 0.75;
    orbit.mouseButtons = { LEFT: THREE.MOUSE.ROTATE, MIDDLE: THREE.MOUSE.PAN, RIGHT: undefined };

    return orbit;
  }

  _setupEvents(parent) {
    parent.addEventListener("mousedown", this.onMouseDown.bind(this));
    parent.addEventListener("mousemove", this.onMouseMove.bind(this));
    parent.addEventListener("mouseup", this.onMouseUp.bind(this));
  }
}

export { Controls };
