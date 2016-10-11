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

function rectifier (arr, len) { // RMS
    var i, res = 0;
    for (i = 0; i < len; i++) {
        res += Math.abs(arr[i]);
    }
    return Math.sqrt(res / len);
}

function level (meter) {
    var ku = 0.3;
    var pid = newPID(0.4 * ku, 2 * ku, ku / 8);
    return function (event) {
        var inp = event.inputBuffer;
        var inpData = inp.getChannelData(0);
        var x1 = rectifier(inpData, inp.length);
        var x2 = pid(x1);
        console.log(x1, x2);
        meter.render(x2);
    };
}

module.exports = level;
