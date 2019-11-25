import * as THREE from "three";

//unsafe
const WORKERS = 3;
const COUNT = 100000;
self.THREE = THREE;
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 25;
var renderer = new THREE.WebGLRenderer({
    antialias: true
});
renderer.setPixelRatio(2);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var pts = new THREE.BufferGeometry();
var sab = new SharedArrayBuffer(COUNT * 3 * 4);
var shell = new Float32Array(sab);
for (var i = 0; i < COUNT * 3; i++) {
    shell[i] = THREE.Math.randFloatSpread(10);
}

var attr_pos = new THREE.BufferAttribute(shell, 3);
pts.setAttribute("position", attr_pos)

var mat = new THREE.PointsMaterial({
    size: 0.01,
    color: 0xffffff
});
var mesh = new THREE.Points(pts, mat);
scene.add(mesh);

var workers = [];

function init_workers(WORKERS) {
    var range_start = 0;
    for (var i = 0; i < WORKERS; i++) {
        ((i) => {
            let worker = new Worker('./worker.js')
            worker.done = true; //idle
            worker.onmessage = function () {
                worker.done = true;
            }
            worker.range_start = range_start;
            range_start += Math.ceil(COUNT / WORKERS);
            range_start = Math.min(range_start, COUNT - 1);
            worker.range_end = range_start;
            range_start++;
            workers.push(worker);
        })(i)
    }
}

function loop_workers() {
    for (var i = 0; i < workers.length; i++) {
        if (workers[i].done == true) {
            workers[i].done = false; //flip
            workers[i].postMessage({
                buffer: sab,
                q: q,
                start: workers[i].range_start,
                end: workers[i].range_end
            });
        }
    }
}

init_workers(WORKERS);


var q = 0;
(function loop() {
    q += 0.01;
    mesh.rotation.x += 0.002;
    mesh.rotation.y += 0.002;
    renderer.render(scene, camera);
    loop_workers();
    attr_pos.needsUpdate = true;
    requestAnimationFrame(loop);
})();