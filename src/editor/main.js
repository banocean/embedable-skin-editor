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
import ToolData from "./tools/tool_data";
import EraseTool from "./tools/toolset/erase_tool";
import SelectLayerEntry from "./history/entries/select_layer_entry";
import GroupedEntry from "./history/entries/grouped_entry";
import DeleteLayerEntry from "./history/entries/delete_layer_entry";
import ReorderLayersEntry from "./history/entries/reorder_layers_entry";

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
    this.camera = new THREE.PerspectiveCamera(75, this.clientWidth / this.clientHeight, 0.1, 1000);
    this.renderer = new Renderer(this.scene, this.camera);
    this.controls = new Controls(this);
    this.layers = new Layers(IMAGE_WIDTH, IMAGE_HEIGHT);
    this.history = new HistoryManager();
    this.stats = new Stats();
    this.config = new ToolConfig();
    this.tools = this._setupTools();
    this.currentTool = this.tools[0];
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

  firstUpdated() {
    this.layers.selectLayer(0);
  }

  sceneRender() {
    this.stats.begin();
    this.renderer.render();
    this.stats.end();
    this.style.cursor = this.controls.getCursorStyle();

    this.dispatchEvent(new CustomEvent("render"));
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

  toolDown(parts, pointerButton) {
    const toolData = this._createToolData(parts, pointerButton);
    const texture = this.currentTool.down(toolData);

    const layer = this.layers.getSelectedLayer();
    layer.flush();
    layer.replaceTexture(texture);
    this.layers.renderTexture();
  }

  toolMove(parts, pointerButton) {
    const toolData = this._createToolData(parts, pointerButton);
    const texture = this.currentTool.move(toolData);

    this.layers.getSelectedLayer().replaceTexture(texture);
    this.layers.renderTexture();
  }

  toolUp() {
    this.currentTool.up();
    const layer = this.layers.getSelectedLayer();

    this.history.add(new UpdateLayerTexture(this.layers, layer, layer.texture));
  }

  zoom(zoom) {
    this.camera.zoom = zoom;
    this.camera.updateProjectionMatrix();
  }

  setPartVisible(name, visible) {
    this.model.parts.forEach((part) => {
      if (part.name() == name) {
        part.setVisible(visible);
      }
    });
  }

  baseVisible = true;
  overlayVisible = true;
  gridVisible = true;

  setBaseVisible(visible) {
    this.baseVisible = visible;
    this.updateVisibility();
  }

  setOverlayVisible(visible) {
    this.overlayVisible = visible;
    this.updateVisibility();
  }

  setGridVisible(visible) {
    this.gridVisible = visible;
    this.updateVisibility();
  }

  updateVisibility() {
    if (this.baseVisible) {
      this.camera.layers.enable(1);
    } else {
      this.camera.layers.disable(1);
    }

    if (this.overlayVisible) {
      this.camera.layers.enable(2);
    } else {
      this.camera.layers.disable(2);
    }

    this.model.baseGrid.visible = this.gridVisible && this.baseVisible && !this.overlayVisible;
    this.model.overlayGrid.visible = this.gridVisible && this.overlayVisible;
  }

  selectTool(tool) {
    if (!this.tools.includes(tool)) { return false; }

    this.currentTool = tool;
    this.dispatchEvent(new CustomEvent("select-tool", {detail: {tool: tool}}));
  }

  selectLayer(layer) {
    this.history.add(
      new SelectLayerEntry(this.layers, {layer})
    )
  }

  addLayer() {
    const layer = this.layers.createBlank();

    this.history.add(
      new GroupedEntry(
        new AddLayerEntry(this.layers, {layer}),
        new SelectLayerEntry(this.layers, {layer})
      )
    );
  }

  removeLayer() {
    const layers = this.layers;
    const layer = this.layers.getSelectedLayer();
    let entry;

    if (layers.layers.length == 1) {
      entry = new GroupedEntry(
        new DeleteLayerEntry(layers, layer),
        new AddLayerEntry(layers),
        new SelectLayerEntry(this.layers, {index: 0})
      );
    } else {
      entry = new GroupedEntry(
        new DeleteLayerEntry(layers, layer),
      );
    }

    this.history.add(entry);
  }

  reorderLayers(fromIndex, toIndex) {
    this.history.add(
      new ReorderLayersEntry(this.layers, fromIndex, toIndex)
    );
  }

  forEachLayer(callback) {
    this.layers.layers.forEach(callback);
  }

  renderLayers() {
    this.layers.renderTexture();
  }

  _createToolData(parts, button) {
    const layer = this.layers.getSelectedLayer();
    const texture = layer.texture.image;

    return new ToolData({ texture, parts, button });
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
      new GroupedEntry(
        new AddLayerEntry(this.layers, { texture }),
        new SelectLayerEntry(this.layers, {index: 0})
      ).perform()
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

  _setupTools() {
    return [
      new PenTool(this.config),
      new EraseTool(this.config),
      new PenTool(this.config),
    ]
  }
}

customElements.define("ncrs-editor", Editor);

export { Editor, IMAGE_WIDTH, IMAGE_HEIGHT };
