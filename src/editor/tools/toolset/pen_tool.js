import { BaseTool } from "../base_tool";

class PenTool extends BaseTool {
  constructor(config) {
    super(config);
  }

  canvas;
  cursor = {x: 0, y: 0};
  lastPart;
  lastFace;

  down(texture, part, x, y, pointerButton) {
    this.cursor = {x, y};
    this.canvas = this.tempCanvas();
    this.canvas.drawImage(texture.image, 0, 0);

    this.draw(part, x, y, pointerButton == 1 ? this.config.color : {r: 0, g: 0, b: 0, a: 0})
    
    return this.canvas.toTexture();
  }

  move(part, x, y, pointerButton) {
    this.draw(part, x, y, pointerButton == 1 ? this.config.color : {r: 0, g: 0, b: 0, a: 0})

    return this.canvas.toTexture();
  }

  up() {
    return this.canvas.toTexture();
  }

  draw(part, x, y, color) {
    if (part.object.id != this.lastPart || part.faceIndex != this.lastFace) {
      this.cursor = {x, y};
    }

    this.lastPart = part.object.id;
    this.lastFace = part.faceIndex;

    this.canvas.putLine(color, this.cursor.x, this.cursor.y, x, y);

    this.cursor = {x, y};
  }
}

export default PenTool;