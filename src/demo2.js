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

var newNeedle = function (vuEl, maxEl) {
    return {
        render: function (vu, max) {
            vuEl.setAttribute('transform', 'rotate(' + (vu * 60 - 30) + ')');
            maxEl.setAttribute('transform', 'rotate(' + (max * 60 - 30) + ')');
        }
    };
};

var content = document.getElementById('content');
var div = document.createElement('div');
var report = document.getElementById('report');
div.innerHTML = onml.stringify(genSVG);
content.appendChild(div);

var vuButton = newButton(document.getElementById('vu-button'), document.getElementById('vu-backlit'));
var vuNeedle = newNeedle(document.getElementById('vu-needle'), document.getElementById('max-needle'));

var targetSampleRate = 16000;

/* 1486.077 = (4096 * 16000 / 44100) */

function resampleAudioBuffer(audioBuffer, oncomplete) {
    var numCh_ = audioBuffer.numberOfChannels;
    var numFrames_ = audioBuffer.length * targetSampleRate / audioBuffer.sampleRate;
    var offlineContext_ = new OfflineAudioContext(numCh_, numFrames_, targetSampleRate);
    var bufferSource_ = offlineContext_.createBufferSource();
    bufferSource_.buffer = audioBuffer;
    offlineContext_.oncomplete = function(event) {
        var resampeledBuffer = event.renderedBuffer;
        var dataF64 = resampeledBuffer.getChannelData(0);
        var ilen = dataF64.length;
        var dataI16 = new Int16Array(ilen);
        var i;
        for (i = 0; i < ilen; i++) {
            dataI16[i] = dataF64[i] * 0x7fff;
        }
        oncomplete(dataI16);
    };
    // console.log('Starting Offline Rendering');
    bufferSource_.connect(offlineContext_.destination);
    bufferSource_.start(0);
    offlineContext_.startRendering();
}

function processor () {
    var ws = new WebSocket('ws://verbumware.org:8008', 'simple-audio-stream');
    ws.binaryType = 'arraybuffer';
    var lev = level(vuNeedle);
    ws.onopen = function (event) {
        console.log(event);
    };
    ws.onerror = function (event) {
        console.log(event);
    };
    ws.onclose = function (event) {
        console.log(event);
    };
    ws.onmessage = function (event) {
        console.log(event.data);
        report.innerHTML = event.data;
    };
    return {
        ws: ws,
        processor: function (event) {
            lev(event);
            var inp = event.inputBuffer;
            resampleAudioBuffer(inp, function (data) {
                // console.log(data);
                ws.send(data);
            });
        }
    };
}

function step1 (stream) {
    // console.log(stream);
    var p = processor();
    var h = audioCxt(stream, {}, p);
    vuButton(h.start, h.stop);
}

getUserMedia(
    { audio: true },
    step1,
    function (error) {
        console.error(error);
    }
);
