import * as noisejs from "noisejs";

const COUNT = 150000;
var noise = new noisejs.Noise();

var a = new Float32Array(COUNT);
var v = new Float32Array(COUNT);

self.onmessage = function (msg) {
    var q = msg.data.q;
    var shell = new this.Float32Array(msg.data.buffer);
    for (var i = msg.data.start; i < msg.data.end; i++) {
        a[i * 3] = 0.01 * noise.perlin3(shell[i * 3 + 1] / 5 - q, shell[i * 3 + 2] / 5, shell[i * 3] / 5 - q)
        a[i * 3 + 1] = 0.01 * noise.perlin3(shell[i * 3 + 1] / 5, shell[i * 3] / 5 + q, shell[i * 3 + 2] / 5)
        a[i * 3 + 2] = 0.01 * noise.perlin3(shell[i * 3] / 5, shell[i * 3 + 2] / 5, shell[i * 3 + 1] / 5 + q)

        v[i * 3] += a[i * 3] * q * 0.02;
        v[i * 3 + 1] += a[i * 3 + 1] * q * 0.02;
        v[i * 3 + 2] += a[i * 3 + 2] * q * 0.02;

        v[i * 3] *= 0.9;
        v[i * 3 + 1] *= 0.9;
        v[i * 3 + 2] *= 0.9;

        shell[i * 3] += v[i * 3] * q;
        shell[i * 3 + 1] += v[i * 3 + 1] * q;
        shell[i * 3 + 2] += v[i * 3 + 2] * q;
    }
    self.postMessage({
        update: true
    })
}