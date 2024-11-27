import { LitElement, css, html } from "lit";
import * as THREE from "three";
import { Controls } from "./controls";
import { Layers } from "./layers";
import { SkinModel } from "./model/model";

const IMAGE_WIDTH = 64
const IMAGE_HEIGHT = 64

class Editor extends LitElement {
  static styles = css`
    :host {
      display: block;
      height: 100%;
      position: relative;
      overflow: hidden;
      cursor: grab;
    }
  `;

  constructor() {
    super();
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.clientWidth / this.clientHeight,
      0.1,
      1000
    );
    this.renderer = this._setupRenderer();
    this.controls = new Controls(this);
    this.raycaster = new THREE.Raycaster();
    this.layers = new Layers(IMAGE_WIDTH, IMAGE_HEIGHT);
    this._loadSkin();
    this._setupMesh(this.layers.texture);
    this._startRender();
    this._setupResizeObserver();
  }

  skinMesh;
  baseGroup;
  model;

  render() {
    return this.renderer.domElement;
  }

  sceneRender() {
    this.controls.handleIntersects();
    this.renderer.render(this.scene, this.camera);
    this.style.cursor = this.controls.getCursorStyle();
  }

  centerModel() {
    const orbit = this.controls.orbit;

    const bounds = new THREE.Box3();
    bounds.setFromObject(this.skinMesh);

    const size = new THREE.Vector3();
    bounds.getSize(size);

    this.skinMesh.position.y = size.y / 3;
        
    orbit.saveState();
    orbit.reset();
  }

  toolAction(part) {
    const pixel = new THREE.Vector2(part.uv.x * IMAGE_WIDTH, part.uv.y * IMAGE_HEIGHT);
    pixel.x = Math.floor(pixel.x);
    pixel.y = IMAGE_HEIGHT - Math.ceil(pixel.y);
  }

  zoom(zoom) {
    this.camera.zoom = zoom;
    this.camera.updateProjectionMatrix();
  }

  setOverlaysVisible(visible) {
    this.model.parts.forEach(part => {
      part.setOverlayVisible(visible);
    })
  }

  setBasesVisible(visible) {
    this.model.parts.forEach(part => {
      part.setBaseVisible(visible);
    })
  }

  setPartVisible(name, visible) {
    this.model.parts.forEach(part => {
      if (part.name() == name) {
        part.setVisible(visible)
      }
    })
  }

  _setupRenderer() {
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(this.clientWidth, this.clientHeight);
    renderer.domElement.style.position = "absolute";
    renderer.sortObjects = false;
    return renderer;
  }

  _setupResizeObserver() {
    const obs = new ResizeObserver((e) => {
      const target = e[0].target;
      const renderer = this.renderer;
      renderer.setSize(target.clientWidth * 2, target.clientHeight * 2);
      renderer.domElement.style.top = `-${this.clientHeight / 2}px`;
      renderer.domElement.style.left = `-${this.clientWidth / 2}px`;
      this.camera.aspect = target.clientWidth / target.clientHeight;
      this.camera.updateProjectionMatrix();
    });
    obs.observe(this);
  }

  _loadSkin() {
    new THREE.TextureLoader().load("mncs-mascot.png", texture => {
      this.layers.addLayer(texture);
      this.layers.renderTexture();
    });

    new THREE.TextureLoader().load("overlay.png", texture => {
      this.layers.addLayer(texture);
      this.layers.renderTexture();
    });
  }

  _setupMesh(texture) {
    this.model = new SkinModel(texture);

    this.skinMesh = this.model.mesh;
    this.baseGroup = new THREE.Group();
    this.baseGroup.add(this.skinMesh);
    this.scene.add(this.baseGroup);
  }

  _startRender() {
    this.camera.position.z = 5;
    this.zoom(0.75);

    this.centerModel();

    this.renderer.setAnimationLoop(() => {
      this.sceneRender();
    });
  }
}

customElements.define("ncrs-editor", Editor);

export {Editor, IMAGE_WIDTH, IMAGE_HEIGHT}