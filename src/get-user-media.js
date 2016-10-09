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
