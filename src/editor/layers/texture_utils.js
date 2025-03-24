import * as THREE from "three";
import { IMAGE_HEIGHT, IMAGE_WIDTH } from "../main";
import { getUVMap, MODEL_MAP } from "../model/uv";
import MIRROR_MAP from "./mirror_map";

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

function getPartFromCoords(variant, point) {
  const uv = MODEL_MAP[variant];

  function inBox(point, x, y, w, h) {
    // Account for negative uv width / height
    const checkX = w >= 0 ? (point.x >= x && point.x < x + w) : (point.x >= x + w && point.x < x);
    const checkY = h >= 0 ? (point.y >= y && point.y < y + h) : (point.y >= y + h && point.y < y);
    return checkX && checkY;
  }

  let part;
  Object.entries(uv).find(([key, value]) => {
    if (inBox(point, ...value)) {
      part = key;
      return true;
    }

    return false;
  })

  return part;
}

function getMirroredCoords(variant, point) {
  const pairedParts = {
    arm_left: "arm_right",
    arm_right: "arm_left",
    leg_left: "leg_right",
    leg_right: "leg_left",
  }

  const uv = MODEL_MAP[variant];
  const part = getPartFromCoords(variant, point);

  function mirrorAlternate(currentPart, newPart, point) {
    const currentUV = uv[currentPart];
    const newUV = uv[newPart];
    
    const offsetX = point.x - currentUV[0];
    const offsetY = point.y - currentUV[1];

    return new THREE.Vector2((newUV[0] + newUV[2]) - (offsetX + 1), newUV[1] + offsetY);
  }

  function mirrorSame(currentPart, point) {
    const currentUV = uv[currentPart];

    const offsetX = point.x - currentUV[0];

    return new THREE.Vector2((currentUV[0] + currentUV[2]) - (offsetX + 1), point.y);
  }

  let alternatePart = MIRROR_MAP[part];

  if (alternatePart) {
    return mirrorAlternate(part, alternatePart, point);
  } else {
    return mirrorSame(part, point);
  }
}

export {remapUV, getMirroredCoords, swapBodyOverlay, swapFrontBack}