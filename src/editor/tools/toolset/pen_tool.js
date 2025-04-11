import BrushBaseTool from "../brush_tool";

class PenTool extends BrushBaseTool {
  constructor(config) {
    super(config, {
      id: "pen",
      icon: "brush",
      name: "Brush [B]",
      description: "Simple tool for drawing.",
      providesColor: true, // Whether or not drawing with this tool adds to recent colors.
    });
  }

  down(toolData) {
    const texture = toolData.texture;
    const part = toolData.parts[0];
    const point = toolData.getCoords();
    const color = toolData.button == 1 ? this._getColor : this._transparentColor;

    this.cursor = point;
    this.draw(texture, part, point, color, toolData.variant);

    return texture.toTexture();
  }

  move(toolData) {
    const texture = toolData.texture;
    const part = toolData.parts[0];
    const point = toolData.getCoords();
    const color = toolData.button == 1 ? this._getColor : this._transparentColor;
    this.draw(texture, part, point, color, toolData.variant);

    return texture.toTexture();
  }

  up() {}
}

export default PenTool;
