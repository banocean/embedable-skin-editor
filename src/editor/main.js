import { LitElement, css, html } from "lit";
import * as THREE from "three";
import { Controls } from "./controls";
import { Layers } from "./layers";
import { SkinModel } from "./model/model";
import { Renderer } from "./renderer";
import Stats from "stats.js";
import { HistoryManager } from "./history/history_manager";
import AddLayerEntry from "./history/entries/add_layer_entry";
import ToolConfig from "./tools/tool_config";
import PenTool from "./tools/toolset/pen_tool";
import UpdateLayerTexture from "./history/entries/update_layer_texture";

const IMAGE_WIDTH = 64;
const IMAGE_HEIGHT = 64;

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
    this.renderer = new Renderer(this.scene, this.camera);
    this.controls = new Controls(this);
    this.layers = new Layers(IMAGE_WIDTH, IMAGE_HEIGHT);
    this.history = new HistoryManager;
    this.stats = new Stats();
    this.config = new ToolConfig;
    this.currentTool = new PenTool(this.config);
    this._loadSkin();
    this._setupMesh(this.layers.texture);
    this._startRender();
    this._setupResizeObserver();
  }

  skinMesh;
  baseGroup;
  model;

  render() {
    this.stats.showPanel(0);
    document.body.appendChild(this.stats.dom);

    this.camera.layers.enable(1);
    this.camera.layers.enable(2);

    return this.renderer.canvas();
  }

  sceneRender() {
    this.stats.begin();
    this.renderer.render();
    this.stats.end();
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

  toolDown(part, pixel) {
    const layer = this.layers.getSelectedLayer();
    const texture = this.currentTool.down(layer.texture, part, pixel.x, pixel.y);
    
    layer.flush();
    layer.replaceTexture(texture);
    this.layers.renderTexture();
  }

  toolMove(part, pixel) {
    const texture = this.currentTool.move(part, pixel.x, pixel.y);
    
    this.layers.getSelectedLayer().replaceTexture(texture);
    this.layers.renderTexture();
  }

  toolUp() {
    const texture = this.currentTool.up();
    const layer = this.layers.getSelectedLayer();

    this.history.add(new UpdateLayerTexture(this.layers, layer, texture))
  }

  zoom(zoom) {
    this.camera.zoom = zoom;
    this.camera.updateProjectionMatrix();
  }

  setOverlaysVisible(visible) {
    this.model.parts.forEach((part) => {
      part.setOverlayVisible(visible);
    });
  }

  setBasesVisible(visible) {
    this.model.parts.forEach((part) => {
      part.setBaseVisible(visible);
    });
  }

  setPartVisible(name, visible) {
    this.model.parts.forEach((part) => {
      if (part.name() == name) {
        part.setVisible(visible);
      }
    });
  }

  _setupResizeObserver() {
    const obs = new ResizeObserver((e) => {
      const target = e[0].target;
      this.renderer.updateSize(target.clientWidth, target.clientHeight);

      this.camera.aspect = target.clientWidth / target.clientHeight;
      this.camera.updateProjectionMatrix();
    });
    obs.observe(this);
  }

  _loadSkin() {
    new THREE.TextureLoader().load("mncs-mascot.png", (texture) => {
      new AddLayerEntry(this.layers, {texture}).perform();
    });

    // new THREE.TextureLoader().load("overlay.png", (texture) => {
    //   this.history.add(new AddLayerEntry(this.layers, {texture}));
    // });
  }

  _setupMesh(texture) {
    this.model = new SkinModel(texture);

    this.skinMesh = this.model.mesh;
    this.baseGroup = new THREE.Group();
    this.baseGroup.add(this.skinMesh);
    this.scene.add(this.baseGroup);
  }

  _startRender() {
    this.camera.position.z = 3;
    this.zoom(0.75);

    this.centerModel();

    this.renderer.setAnimationLoop(() => {
      this.sceneRender();
    });
  }
}

customElements.define("ncrs-editor", Editor);

export { Editor, IMAGE_WIDTH, IMAGE_HEIGHT };
