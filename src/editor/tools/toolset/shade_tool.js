import { BaseTool } from "../base_tool";

class ShadeTool extends BaseTool {
  constructor(config) {
    super(config, {
      id: "shade",
      icon: "shading",
      name: "Shade [S]",
      description: "Makes pixels lighter/darker or adjusts their color based on the palette.",
      providesColor: false, // Whether or not drawing with this tool adds to recent colors.
    });
  }

  _visited = new Set();
  _lastPixel = "";

  down(toolData) {
    this.shade(toolData);

    return toolData.texture.toTexture();
  }

  move(toolData) {
    this.shade(toolData);

    return toolData.texture.toTexture();
  }

  up() {
    this._visited.clear();
    this._lastPixel = "";
  }

  shade(toolData) {
    const texture = toolData.texture;
    const point = toolData.getCoords();
    const color = texture.getPixel({ x: point.x, y: point.y });
    
    const force = this.config.get("force");
    const shadeOnce = this.config.get("shadeOnce", false);

    const pointStr = `${point.x}:${point.y}`;
    if (shadeOnce && this._visited.has(pointStr)) { return; }
    if (this._lastPixel === pointStr) { return; }

    color.color[0] = toolData.button == 1 ? color.color[0]-force : color.color[0]+force;
    color.color[1] = toolData.button == 1 ? color.color[1]-force : color.color[1]+force;
    color.color[2] = toolData.button == 1 ? color.color[2]-force : color.color[2]+force;

    this.draw(texture, point, color);
  }

  draw(texture, point, color) {
    texture.putPixel(point, color);

    const pointStr = `${point.x}:${point.y}`;
    this._visited.add(pointStr);
    this._lastPixel = pointStr;
  }
}

export default ShadeTool;
