#!/usr/bin/env node
'use strict';

var fs = require('fs'),
    // stream = require('stream'),
    // browserify = require('browserify'),
    browserifyFn = require('browserify-string'),
    path = require('path'),
    lib = require('../lib'),
    yargs = require('yargs');

var argv = yargs.argv;

if (typeof argv.i === 'string') {
    fs.readFile(
        path.resolve(process.cwd(), argv.i),
        'utf8',
        function (rErr, rDat) {
            if (rErr) {
                throw rErr;
            }
            var assets = lib.extract(rDat);
            var res = lib.wrap(assets);
            browserifyFn(res)
            .bundle(function (bErr, bDat) {
                if (bErr) {
                    throw bErr;
                }
                console.log(bDat.toString());
            });
        }
    );
}
