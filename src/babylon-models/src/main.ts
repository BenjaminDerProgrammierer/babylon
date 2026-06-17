import './style.css'
import { Engine, Scene, Vector3, ArcRotateCamera, HemisphericLight } from '@babylonjs/core';
import { ShowInspector } from "@babylonjs/inspector";
import { Pane } from 'tweakpane';

// /* --- Tweakpane Setup --- */
const PARAMS = {
  object: 'none',
};

const pane = new Pane({
  title: 'Product Placement',
});

/* @ts-ignore containerElem_ is private */
pane.containerElem_.style.right = '358px'; // Ensure the pane is not blocked by the inspector (which is 350px wide)

pane.addBinding(PARAMS, 'object', {
  options: {
    'None': 'none',
    'Watch': 'watch',
    'Stand': 'stand'
  }
}).on('change', (ev) => {
  switch (ev.value) {
    case 'none':
  }
});

/* --- Scene Setup --- */
const canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;
const engine = new Engine(canvas);

const scene = new Scene(engine);
scene.createDefaultEnvironment();

const camera = new ArcRotateCamera("camera", 0, 0, 0, Vector3.Zero(), scene);
camera.attachControl(canvas, true);
// camera.setPosition(new Vector3(0, 15, 20));

const light = new HemisphericLight("light", new Vector3(0, 1, 0.5), scene);
light.intensity = 0.5;

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
