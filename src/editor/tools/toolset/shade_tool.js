import Color from "color";
import { BaseTool } from "../base_tool";

class ShadeTool extends BaseTool {
  constructor(config) {
    super(config, {
      id: "shade",
      icon: "shading",
      name: "Shade",
      description: "Makes pixels lighter/darker or adjusts their color based on the palette.",
      providesColor: false, // Whether or not drawing with this tool adds to recent colors.
    });
  }

  cursor = { x: 0, y: 0 };
  shade_steps = 1;
  lastPart;
  lastFace;

  down(toolData) {
    const texture = toolData.texture;
    const part = toolData.parts[0];
    const point = toolData.getCoords();
    let color = toolData.texture.getPixel({ x: point.x, y: point.y });
    
    this.force = this.config.get("force");

    color.color[0] = toolData.button == 1 ? color.color[0]-this.force : color.color[0]+this.force;
    color.color[1] = toolData.button == 1 ? color.color[1]-this.force : color.color[1]+this.force;
    color.color[2] = toolData.button == 1 ? color.color[2]-this.force : color.color[2]+this.force;
    this.cursor = point;
    this.draw(texture, part, point, color);

    return texture.toTexture();
  }

  move(toolData) {
    const texture = toolData.texture;
    const part = toolData.parts[0];
    const point = toolData.getCoords();
    let color = toolData.texture.getPixel({ x: point.x, y: point.y });

    this.force = this.config.get("force");

    color.color[0] = toolData.button == 1 ? color.color[0]-this.force : color.color[0]+this.force;
    color.color[1] = toolData.button == 1 ? color.color[1]-this.force : color.color[1]+this.force;
    color.color[2] = toolData.button == 1 ? color.color[2]-this.force : color.color[2]+this.force;
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

    texture.putPixel(point,color);

    this.cursor = point;
  }
}

export default ShadeTool;
