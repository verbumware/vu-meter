'use strict';

module.exports = function (stream, options, cb) {
    var AudioContext = window.AudioContext || window.webkitAudioContext;
    var acxt = new AudioContext();

    var n0 = acxt.createMediaStreamSource(stream);
    var n1 = acxt.createGain();
    var n2 = acxt.createScriptProcessor(4096, 1, 1);
    n2.onaudioprocess = cb;
    return {
        start: function () {
            n0.connect(n1);
            n1.connect(n2);
            n2.connect(acxt.destination);
        },
        stop: function () {
            n0.disconnect(n1);
            n1.disconnect(n2);
            n2.disconnect(acxt.destination);
        }
    };
};
