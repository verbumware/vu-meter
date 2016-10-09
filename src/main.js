'use strict';

var getUserMedia = require('./get-user-media'),
    audioCxt = require('./audio-cxt'),
    level = require('./level');

function cxt (o) {

    function step1 (stream) {
        console.log(stream);
        var hooks = audioCxt(stream, {}, level(o.meter));
        o.controls.start.el.addEventListener(o.controls.start.on, hooks.start);
        o.controls.stop.el.addEventListener(o.controls.stop.on, hooks.stop);
    }

    getUserMedia(
        { audio: true },
        step1,
        function (error) {
            console.log(error);
        }
    );

}

function mic (options) {
    cxt(options);
}

window.verbumware = window.verbumware || {};
window.verbumware.mic = mic;
