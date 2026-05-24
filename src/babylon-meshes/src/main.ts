import './style.css'
import "@babylonjs/core/Materials/standardMaterial";
import { Texture, PBRMetallicRoughnessMaterial, StandardMaterial, Color3, Engine, Scene, Vector3, ArcRotateCamera, HemisphericLight, TransformNode, CreateBox, CreateCylinder, CreateSphere } from '@babylonjs/core';
import { ShowInspector } from "@babylonjs/inspector";

/* --- Scene Setup --- */
const canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;
const engine = new Engine(canvas);

const scene = new Scene(engine);
// scene.clearColor = new Color4(0.25, 0.75, 0.9, 1);

const environment = scene.createDefaultEnvironment();

const camera = new ArcRotateCamera("camera", 0, 0, 0, Vector3.Zero(), scene);
camera.setTarget(Vector3.Zero());
camera.attachControl(canvas, true);
camera.setPosition(new Vector3(0, 15, 20));
camera.radius = 24;
camera.beta = 1.2;
camera.alpha = 2.5;

const light = new HemisphericLight("light", new Vector3(0, 1, 0.5), scene);
light.intensity = 0.5;

/* --- Materials --- */

const polishedRoseGoldMaterial = new PBRMetallicRoughnessMaterial("roseGoldMaterial", scene);
polishedRoseGoldMaterial.baseColor = new Color3(1, 0.8, 0.7);
polishedRoseGoldMaterial.metallic = 1;
polishedRoseGoldMaterial.roughness = 0;

const matteRoseGoldMaterial = new PBRMetallicRoughnessMaterial("roseGoldMaterial", scene);
matteRoseGoldMaterial.baseColor = new Color3(1, 0.8, 0.7);
matteRoseGoldMaterial.metallic = 1;
matteRoseGoldMaterial.roughness = 0.2;

const glitterRoseGoldMaterial = new StandardMaterial("glitterRoseGoldMaterial", scene);
const glitterTexture = new Texture("/textures/glitter.png", scene);
glitterTexture.uScale = 5;
glitterTexture.vScale = 5;
glitterRoseGoldMaterial.diffuseTexture = glitterTexture;

/* --- Objects --- */
const watchRoot = new TransformNode("watchRoot", scene);
watchRoot.rotation = new Vector3(0, -Math.PI / 2, -0.6);
const watchMeshes: any[] = [];

// watch face
const watchFace = CreateCylinder("watchFace", { diameter: 5, height: 0.5, tessellation: 64 }, scene);
watchFace.material = matteRoseGoldMaterial;
watchFace.parent = watchRoot;
watchMeshes.push(watchFace);

// watch face back
const watchFaceBack = CreateCylinder("watchFaceBack", { diameter: 5, height: 0.1, tessellation: 64 }, scene);
watchFaceBack.position.y = -0.3;
watchFaceBack.material = glitterRoseGoldMaterial;
watchFaceBack.parent = watchRoot;
watchMeshes.push(watchFaceBack);

// watch band segments
for (let i = 0; i < 30; i++) {
  const angle = (i / 30) * 2 * Math.PI;
  const watchBand = CreateBox(`watchBand${i}`, { width: 0.25, height: 0.5, depth: 3 }, scene);
  watchBand.position = new Vector3(Math.cos(angle) * 3, Math.sin(angle) * 3 - 3, 0);
  watchBand.rotation = new Vector3(0, 0, angle);
  watchBand.material = polishedRoseGoldMaterial;
  watchBand.parent = watchRoot;
  watchMeshes.push(watchBand);
}

// watch face center dot
const centerDot = CreateCylinder("centerDot", { diameter: 0.2, height: 0.2 }, scene);
centerDot.position.y = 0.25;
centerDot.material = polishedRoseGoldMaterial;
centerDot.parent = watchRoot;
watchMeshes.push(centerDot);

// sphere on top of center dot
const centerSphere = CreateSphere("centerSphere", { diameter: 0.2 }, scene);
centerSphere.position.y = 0.35;
centerSphere.material = polishedRoseGoldMaterial;
centerSphere.parent = watchRoot;
watchMeshes.push(centerSphere);

// hour hand
const hourHand = CreateBox("hourHand", { width: 0.15, height: 0.2, depth: 1 }, scene);
hourHand.position.y = 0.25;
hourHand.position.z = -0.5;
hourHand.setPivotPoint(new Vector3(0, 0, 0.5));
hourHand.material = polishedRoseGoldMaterial;
hourHand.parent = watchRoot;
watchMeshes.push(hourHand);

// minute hand
const minuteHand = CreateBox("minuteHand", { width: 0.1, height: 0.2, depth: 2 }, scene);
minuteHand.position.y = 0.25;
minuteHand.position.z = -1;
minuteHand.setPivotPoint(new Vector3(0, 0, 1));
minuteHand.material = polishedRoseGoldMaterial;
minuteHand.parent = watchRoot;
watchMeshes.push(minuteHand);

// second hand
const secondHand = CreateBox("secondHand", { width: 0.05, height: 0.2, depth: 2.5 }, scene);
secondHand.position.y = 0.25;
secondHand.position.z = -1.25;
secondHand.setPivotPoint(new Vector3(0, 0, 1.25));
secondHand.material = polishedRoseGoldMaterial;
secondHand.parent = watchRoot;
watchMeshes.push(secondHand);

// Move the default ground so it's below the watch (not intersecting the watch face)
if (environment) {
  const anyEnv: any = environment;
  if (anyEnv.ground) {
    // compute lowest point of the watch in world space
    let minY = Infinity;
    for (const m of watchMeshes) {
      m.computeWorldMatrix(true);
      const bbMin = m.getBoundingInfo().boundingBox.minimumWorld;
      if (bbMin.y < minY) {
        minY = bbMin.y;
      }
    }
    const margin = 0.6; // gap between watch lowest point and ground
    anyEnv.ground.position.y = minY - margin;
  }
}

// Animate watch hands
scene.registerBeforeRender(() => {
  const now = new Date();
  const hours = now.getHours() % 12;
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  const offset = Math.PI / 2; // start from 12 o'clock

  hourHand.rotation.y = (hours + minutes / 60) * (Math.PI / 6) + offset;
  minuteHand.rotation.y = (minutes + seconds / 60) * (Math.PI / 30) + offset;
  secondHand.rotation.y = seconds * (Math.PI / 30) + offset;
});

// Show the inspector
ShowInspector(scene);

// Start the render loop
engine.runRenderLoop(() => {
  scene.render();
});

// Resize support
window.addEventListener("resize", () => {
  engine.resize();
});
