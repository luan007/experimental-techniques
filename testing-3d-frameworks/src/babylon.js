import * as BBL from "@babylonjs/core/Legacy/legacy";
import * as MATS from "@babylonjs/materials";

const canvas = document.getElementById("renderCanvas");

const engine = new BBL.Engine(canvas);

// Create our first scene.
var scene = new BBL.Scene(engine);

var camera = new BBL.ArcRotateCamera("camera1", 0, 0, 10, new BBL.Vector3(0, 0, 0), scene);
camera.attachControl(canvas, true);
// This creates a light, aiming 0,1,0 - to the sky (non-mesh)
var light = new BBL.HemisphericLight("light1", new BBL.Vector3(0, 1, 0), scene);

// Default intensity is 1. Let's dim the light a small amount
light.intensity = 0.7;

// Create a grid material
var material = new MATS.WaterMaterial("water", scene);

// Our built-in 'sphere' shape. Params: name, subdivs, size, scene
var sphere = BBL.Mesh.CreateSphere("sphere1", 55, 2, scene);

sphere.position.y = 2;

sphere.material = material;

var ground = BBL.Mesh.CreateGround("ground1", 6, 6, 2, scene);

ground.material = material;

(function loop() {
    requestAnimationFrame(loop);
    scene.render();
})();

scene.debugLayer.show({
    showInspector: true
});