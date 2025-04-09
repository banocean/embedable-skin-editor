import createPanZoom from "panzoom";
import Window from "../../../misc/window";
import { CURSOR_EYEDROPPER } from "../../../../editor/controls";
import Color from "color";

function createReferenceImage(editor, image) {
  const window = new Window();

  window.style.width = "320px";
  window.style.height = "220px";

  window.name = "Reference Image";

  const canvas = createCanvas(image);
  setupCanvasEvents(editor, canvas);

  window.setPosition(20, 20);
  window.appendChild(canvas);

  const pz = createPanZoom(canvas, {
    smoothScroll: false
  });

  setupWindowEvents(window, pz, canvas);

  return window;
}

function createCanvas(image) {
  const canvas = document.createElement("canvas");
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;

  canvas.style.imageRendering = "pixelated";

  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(image, 0, 0);

  return canvas;
}

function setupCanvasEvents(editor, canvas) {
  canvas.addEventListener("click", event => {
    if (!editor.config.get("pick-color")) { return; }

    const ctx = canvas.getContext('2d');
    const imgData = ctx.getImageData(event.offsetX, event.offsetY, 1, 1).data
    const color = new Color({r: imgData[0], g: imgData[1], b: imgData[2]}).alpha(imgData[3] / 255);

    if (editor.config.get("pick-color-toggle")) {
      editor.config.set("pick-color-toggle", false);
      editor.config.set("pick-color", false);
    }

    editor.toolConfig.set("color", color);
  });

  editor.config.addEventListener("pick-color-change", event => {
    canvas.style.cursor = event.detail ? CURSOR_EYEDROPPER : "default";
  });
}

function setupWindowEvents(window, pz, canvas) {
  window.addEventListener("ready", () => {
    const windowRect = window.getInnerBounds();

    const offsetX = (windowRect.width / 2);
    const offsetY = (windowRect.height / 2);
    const offsetZoom = windowRect.height / canvas.height;
  
    pz.moveTo(
      -(canvas.width / 2) + offsetX,
      -(canvas.height / 2) + offsetY
    );
    pz.zoomAbs(offsetX, offsetY, offsetZoom);
  })
}

export default createReferenceImage;