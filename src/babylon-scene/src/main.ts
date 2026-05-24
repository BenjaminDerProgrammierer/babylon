import './style.css'
import { Color4, Engine, Scene, Vector3, ArcRotateCamera, HemisphericLight, CreateSphere, CreateGround } from '@babylonjs/core';

import "@babylonjs/core/Materials/standardMaterial";
import { ShowInspector } from "@babylonjs/inspector";

const canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;
const engine = new Engine(canvas);
const scene = new Scene(engine);

// This creates and positions a free camera (non-mesh)
const camera = new ArcRotateCamera("camera", 0, 0, 0, Vector3.Zero(), scene);

// This targets the camera to scene origin
camera.setTarget(Vector3.Zero());

// This attaches the camera to the canvas
camera.attachControl(canvas, true);

camera.setPosition(new Vector3(0, 15, 20));

// This creates a light, aiming 0,1,0 - to the sky (non-mesh)
const light = new HemisphericLight("light", new Vector3(0, 1, 0.5), scene);

// Default intensity is 1. Let's dim the light a small amount
light.intensity = 0.7;

// scene.clearColor = new Color4(0.25, 0.75, 0.9, 1);

// Our built-in 'sphere' shape
const sphere = CreateSphere("sphere1", { segments: 16, diameter: 2 }, scene);

// Move the sphere upward 1/2 its height
sphere.position.y = 1;

// Our built-in 'ground' shape
CreateGround("ground1", { width: 6, height: 6, subdivisions: 2 }, scene);

ShowInspector(scene);

engine.runRenderLoop(() => {
  scene.render();
});

// Resize
window.addEventListener("resize", () => {
  engine.resize();
});
