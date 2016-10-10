'use strict';

var getUserMedia = require('./get-user-media'),
    genSVG = require('../lib/gen-svg'),
    onml = require('onml'),
    audioCxt = require('./audio-cxt'),
    level = require('./level');

var newButton = function (button, backlit) {
    var state = false;
    return function (start, stop) {
        button.addEventListener('click', function () {
            if (state)  {
                stop();
                backlit.setAttribute('fill', 'url(#offGradient)');
                state = false;
                console.log('stop');
            }
            else {
                start();
                backlit.setAttribute('fill', 'url(#onGradient)');
                state = true;
                console.log('start');
            }
        });
    };
};

var newNeedle = function (el) {
    return {
        render: function (val) {
            el.setAttribute('transform', 'rotate(' + (val * 250 - 30) + ')');
        }
    };
};

var content = document.getElementById('content');
var div = document.createElement('div');
div.innerHTML = onml.stringify(genSVG);
content.appendChild(div);

var vuButton = newButton(
    document.getElementById('vu-button'),
    document.getElementById('vu-backlit')
);

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
