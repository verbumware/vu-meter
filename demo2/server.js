#!/usr/bin/env node
'use strict';

var WebSocketServer = require('ws').Server,
    fs = require('fs'),
    path = require('path'),
    wss = new WebSocketServer({ port: 8080 });

wss.on('connection', function (ws) {
    var fname = path.resolve(process.cwd(), 'F' + Date.now() + '.bin');
    console.log(fname);
    ws.on('message', function (message) {
        fs.appendFileSync(fname, message, { encoding: 'binary' });
    });

    ws.send('something');
});
