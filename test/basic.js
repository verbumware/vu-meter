'use strict';

var lib = require('../lib'),
    path = require('path'),
    fs = require('fs');

describe('basic', function () {
    it('svg2js', function (done) {
        fs.readFile(
            path.resolve(__dirname, '../skin/basic.svg'),
            'utf8',
            function (rErr, dat) {
                if (rErr) {
                    throw rErr;
                }
                var res = lib.extract(dat);
                fs.writeFile(
                    path.resolve(__dirname, '../demo/basic.js'),
                    res,
                    function (wErr) {
                        if (wErr) {
                            throw wErr;
                        }
                        done();
                    }
                );
            }
        );
    });
});
