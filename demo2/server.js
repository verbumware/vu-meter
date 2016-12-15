#!/usr/bin/env node
'use strict';

var WebSocketServer = require('ws').Server,
    fs = require('fs'),
    path = require('path'),
    wss = new WebSocketServer({ port: 8080 });

wss.on('connection', function (ws) {
    var fname = path.resolve(process.cwd(), 'F' + Date.now() + '.wav');
    console.log(fname);
    fs.appendFileSync(
        fname,
        Buffer.from(
            '52494646' + // ChunkID: "RIFF"
            '24080000' + // ChunkSize: 2084???
            '57415645' + // Format: "WAVE"
            '666d7420' + // "fmt "
            '10000000' + // Subchunk1Size = 16
            '0100'     + // AudioFormat = PCM
            '0100'     + // NumChannels = mono
            '803e0000' + // SampleRate: 16000
            '007d0100' + // ByteRate: 32000
            '0200'     + // BlockAlign: 2
            '1000'     + // BitsPerSample: 16
            '64617461' + // "data"
            '00080000', // Subchunk2Size: 2048
            'hex'),
        { encoding: 'binary' }
    );
    ws.on('message', function (message) {
        fs.appendFileSync(fname, message, { encoding: 'binary' });
    });

    ws.send('something');
});
