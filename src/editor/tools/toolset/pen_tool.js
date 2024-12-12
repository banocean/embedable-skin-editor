import { BaseTool } from "../base_tool";

class PenTool extends BaseTool {
  constructor(config) {
    super(config, {
      icon: "brush",
      name: "Pen",
      description: "Simple tool for drawing.",
    });
  }

  cursor = { x: 0, y: 0 };
  lastPart;
  lastFace;

  down(toolData) {
    const texture = toolData.texture;
    const part = toolData.parts[0];
    const point = toolData.getCoords();
    const color = toolData.button == 1 ? this.config.color : { r: 0, g: 0, b: 0, a: 0 };

    this.cursor = point;
    this.draw(texture, part, point, color);

    return texture.toTexture();
  }

  move(toolData) {
    const texture = toolData.texture;
    const part = toolData.parts[0];
    const point = toolData.getCoords();
    const color = toolData.button == 1 ? this.config.color : { r: 0, g: 0, b: 0, a: 0 };
    this.draw(texture, part, point, color);

    return texture.toTexture();
  }

  up() {}

  draw(texture, part, point, color) {
    if (part.object.id != this.lastPart || !part.normal.equals(this.lastFace)) {
      this.cursor = point;
    }

    this.lastPart = part.object.id;
    this.lastFace = part.normal;

    texture.putLine(color, this.cursor.x, this.cursor.y, point.x, point.y);

    this.cursor = point;
  }
}

export default PenTool;
