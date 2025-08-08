// Custom implementation of the GridHelper made for custom width and height/ divisions x and y
import * as THREE from "three";

const DEFAULT_GRID_COLOR = new THREE.Color("#575757");

// Grid Wireframe Shader adapted from https://github.com/flytaly/webgl-wireframes-vite

function addBarycentricCoordinates(geometry) {
  let bufferGeometry;
  if (geometry.index) {
    bufferGeometry = geometry.toNonIndexed();
  } else {
    bufferGeometry = geometry;
  }

  const attrib = bufferGeometry.getIndex() || bufferGeometry.getAttribute('position');
  const count = attrib.count / 3;
  const barycentric = [];

  // for each triangle in the geometry, add the barycentric coordinates
  for (let i = 0; i < count; i++) {
    const even = i % 2 === 0;
    if (even) {
      barycentric.push(0, 0, 1, 0, 1, 0, 1, 0, 1);
    } else {
      barycentric.push(0, 1, 0, 0, 0, 1, 1, 0, 1);
    }
  }

  // add the attribute to the geometry
  const array = new Float32Array(barycentric);
  const attribute = new THREE.BufferAttribute(array, 3);
  bufferGeometry.setAttribute('barycentric', attribute);

  return bufferGeometry;
}

function createShaderMaterial(color = DEFAULT_GRID_COLOR) {
  return new THREE.ShaderMaterial({
    extensions: {
      derivatives: true,
    },
    uniforms: {
      stroke: { value: color },
      thickness: { value: 0.01 },
    },
    transparent: true,
    alphaTest: 1e-5,
    side: THREE.FrontSide,
    depthWrite: false,
    vertexShader: `
      attribute vec3 barycentric;
      attribute float even;

      varying vec3 vBarycentric;

      varying vec3 vPosition;

      varying float distToCamera;

      void main() {
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position.xyz, 1.0);
        vBarycentric = barycentric;
        vPosition = position.xyz;

        vec4 cs_position = modelViewMatrix * vec4(position.xyz, 1.0);
        distToCamera = -cs_position.z;
      }
    `,
    fragmentShader: `
      varying vec3 vBarycentric;
      varying vec3 vPosition;
      varying float distToCamera;

      uniform vec3 stroke;
      uniform float thickness;

      // This is like
      float aastep(float threshold, float dist) {
        float afwidth = fwidth(dist) * 0.8;
        return smoothstep(threshold - afwidth, threshold + afwidth, dist);
      }

      // This function returns the fragment color for our styled wireframe effect
      // based on the barycentric coordinates for this fragment
      vec4 getStyledWireframe(vec3 barycentric) {
        // this will be our signed distance for the wireframe edge
        float d = min(min(barycentric.x, barycentric.y), barycentric.z);

        // the thickness of the stroke
        float computedThickness = thickness * distToCamera;

        // compute the anti-aliased stroke edge
        float edge = 1.0 - aastep(computedThickness, d);

        // now compute the final color of the mesh
        vec4 outColor = vec4(0.0);
        outColor = vec4(stroke, edge);

        return outColor;
      }

      void main() {
        gl_FragColor = getStyledWireframe(vBarycentric);
      }
    `,
  })
}

export {addBarycentricCoordinates, createShaderMaterial}

function createSkinGridBox(width, height, depth, segWidth, segHeight, segDepth, color) {
  const geometry = addBarycentricCoordinates(new THREE.BoxGeometry(width, height, depth, segWidth, segHeight, segDepth));
  const material = createShaderMaterial(color);

  return new THREE.Mesh(geometry, material);
}

export { createSkinGridBox };
