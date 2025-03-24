import { IMAGE_HEIGHT, IMAGE_WIDTH } from "../main";
import { getUVMap } from "../model/uv";

const MODEL_PARTS = ["arm_left", "arm_right", "head", "torso", "leg_left", "leg_right"];

function remapUV(texture, ctx, source, destination) {
  const s = source;
  const d = destination;

  ctx.clearRect(s[0], s[1], d[2], d[3]);
  ctx.drawImage(texture, d[0], d[1], s[2], s[3], s[0], s[1], d[2], d[3]);
}

function swapBodyOverlay(inputCanvas, variant = "classic") {
  const canvas = new OffscreenCanvas(IMAGE_WIDTH, IMAGE_HEIGHT);
  const ctx = canvas.getContext("2d");

  function swapUV(source, destination) {
    Object.keys(source).forEach(key => {
      remapUV(inputCanvas, ctx, source[key], destination[key])
    });
  }

  MODEL_PARTS.forEach(part => {
    const base = getUVMap(variant, part + "_base");
    const overlay = getUVMap(variant, part + "_overlay");

    swapUV(base, overlay);
    swapUV(overlay, base);
  })

  return canvas;
}

function swapFrontBack(inputCanvas, variant = "classic") {
  const canvas = new OffscreenCanvas(IMAGE_WIDTH, IMAGE_HEIGHT);
  const ctx = canvas.getContext("2d");

  ctx.drawImage(inputCanvas, 0, 0);

  const partPairs = [["arm_left", "arm_right"], ["head", "head"], ["torso", "torso"], ["leg_left", "leg_right"]];

  function flipUV(source, destination) {
    const pairs = [["front", "back"], ["left", "right"]];

    pairs.forEach(pair => {
      const faceA = source[pair[0]];
      const faceB = destination[pair[1]];

      const faceC = source[pair[1]];
      const faceD = destination[pair[0]];

      remapUV(inputCanvas, ctx, faceA, faceB);
      remapUV(inputCanvas, ctx, faceB, faceA);

      remapUV(inputCanvas, ctx, faceC, faceD);
      remapUV(inputCanvas, ctx, faceD, faceC);
    });
  }

  partPairs.forEach(pair => {
    const baseA = getUVMap(variant, pair[0] + "_base");
    const overlayA = getUVMap(variant, pair[0] + "_overlay");

    const baseB = getUVMap(variant, pair[1] + "_base");
    const overlayB = getUVMap(variant, pair[1] + "_overlay");

    flipUV(baseA, baseB);
    flipUV(overlayA, overlayB);
  })

  return canvas;
}

export {remapUV, swapBodyOverlay, swapFrontBack}