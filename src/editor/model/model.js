import * as THREE from "three";
import { HeadPart } from "./parts/head";
import { TorsoPart } from "./parts/torso";
import { LeftLegPart } from "./parts/leg_left";
import { RightLegPart } from "./parts/leg_right";
import { RightArmPart } from "./parts/arm_right";
import { LeftArmPart } from "./parts/arm_left";

class SkinModel {
  constructor(texture) {
    this._setupMesh(texture);
    this.mesh = new THREE.Group();
    this.mesh.add(this.baseMesh);
    this.mesh.add(this.baseGrid);
    this.mesh.add(this.overlayMesh);
    this.mesh.add(this.overlayGrid);
  }
  
  parts = [];
  baseMesh;
  baseGrid;
  overlayMesh;
  overlayGrid;
  mesh;

  _setupMesh(texture) {
    const scope = this;
    this.baseMesh = new THREE.Group();
    this.baseGrid = new THREE.Group();

    this.overlayMesh = new THREE.Group();
    this.overlayGrid = new THREE.Group();

    function addPart(part) {
      scope.baseMesh.add(part.baseMesh);
      scope.baseGrid.add(...part.baseGrid.grids);
      scope.overlayMesh.add(part.overlayMesh);
      scope.overlayGrid.add(...part.overlayGrid.grids);
      scope.parts.push(part);
    }

    const head = new HeadPart(texture);
    const torso = new TorsoPart(texture);
    const leftLeg = new LeftLegPart(texture);
    const rightLeg = new RightLegPart(texture);
    const leftArm = new LeftArmPart(texture);
    const rightArm = new RightArmPart(texture);

    addPart(head);
    addPart(torso);
    addPart(leftLeg);
    addPart(rightLeg);
    addPart(leftArm);
    addPart(rightArm);
  }
}

export { SkinModel };
