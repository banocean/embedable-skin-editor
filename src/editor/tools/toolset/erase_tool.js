import Color from "color";
import { BaseTool } from "../base_tool";
import { getMirroredCoords } from "../../layers/texture_utils";

const TRANSPARENT = new Color(0).alpha(0);

class EraseTool extends BaseTool {
  constructor(config) {
    super(
      config,
      {
        id: "eraser",
        icon: "eraser",
        name: "Erase [E]",
        description: "Simple tool for erasing.",
        providesColor: false, // Whether or not drawing with this tool adds to recent colors.
      }
    );
  }

  canvas;
  cursor = { x: 0, y: 0 };
  lastPart;
  lastFace;

  down(toolData) {
    this.canvas = toolData.texture;

    const part = toolData.parts[0];

    this.cursor = toolData.getCoords();
    this.draw(part, toolData.getCoords(), TRANSPARENT, toolData.variant);

    return this.canvas.toTexture();
  }

  move(toolData) {
    const part = toolData.parts[0];

    this.draw(part, toolData.getCoords(), TRANSPARENT, toolData.variant);

    return this.canvas.toTexture();
  }

  up() {
    return this.canvas.toTexture();
  }

  draw(part, point, color, variant) {
    if (part.object.id != this.lastPart || part.faceIndex != this.lastFace) {
      this.cursor = point;
    }

    this.lastPart = part.object.id;
    this.lastFace = part.faceIndex;

    this.canvas.putLine(color, this.cursor.x, this.cursor.y, point.x, point.y);

    if (this.config.get("mirror", false)) {
      this.cursor = this.cursor || point;

      const mirroredCursor = getMirroredCoords(variant, this.cursor);
      const mirroredPoint = getMirroredCoords(variant, point);

      this.canvas.putLine(color, mirroredCursor.x, mirroredCursor.y, mirroredPoint.x, mirroredPoint.y);
    }

    this.cursor = point;
  }
}

export default EraseTool;
