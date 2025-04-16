import { css, LitElement } from "lit";
import { MODEL_MAP } from "../../editor/model/uv";
import { SkinModel } from "../../editor/model/model";

const LAYOUT = {
  classic: [
    {uv: ['head_base_front', 'head_overlay_front'], coordinates: [4, 0]},
    {uv: ['head_base_back', 'head_overlay_back'], coordinates: [24, 0]},
    {uv: ['torso_base_front', 'torso_overlay_front'], coordinates: [4, 8]},
    {uv: ['torso_base_back', 'torso_overlay_back'], coordinates: [24, 8]},
    {uv: ['leg_right_base_front', 'leg_right_overlay_front'], coordinates: [4, 20]},
    {uv: ['leg_right_base_back', 'leg_right_overlay_back'], coordinates: [28, 20]},
    {uv: ['leg_left_base_front', 'leg_left_overlay_front'], coordinates: [8, 20]},
    {uv: ['leg_left_base_back', 'leg_left_overlay_back'], coordinates: [24, 20]},
    {uv: ['arm_right_base_front', 'arm_right_overlay_front'], coordinates: [0, 8]},
    {uv: ['arm_right_base_back', 'arm_right_overlay_back'], coordinates: [32, 8]},
    {uv: ['arm_left_base_front', 'arm_left_overlay_front'], coordinates: [12, 8]},
    {uv: ['arm_left_base_back', 'arm_left_overlay_back'], coordinates: [20, 8]}
  ],
  slim: [
    {uv: ['head_base_front', 'head_overlay_front'], coordinates: [4, 0]},
    {uv: ['head_base_back', 'head_overlay_back'], coordinates: [24, 0]},
    {uv: ['torso_base_front', 'torso_overlay_front'], coordinates: [4, 8]},
    {uv: ['torso_base_back', 'torso_overlay_back'], coordinates: [24, 8]},
    {uv: ['leg_right_base_front', 'leg_right_overlay_front'], coordinates: [4, 20]},
    {uv: ['leg_right_base_back', 'leg_right_overlay_back'], coordinates: [28, 20]},
    {uv: ['leg_left_base_front', 'leg_left_overlay_front'], coordinates: [8, 20]},
    {uv: ['leg_left_base_back', 'leg_left_overlay_back'], coordinates: [24, 20]},
    {uv: ["arm_right_base_front", "arm_right_overlay_front"], coordinates: [1, 8]},
    {uv: ["arm_right_base_back", "arm_right_overlay_back"], coordinates: [32, 8]},
    {uv: ["arm_left_base_front", "arm_left_overlay_front"], coordinates: [12, 8]},
    {uv: ["arm_left_base_back", "arm_left_overlay_back"], coordinates: [21, 8]}
  ]
}

class Skin2d extends LitElement {
  static properties = {
    src: {},
    variant: {reflect: true},
  }

  static styles = css`
    :host {
      display: block;
    }

    canvas {
      image-rendering: pixelated;
      width: 100%;
      height: auto;
    }
  `;

  constructor() {
    super();
    
    this.canvas = document.createElement("canvas");
    this.canvas.width = 36;
    this.canvas.height = 32;

    this.variant = this.variant || "classic";
  }

  render() {
    if (!SkinModel.isValidVariant(this.variant)) {
      this.variant = "classic";
    }

    if (this.src) {
      this._drawFromSrc(this.src, this.variant);
    }

    return this.canvas;
  }

  drawImage(image, variant = this.variant) {
    if (!SkinModel.isValidVariant(variant)) {
      throw "Invalid variant!";
    }

    const ctx = this.canvas.getContext('2d');
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  
    const uvmap = MODEL_MAP[variant];
    const layout = LAYOUT[variant];
  
    layout.forEach(segment => {
      segment.uv.forEach(area => {
        const from = uvmap[area];
        const to = segment.coordinates;
        ctx.drawImage(image, ...from, ...to, from[2], from[3])
      })
    })
  
    return this.canvas;
  }

  _drawFromSrc(src, variant) {
    const img = new Image();

    img.onload = () => {
      this.drawImage(img, variant);
    }

    img.src = src;
  }
}

customElements.define("ncrs-skin-2d", Skin2d);

export default Skin2d;