'use strict';

var onml = require('onml'),
    jsof = require('jsof');

function parseTranslate (str) {
    var arr = str.split(/[\(\,\)]/);
    return [arr[1], arr[2]].map(function (e) {
        return Number(e);
    });
}

function getElementById (ml, id) {
    var res;
    onml.t(ml, {
        enter: function (node) {
            if (node.attr.id === id) {
                res = node.full;
            }
        }
    });
    return res;
}

function getParentLayerTransformById (ml, id) {
    var res;
    onml.t(ml, {
        enter: function (node, parent) {
            if (node.attr.id === id) {
                res = parent.attr.transform;
            }
        }
    });
    return parseTranslate(res);
}

function extract (svg) {
    var ml = onml.p(svg);
    var assets = {
        offset: getParentLayerTransformById(ml, 'vu-view'),
        svg: {
            width: Number(ml[1].width),
            height: Number(ml[1].height),
            viewBox: ml[1].viewBox.split(' ').map(function (e) {
                return Number(e);
            })
        }
    };
    assets = 'view track front back needle'.split(' ').reduce(function (o, e) {
        o[e] = getElementById(ml, 'vu-' + e);
        return o;
    }, assets);

    assets.view = {
        x: Number(assets.view[1].x),
        y: Number(assets.view[1].y),
        width: Number(assets.view[1].width),
        height: Number(assets.view[1].height),
    };

    assets.needle = assets.needle[1].style;

    assets.track = 'cx cy rx ry'.split(' ').map(function (name) {
        return Number(assets.track[1]['sodipodi:' + name]);
    });

    return jsof.s(assets);
}

module.exports = extract;
