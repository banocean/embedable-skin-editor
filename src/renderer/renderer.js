import * as THREE from "three";
import { EffectComposer, FXAAShader, OutputPass, RenderPass, ShaderPass } from "three/examples/jsm/Addons.js";

class Renderer {
  constructor(scene, camera) {
    this.scene = scene;
    this.camera = camera;

    this._setupRenderer();
    this._setupComposer();
  }

  renderer;
  composer;
  fxaaPass;

  canvas() {
    return this.renderer.domElement;
  }

  render() {
    this.composer.render();
  }

  updateSize(width, height) {
    this.renderer.setSize(width, height);
    this.composer.setSize(width, height);

    const pixelRatio = this.renderer.getPixelRatio;
    const uniforms = this.fxaaPass.material.uniforms;
    uniforms['resolution'].value.x = 1 / (width * pixelRatio);
    uniforms['resolution'].value.y = 1 / (height * pixelRatio);
  }

  setAnimationLoop(fn) {
    this.renderer.setAnimationLoop(fn);
  }

  _setupRenderer() {
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setPixelRatio(1.5);
    renderer.domElement.style.position = "absolute";
    renderer.sortObjects = false;

    this.renderer = renderer;
  }

  _setupComposer() {
    const composer = new EffectComposer(this.renderer);
    const renderPass = new RenderPass(this.scene, this.camera);
    const fxaaPass = new ShaderPass(FXAAShader);
    const outputPass = new OutputPass();

    composer.addPass(renderPass);
    composer.addPass(outputPass);
    // composer.addPass(fxaaPass);

    this.composer = composer;
    this.fxaaPass = fxaaPass;
  }
}

export {Renderer}