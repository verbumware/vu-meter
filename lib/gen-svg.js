'use struct';

function fromDb (e) { return Math.pow(10, e / 20); }
function ascale (e) { return (e - 0.75) * 45; }
function lscale (e) { return (e - 75) * 0.45; }

var ls = 20; // logo step

var l0 = ['g',
    {
        id: 'vu-button',
        transform: 'translate(256,256)'
    },
    // backlit
    ['path', {
        id: 'vu-backlit',
        d: 'M0 -256l222 128l0 256L0 256L-222 128l0 -256',
        opacity: 1,
        fill: 'url(#offGradient)'
    }],
    // logo
    ['path', {
        d: 'M' + [
            [-3*ls, -ls],
            [ls, 2*ls], [ls, -2*ls],
            [ls, 2*ls], [ls, -2*ls],
            [ls, 2*ls], [ls, -2*ls],
        ].map(function (a) { return a.join(' '); }).join('l'),
        stroke: '#000',
        'stroke-width': 5,
        'stroke-linecap': 'round',
        fill: 'none'
    }]
];

// grid
var l1 = ['g', {
    id: 'layer1',
    transform: 'translate(256,530)',
    'font-family': 'helvetica',
    style: 'text-anchor: middle'
}];

// main dB marks
var m0 = [-20, -10, -7, -5, -3, -2, -1, 0];

m0
.map(fromDb)
.map(ascale)
.forEach(function (e, i) {
    l1.push(['g', { transform: 'rotate(' + e + ')' },
        ['path', { d: 'M0 -360,v-20', stroke: '#000', 'stroke-width': 2 }],
        ['text', { y: -390, 'font-size': 20 }, Math.abs(m0[i])]
    ]);
});

var r0 = [1, 2, 3];

r0
.map(fromDb)
.map(ascale)
.forEach(function (e, i) {
    l1.push(['g', { transform: 'rotate(' + e + ')' },
        ['path', { d: 'M0 -360,v-20', stroke: 'red', 'stroke-width': 2 }],
        ['text', { y: -390, 'font-size': 20, fill: 'red'}, r0[i]]
    ]);
});

[-21, -6, -4, -0.5, 0.5]
.map(fromDb)
.map(ascale)
.forEach(function (e) {
    l1.push(['g', { transform: 'rotate(' + e + ')'},
        ['path', { d: 'M0 -360,v-15', stroke: '#000', 'stroke-width': 1 }]
    ]);
});

[0.5]
.map(fromDb)
.map(ascale)
.forEach(function (e) {
    l1.push(['g', { transform: 'rotate(' + e + ')'},
        ['path', { d: 'M0 -360,v-15', stroke: 'red', 'stroke-width': 1 }]
    ]);
});

// volume % marks
var mm0 = [20, 40, 60, 80, 100];

mm0
.map(lscale)
.forEach(function (e, i) {
    l1.push(['g', { transform: 'rotate(' + e + ')'},
        ['path', {
            d: 'M0 -350,v0',
            stroke: '#000',
            'stroke-width': 6,
            'stroke-linecap': 'round'
        }],
        ['text', { y: -330, 'font-size': 12 }, mm0[i]]
    ]);
});

[10, 30, 50, 70, 90]
.map(lscale)
.forEach(function (e) {
    l1.push(['g', { transform: 'rotate(' + e + ')'},
        ['path', {
            d: 'M0 -350,v0',
            stroke: '#000',
            'stroke-width': 4,
            'stroke-linecap': 'round'
        }],
    ]);
});

// red zone
l1.push(['g', {},
    ['path', {
        d: 'M73 -357 a365 365 0 0 1 108 40',
        stroke: '#F00',
        'stroke-width': 10,
        fill: 'none'
    }],
]);

// VU needle
l1.push(['g', { id: 'vu-needle', transform: 'rotate(-30)' },
    ['path', { d: 'M0 -200v-180', stroke: '#5AF',
        'stroke-opacity': 0.2, 'stroke-width': 4 }],
    ['path', { d: 'M0 -200v-180', stroke: '#000', 'stroke-width': 2 }]
]);

// max needle
l1.push(['g', { id: 'max-needle', transform: 'rotate(-30)' },
    ['path', { d: 'M0 -300v-80', stroke: '#300', 'stroke-width': 3 }]
]);

var svg = ['svg', {
    xmlns: 'http://www.w3.org/2000/svg',
    width: 512, height: 512,
    viewBox: [0, 0, 512, 512].join(' ')
},
['defs',
    ['radialGradient', { id: 'onGradient' },
        ['stop', { offset: '0%', 'stop-color': '#FE5' }],
        ['stop', { offset: '100%', 'stop-color': '#FA3' }]
    ],
    ['radialGradient', { id: 'offGradient' },
        ['stop', { offset: '0%', 'stop-color': '#444' }],
        ['stop', { offset: '100%', 'stop-color': '#555' }]
    ],
], l0, l1];

module.exports = svg;
