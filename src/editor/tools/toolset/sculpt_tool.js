import { BaseTool } from "../base_tool";

class SculptTool extends BaseTool {
  constructor(config) {
    super(config, {
      icon: "sculpt",
      name: "Sculpt",
      description: "Copy pixels from base layer to overlay."
    });
  }

  cursor = { x: 0, y: 0 };
  lastPart;
  lastFace;

  down(toolData) {
    const texture = toolData.texture;
    const part = toolData.parts[0];
    const point = toolData.getCoords();

    if (point.x >= 32 && point.x <= 64 && point.y >= 0 && point.y <= 15 && toolData.button==1) {
      // Head
      this.draw(texture, part, point, toolData.texture.getPixel({ x: point.x-32, y: point.y }));
    }
    else if (point.x >= 0 && point.x <= 55 && point.y >= 32 && point.y <= 47 && toolData.button==1) {
      // Right Arm, Right Leg and Torso
      this.draw(texture, part, point, toolData.texture.getPixel({ x: point.x, y: point.y-16 }));
    }
    else if (point.x >= 0 && point.x <= 15 && point.y >= 48 && point.y <= 63 && toolData.button==1) {
      // Left Leg
      this.draw(texture, part, point, toolData.texture.getPixel({ x: point.x+16, y: point.y }));
    }
    else if (point.x >= 48 && point.x <= 63 && point.y >= 48 && point.y <= 63 && toolData.button==1) {
      // Left Arm
      this.draw(texture, part, point, toolData.texture.getPixel({ x: point.x-16, y: point.y }));
    }

    else if (toolData.button==2){
      this.draw(texture, part, point, { r: 0, g: 0, b: 0, a: 0 });
    }

    return texture.toTexture();
  }

  move(toolData) {
    const texture = toolData.texture;
    const part = toolData.parts[0];
    const point = toolData.getCoords();

    if (point.x >= 32 && point.x <= 64 && point.y >= 0 && point.y <= 15 && toolData.button==1) {
      // Head
      this.draw(texture, part, point, toolData.texture.getPixel({ x: point.x-32, y: point.y }));
    }
    else if (point.x >= 0 && point.x <= 55 && point.y >= 32 && point.y <= 47 && toolData.button==1) {
      // Right Arm, Right Leg and Torso
      this.draw(texture, part, point, toolData.texture.getPixel({ x: point.x, y: point.y-16 }));
    }
    else if (point.x >= 0 && point.x <= 15 && point.y >= 48 && point.y <= 63 && toolData.button==1) {
      // Left Leg
      this.draw(texture, part, point, toolData.texture.getPixel({ x: point.x+16, y: point.y }));
    }
    else if (point.x >= 48 && point.x <= 63 && point.y >= 48 && point.y <= 63 && toolData.button==1) {
      // Left Arm
      this.draw(texture, part, point, toolData.texture.getPixel({ x: point.x-16, y: point.y }));
    }

    else if (toolData.button==2){
      this.draw(texture, part, point, { r: 0, g: 0, b: 0, a: 0 });
    }
    
    return texture.toTexture();
  }

  up() {}

  draw(texture, part, point, color) {
    if (part.object.id != this.lastPart || part.faceIndex != this.lastFace) {
      this.cursor = point;
    }

    this.lastPart = part.object.id;
    this.lastFace = part.faceIndex;

    texture.putPixel(point, color);

    this.cursor = point;
  }
}

export default SculptTool;
