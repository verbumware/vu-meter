#!/usr/bin/env node
'use strict';

// watch the file changes to fire demo builf process

var watch = require('watch'),
    fs = require('fs'),
    browserify = require('browserify');

watch.createMonitor('./src/', function (monitor) {
    monitor.on('changed', function (f) {
        console.log('changes: ', f);
        var o = fs.createWriteStream('./demo2/app.js');
        var b = browserify('./src/demo2.js').bundle();
        b.on('error', console.error);
        b.pipe(o);
    });
});

// @flow
