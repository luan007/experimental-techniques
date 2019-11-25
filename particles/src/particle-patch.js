import * as THREE from "three";
import * as shaders from "./*.glsl";

self.THREE = THREE;
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

var renderer = new THREE.WebGLRenderer({
    antialias: true
});
renderer.setPixelRatio(2);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var COUNT = 1000000;
var pts = new THREE.BufferGeometry();
var r = 1000;
var pos_arr = new Float32Array(COUNT * 3);
var attrbuffer = new THREE.BufferAttribute(pos_arr, 3);
for (var i = 0; i < COUNT; i++) {
    pos_arr[i * 3 + 0] = (Math.random() * 2 - 1) * r;
    pos_arr[i * 3 + 1] = (Math.random() * 2 - 1) * r;
    pos_arr[i * 3 + 2] = (Math.random() * 2 - 1) * r;
}
pts.setAttribute("position", attrbuffer);

var test_arr = new Float32Array(COUNT * 2);
var test_buffer = new THREE.BufferAttribute(test_arr, 2);
for (var i = 0; i < COUNT; i++) {
    test_arr[i * 2] = Math.floor(Math.random() * 8) / 8;
    test_arr[i * 2 + 1] = Math.floor(Math.random() * 8) / 8;
}
pts.setAttribute("test2", test_buffer);

var tx = new THREE.TextureLoader().load("./tx/mosaic.jpg");
tx.wrapS = THREE.RepeatWrapping;
tx.wrapT = THREE.RepeatWrapping;
var mat = new THREE.PointsMaterial({
    size: 3,
    map: tx
});
var value_test = {
    type: 'f',
    value: 0.5
};

mat.onBeforeCompile = function (shader, renderer) {
    // console.log(shader);
    shader.uniforms.test = value_test;
    // console.log(shader);
    shader.vertexShader = shaders["point-vert"];
    shader.fragmentShader = shaders["point-frag"];
}
var mesh = new THREE.Points(pts, mat);
scene.add(mesh);

(function loop() {
    value_test.value += 0.01;
    mesh.rotation.x += 0.0001;
    mesh.rotation.y += 0.0001;
    renderer.render(scene, camera);
    requestAnimationFrame(loop);
})();