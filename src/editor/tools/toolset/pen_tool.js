import Color from "color";
import { BaseTool } from "../base_tool";

const TRANSPARENT_COLOR = new Color("#000000").alpha(0);

class PenTool extends BaseTool {
  constructor(config) {
    super(config, {
      id: "pen",
      icon: "brush",
      name: "Pen",
      description: "Simple tool for drawing.",
      providesColor: true, // Whether or not drawing with this tool adds to recent colors.
    });
  }

  cursor = { x: 0, y: 0 };
  lastPart;
  lastFace;

  down(toolData) {
    const texture = toolData.texture;
    const part = toolData.parts[0];
    const point = toolData.getCoords();
    const color = toolData.button == 1 ? this.config.getColor() : TRANSPARENT_COLOR;

    this.cursor = point;
    this.draw(texture, part, point, color);

    return texture.toTexture();
  }

  move(toolData) {
    const texture = toolData.texture;
    const part = toolData.parts[0];
    const point = toolData.getCoords();
    const color = toolData.button == 1 ? this.config.getColor() : TRANSPARENT_COLOR;
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
