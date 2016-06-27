'use strict';

var jsof = require('jsof');

function wrap (assets, options) {
    var res;
    res = `
var stringify = require('onml/lib/stringify');

var assets = ${jsof.s(assets)};

function meter (element) {
    var g0 = ['g'];
    var svg = ['svg'];
    svg.push(assets.svg);
    assets.svg.class = 'logo';
    svg.push(g0);
    g0.push({ transform: 'translate(' + assets.offset[0] + ',' + assets.offset[1] + ')' })
    g0.push(assets.back);
    g0.push(assets.front);
    element.innerHTML = stringify(svg);
    function update (value) {
        console.log(value);
    }
    return { update: update };
}

window['instruments'] = window['instruments'] || [];
window['instruments'].push(meter);
`;
    return res;
}

module.exports = wrap;
