'use strict';

var getUserMedia = require('./get-user-media'),
    genSVG = require('../lib/gen-svg'),
    onml = require('onml'),
    audioCxt = require('./audio-cxt'),
    level = require('./level');

var newButton = function (el) {
    var state = false;
    return function (start, stop) {
        el.addEventListener('click', function () {
            if (state)  {
                stop();
                state = false;
                console.log('stop');
            }
            else {
                start();
                state = true;
                console.log('start');
            }
        });
    };
};

var newNeedle = function (el) {
    return {
        render: function (val) {
            el.setAttribute('transform', 'rotate(' + (val * 10) + ')');
        }
    };
};

var content = document.getElementById('content');
var div = document.createElement('div');
div.innerHTML = onml.stringify(genSVG);
content.appendChild(div);

var vuButton = newButton(document.getElementById('vu-button'));
var vuNeedle = newNeedle(document.getElementById('vu-needle'));

function step1 (stream) {
    console.log(stream);
    var h = audioCxt(stream, {}, level(vuNeedle));
    vuButton(h.start, h.stop);
}

getUserMedia(
    { audio: true },
    step1,
    function (error) {
        console.error(error);
    }
);
