'use strict';

function level (meter) {
    var old = 0;
    return function (event) {
        var i, neo;
        var inp = event.inputBuffer;
        var len = inp.length;
        var inpData = inp.getChannelData(0);

        neo = 0;
        for (i = 0; i < len; i++) {
            neo += Math.abs(inpData[i], 2);
        }
        old = (0.9 * old + 0.1 * neo);
        meter.render(old / len);
    };
}

module.exports = level;
