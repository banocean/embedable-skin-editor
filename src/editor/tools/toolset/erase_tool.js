import { BaseTool } from "../base_tool";

class EraseTool extends BaseTool {
  constructor(config) {
    super(config);
  }

  canvas;
  cursor = { x: 0, y: 0 };
  lastPart;
  lastFace;

  down(toolData) {
    this.canvas = toolData.texture;

    const part = toolData.parts[0];

    this.cursor = point;

    this.draw(part, toolData.getCoords(), { r: 0, g: 0, b: 0, a: 0 });

    return this.canvas.toTexture();
  }

  move(toolData) {
    const part = toolData.parts[0];

    this.draw(part, toolData.getCoords(), { r: 0, g: 0, b: 0, a: 0 });

    return this.canvas.toTexture();
  }

  up() {
    return this.canvas.toTexture();
  }

  draw(part, point, color) {
    if (part.object.id != this.lastPart || part.faceIndex != this.lastFace) {
      this.cursor = point;
    }

    this.lastPart = part.object.id;
    this.lastFace = part.faceIndex;

    this.canvas.putLine(color, this.cursor.x, this.cursor.y, point.x, point.y);

    this.cursor = point;
  }
}

export default EraseTool;
