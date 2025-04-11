import Color from "color";
import BrushBaseTool from "../brush_tool";

class SculptTool extends BrushBaseTool {
  constructor(config) {
    super(config, {
      id: "sculpt",
      icon: "sculpt",
      name: "Sculpt [Shift+S]",
      description: "Copy pixels from base layer to overlay.",
      providesColor: false, // Whether or not drawing with this tool adds to recent colors.
    });
  }

  down(toolData) {
    const texture = toolData.texture;
    const part = toolData.parts[0];
    const point = toolData.getCoords();

    this.cursor = point;

    if (point.x >= 32 && point.x <= 64 && point.y >= 0 && point.y <= 15 && toolData.button==1 && texture.getPixel({ x: point.x, y: point.y }).valpha==0) {
      // Head
      this.draw(texture, part, point, toolData.texture.getPixel({ x: point.x-32, y: point.y }), toolData.variant);
    }
    else if (point.x >= 0 && point.x <= 55 && point.y >= 32 && point.y <= 47 && toolData.button==1 && texture.getPixel({ x: point.x, y: point.y }).valpha==0) {
      // Right Arm, Right Leg and Torso
      this.draw(texture, part, point, toolData.texture.getPixel({ x: point.x, y: point.y-16 }), toolData.variant);
    }
    else if (point.x >= 0 && point.x <= 15 && point.y >= 48 && point.y <= 63 && toolData.button==1 && texture.getPixel({ x: point.x, y: point.y }).valpha==0) {
      // Left Leg
      this.draw(texture, part, point, toolData.texture.getPixel({ x: point.x+16, y: point.y }), toolData.variant);
    }
    else if (point.x >= 48 && point.x <= 63 && point.y >= 48 && point.y <= 63 && toolData.button==1 && texture.getPixel({ x: point.x, y: point.y }).valpha==0) {
      // Left Arm
      this.draw(texture, part, point, toolData.texture.getPixel({ x: point.x-16, y: point.y }), toolData.variant);
    }


    else if (point.x >= 32 && point.x <= 64 && point.y >= 0 && point.y <= 15 && toolData.button==2 && texture.getPixel({ x: point.x, y: point.y }).valpha!=0) {
      // Head
      this.draw(texture, part, { x: point.x-32, y: point.y }, toolData.texture.getPixel(point), toolData.variant);
      this.draw(texture, part, point, new Color(0).alpha(0), toolData.variant);
    }
    else if (point.x >= 0 && point.x <= 55 && point.y >= 32 && point.y <= 47 && toolData.button==2 && texture.getPixel({ x: point.x, y: point.y }).valpha!=0) {
      // Right Arm, Right Leg and Torso
      this.draw(texture, part, { x: point.x, y: point.y-16 }, toolData.texture.getPixel(point), toolData.variant);
      this.draw(texture, part, point, new Color(0).alpha(0), toolData.variant);
    }
    else if (point.x >= 0 && point.x <= 15 && point.y >= 48 && point.y <= 63 && toolData.button==2 && texture.getPixel({ x: point.x, y: point.y }).valpha!=0) {
      // Left Leg
      this.draw(texture, part, { x: point.x+16, y: point.y }, toolData.texture.getPixel(point), toolData.variant);
      this.draw(texture, part, point, new Color(0).alpha(0), toolData.variant);
    }
    else if (point.x >= 48 && point.x <= 63 && point.y >= 48 && point.y <= 63 && toolData.button==2 && texture.getPixel({ x: point.x, y: point.y }).valpha!=0) {
      // Left Arm
      this.draw(texture, part, { x: point.x-16, y: point.y }, toolData.texture.getPixel(point), toolData.variant);
      this.draw(texture, part, point, new Color(0).alpha(0), toolData.variant);
    }

    return texture.toTexture();
  }

  move(toolData) {
    const texture = toolData.texture;
    const part = toolData.parts[0];
    const point = toolData.getCoords();

    if (point.x >= 32 && point.x <= 64 && point.y >= 0 && point.y <= 15 && toolData.button==1 && texture.getPixel({ x: point.x, y: point.y }).valpha==0) {
      // Head
      this.draw(texture, part, point, toolData.texture.getPixel({ x: point.x-32, y: point.y }), toolData.variant);
    }
    else if (point.x >= 0 && point.x <= 55 && point.y >= 32 && point.y <= 47 && toolData.button==1 && texture.getPixel({ x: point.x, y: point.y }).valpha==0) {
      // Right Arm, Right Leg and Torso
      this.draw(texture, part, point, toolData.texture.getPixel({ x: point.x, y: point.y-16 }), toolData.variant);
    }
    else if (point.x >= 0 && point.x <= 15 && point.y >= 48 && point.y <= 63 && toolData.button==1 && texture.getPixel({ x: point.x, y: point.y }).valpha==0) {
      // Left Leg
      this.draw(texture, part, point, toolData.texture.getPixel({ x: point.x+16, y: point.y }), toolData.variant);
    }
    else if (point.x >= 48 && point.x <= 63 && point.y >= 48 && point.y <= 63 && toolData.button==1 && texture.getPixel({ x: point.x, y: point.y }).valpha==0) {
      // Left Arm
      this.draw(texture, part, point, toolData.texture.getPixel({ x: point.x-16, y: point.y }), toolData.variant);
    }


    else if (point.x >= 32 && point.x <= 64 && point.y >= 0 && point.y <= 15 && toolData.button==2 && texture.getPixel({ x: point.x, y: point.y }).valpha!=0) {
      // Head
      this.draw(texture, part, { x: point.x-32, y: point.y }, toolData.texture.getPixel(point), toolData.variant);
      this.draw(texture, part, point, new Color(0).alpha(0), toolData.variant);
    }
    else if (point.x >= 0 && point.x <= 55 && point.y >= 32 && point.y <= 47 && toolData.button==2 && texture.getPixel({ x: point.x, y: point.y }).valpha!=0) {
      // Right Arm, Right Leg and Torso
      this.draw(texture, part, { x: point.x, y: point.y-16 }, toolData.texture.getPixel(point), toolData.variant);
      this.draw(texture, part, point, new Color(0).alpha(0), toolData.variant);
    }
    else if (point.x >= 0 && point.x <= 15 && point.y >= 48 && point.y <= 63 && toolData.button==2 && texture.getPixel({ x: point.x, y: point.y }).valpha!=0) {
      // Left Leg
      this.draw(texture, part, { x: point.x+16, y: point.y }, toolData.texture.getPixel(point), toolData.variant);
      this.draw(texture, part, point, new Color(0).alpha(0), toolData.variant);
    }
    else if (point.x >= 48 && point.x <= 63 && point.y >= 48 && point.y <= 63 && toolData.button==2 && texture.getPixel({ x: point.x, y: point.y }).valpha!=0) {
      // Left Arm
      this.draw(texture, part, { x: point.x-16, y: point.y }, toolData.texture.getPixel(point), toolData.variant);
      this.draw(texture, part, point, new Color(0).alpha(0), toolData.variant);
    }
    
    return texture.toTexture();
  }

  up() {}
}

export default SculptTool;
