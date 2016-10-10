#!/usr/bin/env node
'use struct';

var onml = require('onml'),
    genSVG = require('../lib/gen-svg');

var xml = onml.stringify(genSVG);

console.log(xml);
