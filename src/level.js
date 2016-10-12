'use strict';

function newPID (kp, ki, kd) { // PID regulator
    var prev = 0;
    var sum = 0;
    var prerr = 0;
    return function (cur) {
        var err = cur - prev;
        sum += err;
        var derr = (err - prerr);
        prerr = err;
        prev = (kp * err) + (ki * sum) + (kd * derr);
        return prev;
    };
}

function newPPM (k) {
    var prev = 0;
    return function (cur) {
        if (cur > (k * prev)) {
            prev = cur;
            return cur;
        }
        prev = k * prev;
        return prev;
    };
}

function rectifier (arr, len) { // RMS
    var i, res = 0;
    for (i = 0; i < len; i++) {
        res += Math.abs(arr[i]);
    }
    return res / len;
}

function max (arr, len) { // max
    var i, res = 0;
    for (i = 0; i < len; i++) {
        res = Math.max(Math.abs(arr[i]), res);
    }
    return res;
}

function level (meter) {
    var ku = 0.3;
    var vuPID = newPID(0.4 * ku, 2 * ku, ku / 8);
    var maxPID = newPPM(0.96);
    return function (event) {
        var inp = event.inputBuffer;
        var inpData = inp.getChannelData(0);
        var x1 = rectifier(inpData, inp.length);
        var vuVal = vuPID(x1);
        var maxVal = maxPID(max(inpData, inp.length));
        console.log(vuVal, maxVal);
        meter.render(vuVal, maxVal / 2);
    };
}

module.exports = level;
