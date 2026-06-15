import './style.css'
import "@babylonjs/core/Materials/standardMaterial";
import { Texture, PBRMetallicRoughnessMaterial, StandardMaterial, Color3, Engine, Scene, Vector3, ArcRotateCamera, HemisphericLight, TransformNode, CreateBox, CreateCylinder, CreateSphere } from '@babylonjs/core';
import { ShowInspector } from "@babylonjs/inspector";
import { Pane } from 'tweakpane';

/* --- Tweakpane Setup --- */
const PARAMS = {
  color: '#ff0055',
  size: 1,
};

const pane = new Pane({
  title: 'Rose Gold Watch',
});

let isStopped = false; // Track whether the engine is stopped or running

/* @ts-ignore containerElem_ is private */
pane.containerElem_.style.right = '358px'; // Ensure the pane is not blocked by the inspector (which is 350px wide)

pane.addBinding(PARAMS, 'color', {
  label: 'Color',
}).on('change', () => {
  // Update the custom material color when the parameter changes
  customMaterial.diffuseColor = Color3.FromHexString(PARAMS.color);
});

pane.addBinding(PARAMS, 'size', {
  label: 'Size',
  min: 0.5,
  max: 1.5,
}).on('change', () => {
  // Update the watch size when the parameter changes
  watchRoot.scaling = new Vector3(PARAMS.size, PARAMS.size, PARAMS.size);
});

const toggleButton = pane.addButton({
  title: 'Stop Animation'
}).on('click', () => {
  if (isStopped) {
    isStopped = false;
    toggleButton.title = 'Stop Animation';
  } else {
    isStopped = true;
    toggleButton.title = 'Start Animation';
  }
});

const toggleStandButton = pane.addButton({
  title: 'Show watch stand'
}).on('click', () => {
  const watchStand = scene.getNodes().find(m => m.name === 'watchStand');

  if (!watchStand) {
    console.error('Watch stand not found');
    return;
  }

  if (watchStand.isVisible) {
    watchStand.isVisible = false;
    toggleStandButton.title = 'Show watch stand';
  } else {
    watchStand.isVisible = true;
    PARAMS.size = 1; // reset size to default when showing the stand
    toggleStandButton.title = 'Hide watch stand';
  }
});



/* --- Scene Setup --- */
const canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;
const engine = new Engine(canvas);

const scene = new Scene(engine);

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

const leatherMaterial = new StandardMaterial("leatherMaterial", scene);
const leatherTexture = new Texture("/textures/leather.png", scene);
leatherTexture.uScale = 5;
leatherTexture.vScale = 5;
leatherMaterial.diffuseTexture = leatherTexture;

const woodenMaterial = new StandardMaterial("woodenMaterial", scene);
const woodTexture = new Texture("/textures/wood.jpg", scene);
woodTexture.uScale = 5;
woodTexture.vScale = 5;
woodenMaterial.diffuseTexture = woodTexture;

const customMaterial = new StandardMaterial("customMaterial", scene);
customMaterial.diffuseColor = Color3.FromHexString(PARAMS.color);

/* --- Objects --- */
const watchRoot = new TransformNode("watchRoot", scene);
watchRoot.rotation = new Vector3(0, -Math.PI / 2, -0.6);
const watchMeshes: any[] = [];

// watch face
const watchFace = CreateCylinder("watchFace", { diameter: 5, height: 0.5, tessellation: 64 }, scene);
watchFace.material = matteRoseGoldMaterial;
watchFace.parent = watchRoot;
watchMeshes.push(watchFace);

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

// time dials
for (let i = 0; i < 12; i++) {
  const angle = (i / 12) * 2 * Math.PI;
  const dial = CreateBox(`dial${i}`, { width: 0.1, height: 0.05, depth: 0.5 }, scene);
  dial.position = new Vector3(Math.cos(angle) * 2.25, 0.275, Math.sin(angle) * 2.25);
  dial.rotation = new Vector3(0, -angle + Math.PI / 2, 0);
  dial.material = polishedRoseGoldMaterial;
  dial.parent = watchRoot;
  watchMeshes.push(dial);
}

// setting wheel on the side of the watch
const settingWheel = CreateCylinder("settingWheel", { diameter: 0.1, height: 0.2, tessellation: 32 }, scene);
settingWheel.position = new Vector3(0, 0, 2.5);
settingWheel.rotation = new Vector3(Math.PI / 2, 0, 0);
settingWheel.material = customMaterial;
settingWheel.parent = watchRoot;
watchMeshes.push(settingWheel);

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

// watch stand
const watchStand = CreateBox("watchStand", { width: 5, height: 0.5, depth: 5 }, scene);
watchStand.position = new Vector3(0, -8, 0);
watchStand.material = woodenMaterial;
watchStand.isVisible = false; // start hidden
watchMeshes.push(watchStand);

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
  if (!isStopped) {
    const now = new Date();
    const hours = now.getHours() % 12;
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    const offset = Math.PI / 2; // start from 12 o'clock

    hourHand.rotation.y = (hours + minutes / 60) * (Math.PI / 6) + offset;
    minuteHand.rotation.y = (minutes + seconds / 60) * (Math.PI / 30) + offset;
    secondHand.rotation.y = seconds * (Math.PI / 30) + offset;
  }
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
