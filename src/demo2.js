'use strict';

var getUserMedia = require('./get-user-media'),
    audioCxt = require('./audio-cxt');

function button (h) {
    var state = 0;
    var el = document.getElementById('thebutton');
    el.addEventListener('click', function () {
        if (state) {
            el.innerHTML = 'Click to START';
            state = 0;
            h.stop();
        } else {
            el.innerHTML = 'Click to STOP';
            state = 1;
            h.start();
        }
    });
}

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
    var ws = new WebSocket('ws://127.1.1.1:8080');
    ws.binaryType = 'arraybuffer';
    return function (event) {
        var inp = event.inputBuffer;
        resampleAudioBuffer(inp, function (data) {
            console.log(data);
            ws.send(data);
        });
    };
}

function step1 (stream) {
    console.log(stream);
    var p = processor();
    var h = audioCxt(stream, {}, p);
    button(h);
}

getUserMedia(
    { audio: true },
    step1,
    function (error) {
        console.error(error);
    }
);
