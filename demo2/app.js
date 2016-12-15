(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

module.exports = function (stream, options, cb) {
    var acxt = new (window.AudioContext || window.webkitAudioContext)();

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

},{}],2:[function(require,module,exports){
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

},{"./audio-cxt":1,"./get-user-media":3}],3:[function(require,module,exports){
'use strict';

module.exports = function (o/*:Object*/, successCallBack /*:function*/, errorCallBack /*:function*/) {

    navigator.getUserMedia = (
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia
    );

    if (navigator.getUserMedia) {
        navigator.getUserMedia(o, successCallBack, errorCallBack);
    } else {
        console.log('can\'t get getUserMedia');
    }

};
// @flow

},{}]},{},[2]);
