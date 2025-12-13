import "context-filter-polyfill";

// Polyfill for tippy.js
window.process = { env: { NODE_ENV: 'development' }};

import Editor from "./editor/main.js";
import UI from "./ui/main.js";
import ProjectLoader from "./editor/format/project_loader.js";
import { ICON_MAP } from "./ui/misc/icon.js";

export {Editor, UI, ProjectLoader, ICON_MAP};