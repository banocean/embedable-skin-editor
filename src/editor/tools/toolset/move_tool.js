import { BaseTool } from "../base_tool";

class MoveTool extends BaseTool {
  constructor(config) {
    super(config, {
      id: "move",
      icon: "move",
      name: "Move Tool",
      description: "",
      providesColor: false, // Whether or not drawing with this tool adds to recent colors.
    });
  }
}

export default MoveTool;