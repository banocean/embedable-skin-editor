import { BaseTool } from "../base_tool";

class PenTool extends BaseTool {
  constructor(config) {
    super(config);
  }

  intermediateCanvas;

  down(texture, x, y) {
    this.intermediateCanvas = this.tempCanvas();
    const ctx = this.intermediateCanvas.getContext("2d")
    ctx.drawImage(texture.image, 0, 0);

    this.draw(x, y);

    return this.canvasToTexture(this.intermediateCanvas);
  }

  move(x, y) {
    this.draw(x, y);

    return this.canvasToTexture(this.intermediateCanvas);
  }

  up() {
    return this.canvasToTexture(this.intermediateCanvas);
  }

  draw(x, y) {
    const ctx = this.intermediateCanvas.getContext("2d")
    ctx.fillStyle = this.config.color;
    ctx.fillRect(x, y, 1, 1)
  }
}

export default PenTool;