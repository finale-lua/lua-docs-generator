module.exports =
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 107:
/***/ ((module) => {

"use strict";


module.exports = ({onlyFirst = false} = {}) => {
	const pattern = [
		'[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:[a-zA-Z\\d]*(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)',
		'(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))'
	].join('|');

	return new RegExp(pattern, onlyFirst ? undefined : 'g');
};


/***/ }),

/***/ 850:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";
/* module decorator */ module = __nccwpck_require__.nmd(module);


const wrapAnsi16 = (fn, offset) => (...args) => {
	const code = fn(...args);
	return `\u001B[${code + offset}m`;
};

const wrapAnsi256 = (fn, offset) => (...args) => {
	const code = fn(...args);
	return `\u001B[${38 + offset};5;${code}m`;
};

const wrapAnsi16m = (fn, offset) => (...args) => {
	const rgb = fn(...args);
	return `\u001B[${38 + offset};2;${rgb[0]};${rgb[1]};${rgb[2]}m`;
};

const ansi2ansi = n => n;
const rgb2rgb = (r, g, b) => [r, g, b];

const setLazyProperty = (object, property, get) => {
	Object.defineProperty(object, property, {
		get: () => {
			const value = get();

			Object.defineProperty(object, property, {
				value,
				enumerable: true,
				configurable: true
			});

			return value;
		},
		enumerable: true,
		configurable: true
	});
};

/** @type {typeof import('color-convert')} */
let colorConvert;
const makeDynamicStyles = (wrap, targetSpace, identity, isBackground) => {
	if (colorConvert === undefined) {
		colorConvert = __nccwpck_require__(760);
	}

	const offset = isBackground ? 10 : 0;
	const styles = {};

	for (const [sourceSpace, suite] of Object.entries(colorConvert)) {
		const name = sourceSpace === 'ansi16' ? 'ansi' : sourceSpace;
		if (sourceSpace === targetSpace) {
			styles[name] = wrap(identity, offset);
		} else if (typeof suite === 'object') {
			styles[name] = wrap(suite[targetSpace], offset);
		}
	}

	return styles;
};

function assembleStyles() {
	const codes = new Map();
	const styles = {
		modifier: {
			reset: [0, 0],
			// 21 isn't widely supported and 22 does the same thing
			bold: [1, 22],
			dim: [2, 22],
			italic: [3, 23],
			underline: [4, 24],
			inverse: [7, 27],
			hidden: [8, 28],
			strikethrough: [9, 29]
		},
		color: {
			black: [30, 39],
			red: [31, 39],
			green: [32, 39],
			yellow: [33, 39],
			blue: [34, 39],
			magenta: [35, 39],
			cyan: [36, 39],
			white: [37, 39],

			// Bright color
			blackBright: [90, 39],
			redBright: [91, 39],
			greenBright: [92, 39],
			yellowBright: [93, 39],
			blueBright: [94, 39],
			magentaBright: [95, 39],
			cyanBright: [96, 39],
			whiteBright: [97, 39]
		},
		bgColor: {
			bgBlack: [40, 49],
			bgRed: [41, 49],
			bgGreen: [42, 49],
			bgYellow: [43, 49],
			bgBlue: [44, 49],
			bgMagenta: [45, 49],
			bgCyan: [46, 49],
			bgWhite: [47, 49],

			// Bright color
			bgBlackBright: [100, 49],
			bgRedBright: [101, 49],
			bgGreenBright: [102, 49],
			bgYellowBright: [103, 49],
			bgBlueBright: [104, 49],
			bgMagentaBright: [105, 49],
			bgCyanBright: [106, 49],
			bgWhiteBright: [107, 49]
		}
	};

	// Alias bright black as gray (and grey)
	styles.color.gray = styles.color.blackBright;
	styles.bgColor.bgGray = styles.bgColor.bgBlackBright;
	styles.color.grey = styles.color.blackBright;
	styles.bgColor.bgGrey = styles.bgColor.bgBlackBright;

	for (const [groupName, group] of Object.entries(styles)) {
		for (const [styleName, style] of Object.entries(group)) {
			styles[styleName] = {
				open: `\u001B[${style[0]}m`,
				close: `\u001B[${style[1]}m`
			};

			group[styleName] = styles[styleName];

			codes.set(style[0], style[1]);
		}

		Object.defineProperty(styles, groupName, {
			value: group,
			enumerable: false
		});
	}

	Object.defineProperty(styles, 'codes', {
		value: codes,
		enumerable: false
	});

	styles.color.close = '\u001B[39m';
	styles.bgColor.close = '\u001B[49m';

	setLazyProperty(styles.color, 'ansi', () => makeDynamicStyles(wrapAnsi16, 'ansi16', ansi2ansi, false));
	setLazyProperty(styles.color, 'ansi256', () => makeDynamicStyles(wrapAnsi256, 'ansi256', ansi2ansi, false));
	setLazyProperty(styles.color, 'ansi16m', () => makeDynamicStyles(wrapAnsi16m, 'rgb', rgb2rgb, false));
	setLazyProperty(styles.bgColor, 'ansi', () => makeDynamicStyles(wrapAnsi16, 'ansi16', ansi2ansi, true));
	setLazyProperty(styles.bgColor, 'ansi256', () => makeDynamicStyles(wrapAnsi256, 'ansi256', ansi2ansi, true));
	setLazyProperty(styles.bgColor, 'ansi16m', () => makeDynamicStyles(wrapAnsi16m, 'rgb', rgb2rgb, true));

	return styles;
}

// Make the export immutable
Object.defineProperty(module, 'exports', {
	enumerable: true,
	get: assembleStyles
});


/***/ }),

/***/ 520:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

/* MIT license */
/* eslint-disable no-mixed-operators */
const cssKeywords = __nccwpck_require__(902);

// NOTE: conversions should only return primitive values (i.e. arrays, or
//       values that give correct `typeof` results).
//       do not use box values types (i.e. Number(), String(), etc.)

const reverseKeywords = {};
for (const key of Object.keys(cssKeywords)) {
	reverseKeywords[cssKeywords[key]] = key;
}

const convert = {
	rgb: {channels: 3, labels: 'rgb'},
	hsl: {channels: 3, labels: 'hsl'},
	hsv: {channels: 3, labels: 'hsv'},
	hwb: {channels: 3, labels: 'hwb'},
	cmyk: {channels: 4, labels: 'cmyk'},
	xyz: {channels: 3, labels: 'xyz'},
	lab: {channels: 3, labels: 'lab'},
	lch: {channels: 3, labels: 'lch'},
	hex: {channels: 1, labels: ['hex']},
	keyword: {channels: 1, labels: ['keyword']},
	ansi16: {channels: 1, labels: ['ansi16']},
	ansi256: {channels: 1, labels: ['ansi256']},
	hcg: {channels: 3, labels: ['h', 'c', 'g']},
	apple: {channels: 3, labels: ['r16', 'g16', 'b16']},
	gray: {channels: 1, labels: ['gray']}
};

module.exports = convert;

// Hide .channels and .labels properties
for (const model of Object.keys(convert)) {
	if (!('channels' in convert[model])) {
		throw new Error('missing channels property: ' + model);
	}

	if (!('labels' in convert[model])) {
		throw new Error('missing channel labels property: ' + model);
	}

	if (convert[model].labels.length !== convert[model].channels) {
		throw new Error('channel and label counts mismatch: ' + model);
	}

	const {channels, labels} = convert[model];
	delete convert[model].channels;
	delete convert[model].labels;
	Object.defineProperty(convert[model], 'channels', {value: channels});
	Object.defineProperty(convert[model], 'labels', {value: labels});
}

convert.rgb.hsl = function (rgb) {
	const r = rgb[0] / 255;
	const g = rgb[1] / 255;
	const b = rgb[2] / 255;
	const min = Math.min(r, g, b);
	const max = Math.max(r, g, b);
	const delta = max - min;
	let h;
	let s;

	if (max === min) {
		h = 0;
	} else if (r === max) {
		h = (g - b) / delta;
	} else if (g === max) {
		h = 2 + (b - r) / delta;
	} else if (b === max) {
		h = 4 + (r - g) / delta;
	}

	h = Math.min(h * 60, 360);

	if (h < 0) {
		h += 360;
	}

	const l = (min + max) / 2;

	if (max === min) {
		s = 0;
	} else if (l <= 0.5) {
		s = delta / (max + min);
	} else {
		s = delta / (2 - max - min);
	}

	return [h, s * 100, l * 100];
};

convert.rgb.hsv = function (rgb) {
	let rdif;
	let gdif;
	let bdif;
	let h;
	let s;

	const r = rgb[0] / 255;
	const g = rgb[1] / 255;
	const b = rgb[2] / 255;
	const v = Math.max(r, g, b);
	const diff = v - Math.min(r, g, b);
	const diffc = function (c) {
		return (v - c) / 6 / diff + 1 / 2;
	};

	if (diff === 0) {
		h = 0;
		s = 0;
	} else {
		s = diff / v;
		rdif = diffc(r);
		gdif = diffc(g);
		bdif = diffc(b);

		if (r === v) {
			h = bdif - gdif;
		} else if (g === v) {
			h = (1 / 3) + rdif - bdif;
		} else if (b === v) {
			h = (2 / 3) + gdif - rdif;
		}

		if (h < 0) {
			h += 1;
		} else if (h > 1) {
			h -= 1;
		}
	}

	return [
		h * 360,
		s * 100,
		v * 100
	];
};

convert.rgb.hwb = function (rgb) {
	const r = rgb[0];
	const g = rgb[1];
	let b = rgb[2];
	const h = convert.rgb.hsl(rgb)[0];
	const w = 1 / 255 * Math.min(r, Math.min(g, b));

	b = 1 - 1 / 255 * Math.max(r, Math.max(g, b));

	return [h, w * 100, b * 100];
};

convert.rgb.cmyk = function (rgb) {
	const r = rgb[0] / 255;
	const g = rgb[1] / 255;
	const b = rgb[2] / 255;

	const k = Math.min(1 - r, 1 - g, 1 - b);
	const c = (1 - r - k) / (1 - k) || 0;
	const m = (1 - g - k) / (1 - k) || 0;
	const y = (1 - b - k) / (1 - k) || 0;

	return [c * 100, m * 100, y * 100, k * 100];
};

function comparativeDistance(x, y) {
	/*
		See https://en.m.wikipedia.org/wiki/Euclidean_distance#Squared_Euclidean_distance
	*/
	return (
		((x[0] - y[0]) ** 2) +
		((x[1] - y[1]) ** 2) +
		((x[2] - y[2]) ** 2)
	);
}

convert.rgb.keyword = function (rgb) {
	const reversed = reverseKeywords[rgb];
	if (reversed) {
		return reversed;
	}

	let currentClosestDistance = Infinity;
	let currentClosestKeyword;

	for (const keyword of Object.keys(cssKeywords)) {
		const value = cssKeywords[keyword];

		// Compute comparative distance
		const distance = comparativeDistance(rgb, value);

		// Check if its less, if so set as closest
		if (distance < currentClosestDistance) {
			currentClosestDistance = distance;
			currentClosestKeyword = keyword;
		}
	}

	return currentClosestKeyword;
};

convert.keyword.rgb = function (keyword) {
	return cssKeywords[keyword];
};

convert.rgb.xyz = function (rgb) {
	let r = rgb[0] / 255;
	let g = rgb[1] / 255;
	let b = rgb[2] / 255;

	// Assume sRGB
	r = r > 0.04045 ? (((r + 0.055) / 1.055) ** 2.4) : (r / 12.92);
	g = g > 0.04045 ? (((g + 0.055) / 1.055) ** 2.4) : (g / 12.92);
	b = b > 0.04045 ? (((b + 0.055) / 1.055) ** 2.4) : (b / 12.92);

	const x = (r * 0.4124) + (g * 0.3576) + (b * 0.1805);
	const y = (r * 0.2126) + (g * 0.7152) + (b * 0.0722);
	const z = (r * 0.0193) + (g * 0.1192) + (b * 0.9505);

	return [x * 100, y * 100, z * 100];
};

convert.rgb.lab = function (rgb) {
	const xyz = convert.rgb.xyz(rgb);
	let x = xyz[0];
	let y = xyz[1];
	let z = xyz[2];

	x /= 95.047;
	y /= 100;
	z /= 108.883;

	x = x > 0.008856 ? (x ** (1 / 3)) : (7.787 * x) + (16 / 116);
	y = y > 0.008856 ? (y ** (1 / 3)) : (7.787 * y) + (16 / 116);
	z = z > 0.008856 ? (z ** (1 / 3)) : (7.787 * z) + (16 / 116);

	const l = (116 * y) - 16;
	const a = 500 * (x - y);
	const b = 200 * (y - z);

	return [l, a, b];
};

convert.hsl.rgb = function (hsl) {
	const h = hsl[0] / 360;
	const s = hsl[1] / 100;
	const l = hsl[2] / 100;
	let t2;
	let t3;
	let val;

	if (s === 0) {
		val = l * 255;
		return [val, val, val];
	}

	if (l < 0.5) {
		t2 = l * (1 + s);
	} else {
		t2 = l + s - l * s;
	}

	const t1 = 2 * l - t2;

	const rgb = [0, 0, 0];
	for (let i = 0; i < 3; i++) {
		t3 = h + 1 / 3 * -(i - 1);
		if (t3 < 0) {
			t3++;
		}

		if (t3 > 1) {
			t3--;
		}

		if (6 * t3 < 1) {
			val = t1 + (t2 - t1) * 6 * t3;
		} else if (2 * t3 < 1) {
			val = t2;
		} else if (3 * t3 < 2) {
			val = t1 + (t2 - t1) * (2 / 3 - t3) * 6;
		} else {
			val = t1;
		}

		rgb[i] = val * 255;
	}

	return rgb;
};

convert.hsl.hsv = function (hsl) {
	const h = hsl[0];
	let s = hsl[1] / 100;
	let l = hsl[2] / 100;
	let smin = s;
	const lmin = Math.max(l, 0.01);

	l *= 2;
	s *= (l <= 1) ? l : 2 - l;
	smin *= lmin <= 1 ? lmin : 2 - lmin;
	const v = (l + s) / 2;
	const sv = l === 0 ? (2 * smin) / (lmin + smin) : (2 * s) / (l + s);

	return [h, sv * 100, v * 100];
};

convert.hsv.rgb = function (hsv) {
	const h = hsv[0] / 60;
	const s = hsv[1] / 100;
	let v = hsv[2] / 100;
	const hi = Math.floor(h) % 6;

	const f = h - Math.floor(h);
	const p = 255 * v * (1 - s);
	const q = 255 * v * (1 - (s * f));
	const t = 255 * v * (1 - (s * (1 - f)));
	v *= 255;

	switch (hi) {
		case 0:
			return [v, t, p];
		case 1:
			return [q, v, p];
		case 2:
			return [p, v, t];
		case 3:
			return [p, q, v];
		case 4:
			return [t, p, v];
		case 5:
			return [v, p, q];
	}
};

convert.hsv.hsl = function (hsv) {
	const h = hsv[0];
	const s = hsv[1] / 100;
	const v = hsv[2] / 100;
	const vmin = Math.max(v, 0.01);
	let sl;
	let l;

	l = (2 - s) * v;
	const lmin = (2 - s) * vmin;
	sl = s * vmin;
	sl /= (lmin <= 1) ? lmin : 2 - lmin;
	sl = sl || 0;
	l /= 2;

	return [h, sl * 100, l * 100];
};

// http://dev.w3.org/csswg/css-color/#hwb-to-rgb
convert.hwb.rgb = function (hwb) {
	const h = hwb[0] / 360;
	let wh = hwb[1] / 100;
	let bl = hwb[2] / 100;
	const ratio = wh + bl;
	let f;

	// Wh + bl cant be > 1
	if (ratio > 1) {
		wh /= ratio;
		bl /= ratio;
	}

	const i = Math.floor(6 * h);
	const v = 1 - bl;
	f = 6 * h - i;

	if ((i & 0x01) !== 0) {
		f = 1 - f;
	}

	const n = wh + f * (v - wh); // Linear interpolation

	let r;
	let g;
	let b;
	/* eslint-disable max-statements-per-line,no-multi-spaces */
	switch (i) {
		default:
		case 6:
		case 0: r = v;  g = n;  b = wh; break;
		case 1: r = n;  g = v;  b = wh; break;
		case 2: r = wh; g = v;  b = n; break;
		case 3: r = wh; g = n;  b = v; break;
		case 4: r = n;  g = wh; b = v; break;
		case 5: r = v;  g = wh; b = n; break;
	}
	/* eslint-enable max-statements-per-line,no-multi-spaces */

	return [r * 255, g * 255, b * 255];
};

convert.cmyk.rgb = function (cmyk) {
	const c = cmyk[0] / 100;
	const m = cmyk[1] / 100;
	const y = cmyk[2] / 100;
	const k = cmyk[3] / 100;

	const r = 1 - Math.min(1, c * (1 - k) + k);
	const g = 1 - Math.min(1, m * (1 - k) + k);
	const b = 1 - Math.min(1, y * (1 - k) + k);

	return [r * 255, g * 255, b * 255];
};

convert.xyz.rgb = function (xyz) {
	const x = xyz[0] / 100;
	const y = xyz[1] / 100;
	const z = xyz[2] / 100;
	let r;
	let g;
	let b;

	r = (x * 3.2406) + (y * -1.5372) + (z * -0.4986);
	g = (x * -0.9689) + (y * 1.8758) + (z * 0.0415);
	b = (x * 0.0557) + (y * -0.2040) + (z * 1.0570);

	// Assume sRGB
	r = r > 0.0031308
		? ((1.055 * (r ** (1.0 / 2.4))) - 0.055)
		: r * 12.92;

	g = g > 0.0031308
		? ((1.055 * (g ** (1.0 / 2.4))) - 0.055)
		: g * 12.92;

	b = b > 0.0031308
		? ((1.055 * (b ** (1.0 / 2.4))) - 0.055)
		: b * 12.92;

	r = Math.min(Math.max(0, r), 1);
	g = Math.min(Math.max(0, g), 1);
	b = Math.min(Math.max(0, b), 1);

	return [r * 255, g * 255, b * 255];
};

convert.xyz.lab = function (xyz) {
	let x = xyz[0];
	let y = xyz[1];
	let z = xyz[2];

	x /= 95.047;
	y /= 100;
	z /= 108.883;

	x = x > 0.008856 ? (x ** (1 / 3)) : (7.787 * x) + (16 / 116);
	y = y > 0.008856 ? (y ** (1 / 3)) : (7.787 * y) + (16 / 116);
	z = z > 0.008856 ? (z ** (1 / 3)) : (7.787 * z) + (16 / 116);

	const l = (116 * y) - 16;
	const a = 500 * (x - y);
	const b = 200 * (y - z);

	return [l, a, b];
};

convert.lab.xyz = function (lab) {
	const l = lab[0];
	const a = lab[1];
	const b = lab[2];
	let x;
	let y;
	let z;

	y = (l + 16) / 116;
	x = a / 500 + y;
	z = y - b / 200;

	const y2 = y ** 3;
	const x2 = x ** 3;
	const z2 = z ** 3;
	y = y2 > 0.008856 ? y2 : (y - 16 / 116) / 7.787;
	x = x2 > 0.008856 ? x2 : (x - 16 / 116) / 7.787;
	z = z2 > 0.008856 ? z2 : (z - 16 / 116) / 7.787;

	x *= 95.047;
	y *= 100;
	z *= 108.883;

	return [x, y, z];
};

convert.lab.lch = function (lab) {
	const l = lab[0];
	const a = lab[1];
	const b = lab[2];
	let h;

	const hr = Math.atan2(b, a);
	h = hr * 360 / 2 / Math.PI;

	if (h < 0) {
		h += 360;
	}

	const c = Math.sqrt(a * a + b * b);

	return [l, c, h];
};

convert.lch.lab = function (lch) {
	const l = lch[0];
	const c = lch[1];
	const h = lch[2];

	const hr = h / 360 * 2 * Math.PI;
	const a = c * Math.cos(hr);
	const b = c * Math.sin(hr);

	return [l, a, b];
};

convert.rgb.ansi16 = function (args, saturation = null) {
	const [r, g, b] = args;
	let value = saturation === null ? convert.rgb.hsv(args)[2] : saturation; // Hsv -> ansi16 optimization

	value = Math.round(value / 50);

	if (value === 0) {
		return 30;
	}

	let ansi = 30
		+ ((Math.round(b / 255) << 2)
		| (Math.round(g / 255) << 1)
		| Math.round(r / 255));

	if (value === 2) {
		ansi += 60;
	}

	return ansi;
};

convert.hsv.ansi16 = function (args) {
	// Optimization here; we already know the value and don't need to get
	// it converted for us.
	return convert.rgb.ansi16(convert.hsv.rgb(args), args[2]);
};

convert.rgb.ansi256 = function (args) {
	const r = args[0];
	const g = args[1];
	const b = args[2];

	// We use the extended greyscale palette here, with the exception of
	// black and white. normal palette only has 4 greyscale shades.
	if (r === g && g === b) {
		if (r < 8) {
			return 16;
		}

		if (r > 248) {
			return 231;
		}

		return Math.round(((r - 8) / 247) * 24) + 232;
	}

	const ansi = 16
		+ (36 * Math.round(r / 255 * 5))
		+ (6 * Math.round(g / 255 * 5))
		+ Math.round(b / 255 * 5);

	return ansi;
};

convert.ansi16.rgb = function (args) {
	let color = args % 10;

	// Handle greyscale
	if (color === 0 || color === 7) {
		if (args > 50) {
			color += 3.5;
		}

		color = color / 10.5 * 255;

		return [color, color, color];
	}

	const mult = (~~(args > 50) + 1) * 0.5;
	const r = ((color & 1) * mult) * 255;
	const g = (((color >> 1) & 1) * mult) * 255;
	const b = (((color >> 2) & 1) * mult) * 255;

	return [r, g, b];
};

convert.ansi256.rgb = function (args) {
	// Handle greyscale
	if (args >= 232) {
		const c = (args - 232) * 10 + 8;
		return [c, c, c];
	}

	args -= 16;

	let rem;
	const r = Math.floor(args / 36) / 5 * 255;
	const g = Math.floor((rem = args % 36) / 6) / 5 * 255;
	const b = (rem % 6) / 5 * 255;

	return [r, g, b];
};

convert.rgb.hex = function (args) {
	const integer = ((Math.round(args[0]) & 0xFF) << 16)
		+ ((Math.round(args[1]) & 0xFF) << 8)
		+ (Math.round(args[2]) & 0xFF);

	const string = integer.toString(16).toUpperCase();
	return '000000'.substring(string.length) + string;
};

convert.hex.rgb = function (args) {
	const match = args.toString(16).match(/[a-f0-9]{6}|[a-f0-9]{3}/i);
	if (!match) {
		return [0, 0, 0];
	}

	let colorString = match[0];

	if (match[0].length === 3) {
		colorString = colorString.split('').map(char => {
			return char + char;
		}).join('');
	}

	const integer = parseInt(colorString, 16);
	const r = (integer >> 16) & 0xFF;
	const g = (integer >> 8) & 0xFF;
	const b = integer & 0xFF;

	return [r, g, b];
};

convert.rgb.hcg = function (rgb) {
	const r = rgb[0] / 255;
	const g = rgb[1] / 255;
	const b = rgb[2] / 255;
	const max = Math.max(Math.max(r, g), b);
	const min = Math.min(Math.min(r, g), b);
	const chroma = (max - min);
	let grayscale;
	let hue;

	if (chroma < 1) {
		grayscale = min / (1 - chroma);
	} else {
		grayscale = 0;
	}

	if (chroma <= 0) {
		hue = 0;
	} else
	if (max === r) {
		hue = ((g - b) / chroma) % 6;
	} else
	if (max === g) {
		hue = 2 + (b - r) / chroma;
	} else {
		hue = 4 + (r - g) / chroma;
	}

	hue /= 6;
	hue %= 1;

	return [hue * 360, chroma * 100, grayscale * 100];
};

convert.hsl.hcg = function (hsl) {
	const s = hsl[1] / 100;
	const l = hsl[2] / 100;

	const c = l < 0.5 ? (2.0 * s * l) : (2.0 * s * (1.0 - l));

	let f = 0;
	if (c < 1.0) {
		f = (l - 0.5 * c) / (1.0 - c);
	}

	return [hsl[0], c * 100, f * 100];
};

convert.hsv.hcg = function (hsv) {
	const s = hsv[1] / 100;
	const v = hsv[2] / 100;

	const c = s * v;
	let f = 0;

	if (c < 1.0) {
		f = (v - c) / (1 - c);
	}

	return [hsv[0], c * 100, f * 100];
};

convert.hcg.rgb = function (hcg) {
	const h = hcg[0] / 360;
	const c = hcg[1] / 100;
	const g = hcg[2] / 100;

	if (c === 0.0) {
		return [g * 255, g * 255, g * 255];
	}

	const pure = [0, 0, 0];
	const hi = (h % 1) * 6;
	const v = hi % 1;
	const w = 1 - v;
	let mg = 0;

	/* eslint-disable max-statements-per-line */
	switch (Math.floor(hi)) {
		case 0:
			pure[0] = 1; pure[1] = v; pure[2] = 0; break;
		case 1:
			pure[0] = w; pure[1] = 1; pure[2] = 0; break;
		case 2:
			pure[0] = 0; pure[1] = 1; pure[2] = v; break;
		case 3:
			pure[0] = 0; pure[1] = w; pure[2] = 1; break;
		case 4:
			pure[0] = v; pure[1] = 0; pure[2] = 1; break;
		default:
			pure[0] = 1; pure[1] = 0; pure[2] = w;
	}
	/* eslint-enable max-statements-per-line */

	mg = (1.0 - c) * g;

	return [
		(c * pure[0] + mg) * 255,
		(c * pure[1] + mg) * 255,
		(c * pure[2] + mg) * 255
	];
};

convert.hcg.hsv = function (hcg) {
	const c = hcg[1] / 100;
	const g = hcg[2] / 100;

	const v = c + g * (1.0 - c);
	let f = 0;

	if (v > 0.0) {
		f = c / v;
	}

	return [hcg[0], f * 100, v * 100];
};

convert.hcg.hsl = function (hcg) {
	const c = hcg[1] / 100;
	const g = hcg[2] / 100;

	const l = g * (1.0 - c) + 0.5 * c;
	let s = 0;

	if (l > 0.0 && l < 0.5) {
		s = c / (2 * l);
	} else
	if (l >= 0.5 && l < 1.0) {
		s = c / (2 * (1 - l));
	}

	return [hcg[0], s * 100, l * 100];
};

convert.hcg.hwb = function (hcg) {
	const c = hcg[1] / 100;
	const g = hcg[2] / 100;
	const v = c + g * (1.0 - c);
	return [hcg[0], (v - c) * 100, (1 - v) * 100];
};

convert.hwb.hcg = function (hwb) {
	const w = hwb[1] / 100;
	const b = hwb[2] / 100;
	const v = 1 - b;
	const c = v - w;
	let g = 0;

	if (c < 1) {
		g = (v - c) / (1 - c);
	}

	return [hwb[0], c * 100, g * 100];
};

convert.apple.rgb = function (apple) {
	return [(apple[0] / 65535) * 255, (apple[1] / 65535) * 255, (apple[2] / 65535) * 255];
};

convert.rgb.apple = function (rgb) {
	return [(rgb[0] / 255) * 65535, (rgb[1] / 255) * 65535, (rgb[2] / 255) * 65535];
};

convert.gray.rgb = function (args) {
	return [args[0] / 100 * 255, args[0] / 100 * 255, args[0] / 100 * 255];
};

convert.gray.hsl = function (args) {
	return [0, 0, args[0]];
};

convert.gray.hsv = convert.gray.hsl;

convert.gray.hwb = function (gray) {
	return [0, 100, gray[0]];
};

convert.gray.cmyk = function (gray) {
	return [0, 0, 0, gray[0]];
};

convert.gray.lab = function (gray) {
	return [gray[0], 0, 0];
};

convert.gray.hex = function (gray) {
	const val = Math.round(gray[0] / 100 * 255) & 0xFF;
	const integer = (val << 16) + (val << 8) + val;

	const string = integer.toString(16).toUpperCase();
	return '000000'.substring(string.length) + string;
};

convert.rgb.gray = function (rgb) {
	const val = (rgb[0] + rgb[1] + rgb[2]) / 3;
	return [val / 255 * 100];
};


/***/ }),

/***/ 760:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const conversions = __nccwpck_require__(520);
const route = __nccwpck_require__(547);

const convert = {};

const models = Object.keys(conversions);

function wrapRaw(fn) {
	const wrappedFn = function (...args) {
		const arg0 = args[0];
		if (arg0 === undefined || arg0 === null) {
			return arg0;
		}

		if (arg0.length > 1) {
			args = arg0;
		}

		return fn(args);
	};

	// Preserve .conversion property if there is one
	if ('conversion' in fn) {
		wrappedFn.conversion = fn.conversion;
	}

	return wrappedFn;
}

function wrapRounded(fn) {
	const wrappedFn = function (...args) {
		const arg0 = args[0];

		if (arg0 === undefined || arg0 === null) {
			return arg0;
		}

		if (arg0.length > 1) {
			args = arg0;
		}

		const result = fn(args);

		// We're assuming the result is an array here.
		// see notice in conversions.js; don't use box types
		// in conversion functions.
		if (typeof result === 'object') {
			for (let len = result.length, i = 0; i < len; i++) {
				result[i] = Math.round(result[i]);
			}
		}

		return result;
	};

	// Preserve .conversion property if there is one
	if ('conversion' in fn) {
		wrappedFn.conversion = fn.conversion;
	}

	return wrappedFn;
}

models.forEach(fromModel => {
	convert[fromModel] = {};

	Object.defineProperty(convert[fromModel], 'channels', {value: conversions[fromModel].channels});
	Object.defineProperty(convert[fromModel], 'labels', {value: conversions[fromModel].labels});

	const routes = route(fromModel);
	const routeModels = Object.keys(routes);

	routeModels.forEach(toModel => {
		const fn = routes[toModel];

		convert[fromModel][toModel] = wrapRounded(fn);
		convert[fromModel][toModel].raw = wrapRaw(fn);
	});
});

module.exports = convert;


/***/ }),

/***/ 547:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const conversions = __nccwpck_require__(520);

/*
	This function routes a model to all other models.

	all functions that are routed have a property `.conversion` attached
	to the returned synthetic function. This property is an array
	of strings, each with the steps in between the 'from' and 'to'
	color models (inclusive).

	conversions that are not possible simply are not included.
*/

function buildGraph() {
	const graph = {};
	// https://jsperf.com/object-keys-vs-for-in-with-closure/3
	const models = Object.keys(conversions);

	for (let len = models.length, i = 0; i < len; i++) {
		graph[models[i]] = {
			// http://jsperf.com/1-vs-infinity
			// micro-opt, but this is simple.
			distance: -1,
			parent: null
		};
	}

	return graph;
}

// https://en.wikipedia.org/wiki/Breadth-first_search
function deriveBFS(fromModel) {
	const graph = buildGraph();
	const queue = [fromModel]; // Unshift -> queue -> pop

	graph[fromModel].distance = 0;

	while (queue.length) {
		const current = queue.pop();
		const adjacents = Object.keys(conversions[current]);

		for (let len = adjacents.length, i = 0; i < len; i++) {
			const adjacent = adjacents[i];
			const node = graph[adjacent];

			if (node.distance === -1) {
				node.distance = graph[current].distance + 1;
				node.parent = current;
				queue.unshift(adjacent);
			}
		}
	}

	return graph;
}

function link(from, to) {
	return function (args) {
		return to(from(args));
	};
}

function wrapConversion(toModel, graph) {
	const path = [graph[toModel].parent, toModel];
	let fn = conversions[graph[toModel].parent][toModel];

	let cur = graph[toModel].parent;
	while (graph[cur].parent) {
		path.unshift(graph[cur].parent);
		fn = link(conversions[graph[cur].parent][cur], fn);
		cur = graph[cur].parent;
	}

	fn.conversion = path;
	return fn;
}

module.exports = function (fromModel) {
	const graph = deriveBFS(fromModel);
	const conversion = {};

	const models = Object.keys(graph);
	for (let len = models.length, i = 0; i < len; i++) {
		const toModel = models[i];
		const node = graph[toModel];

		if (node.parent === null) {
			// No possible conversion, or this node is the source model.
			continue;
		}

		conversion[toModel] = wrapConversion(toModel, graph);
	}

	return conversion;
};



/***/ }),

/***/ 902:
/***/ ((module) => {

"use strict";


module.exports = {
	"aliceblue": [240, 248, 255],
	"antiquewhite": [250, 235, 215],
	"aqua": [0, 255, 255],
	"aquamarine": [127, 255, 212],
	"azure": [240, 255, 255],
	"beige": [245, 245, 220],
	"bisque": [255, 228, 196],
	"black": [0, 0, 0],
	"blanchedalmond": [255, 235, 205],
	"blue": [0, 0, 255],
	"blueviolet": [138, 43, 226],
	"brown": [165, 42, 42],
	"burlywood": [222, 184, 135],
	"cadetblue": [95, 158, 160],
	"chartreuse": [127, 255, 0],
	"chocolate": [210, 105, 30],
	"coral": [255, 127, 80],
	"cornflowerblue": [100, 149, 237],
	"cornsilk": [255, 248, 220],
	"crimson": [220, 20, 60],
	"cyan": [0, 255, 255],
	"darkblue": [0, 0, 139],
	"darkcyan": [0, 139, 139],
	"darkgoldenrod": [184, 134, 11],
	"darkgray": [169, 169, 169],
	"darkgreen": [0, 100, 0],
	"darkgrey": [169, 169, 169],
	"darkkhaki": [189, 183, 107],
	"darkmagenta": [139, 0, 139],
	"darkolivegreen": [85, 107, 47],
	"darkorange": [255, 140, 0],
	"darkorchid": [153, 50, 204],
	"darkred": [139, 0, 0],
	"darksalmon": [233, 150, 122],
	"darkseagreen": [143, 188, 143],
	"darkslateblue": [72, 61, 139],
	"darkslategray": [47, 79, 79],
	"darkslategrey": [47, 79, 79],
	"darkturquoise": [0, 206, 209],
	"darkviolet": [148, 0, 211],
	"deeppink": [255, 20, 147],
	"deepskyblue": [0, 191, 255],
	"dimgray": [105, 105, 105],
	"dimgrey": [105, 105, 105],
	"dodgerblue": [30, 144, 255],
	"firebrick": [178, 34, 34],
	"floralwhite": [255, 250, 240],
	"forestgreen": [34, 139, 34],
	"fuchsia": [255, 0, 255],
	"gainsboro": [220, 220, 220],
	"ghostwhite": [248, 248, 255],
	"gold": [255, 215, 0],
	"goldenrod": [218, 165, 32],
	"gray": [128, 128, 128],
	"green": [0, 128, 0],
	"greenyellow": [173, 255, 47],
	"grey": [128, 128, 128],
	"honeydew": [240, 255, 240],
	"hotpink": [255, 105, 180],
	"indianred": [205, 92, 92],
	"indigo": [75, 0, 130],
	"ivory": [255, 255, 240],
	"khaki": [240, 230, 140],
	"lavender": [230, 230, 250],
	"lavenderblush": [255, 240, 245],
	"lawngreen": [124, 252, 0],
	"lemonchiffon": [255, 250, 205],
	"lightblue": [173, 216, 230],
	"lightcoral": [240, 128, 128],
	"lightcyan": [224, 255, 255],
	"lightgoldenrodyellow": [250, 250, 210],
	"lightgray": [211, 211, 211],
	"lightgreen": [144, 238, 144],
	"lightgrey": [211, 211, 211],
	"lightpink": [255, 182, 193],
	"lightsalmon": [255, 160, 122],
	"lightseagreen": [32, 178, 170],
	"lightskyblue": [135, 206, 250],
	"lightslategray": [119, 136, 153],
	"lightslategrey": [119, 136, 153],
	"lightsteelblue": [176, 196, 222],
	"lightyellow": [255, 255, 224],
	"lime": [0, 255, 0],
	"limegreen": [50, 205, 50],
	"linen": [250, 240, 230],
	"magenta": [255, 0, 255],
	"maroon": [128, 0, 0],
	"mediumaquamarine": [102, 205, 170],
	"mediumblue": [0, 0, 205],
	"mediumorchid": [186, 85, 211],
	"mediumpurple": [147, 112, 219],
	"mediumseagreen": [60, 179, 113],
	"mediumslateblue": [123, 104, 238],
	"mediumspringgreen": [0, 250, 154],
	"mediumturquoise": [72, 209, 204],
	"mediumvioletred": [199, 21, 133],
	"midnightblue": [25, 25, 112],
	"mintcream": [245, 255, 250],
	"mistyrose": [255, 228, 225],
	"moccasin": [255, 228, 181],
	"navajowhite": [255, 222, 173],
	"navy": [0, 0, 128],
	"oldlace": [253, 245, 230],
	"olive": [128, 128, 0],
	"olivedrab": [107, 142, 35],
	"orange": [255, 165, 0],
	"orangered": [255, 69, 0],
	"orchid": [218, 112, 214],
	"palegoldenrod": [238, 232, 170],
	"palegreen": [152, 251, 152],
	"paleturquoise": [175, 238, 238],
	"palevioletred": [219, 112, 147],
	"papayawhip": [255, 239, 213],
	"peachpuff": [255, 218, 185],
	"peru": [205, 133, 63],
	"pink": [255, 192, 203],
	"plum": [221, 160, 221],
	"powderblue": [176, 224, 230],
	"purple": [128, 0, 128],
	"rebeccapurple": [102, 51, 153],
	"red": [255, 0, 0],
	"rosybrown": [188, 143, 143],
	"royalblue": [65, 105, 225],
	"saddlebrown": [139, 69, 19],
	"salmon": [250, 128, 114],
	"sandybrown": [244, 164, 96],
	"seagreen": [46, 139, 87],
	"seashell": [255, 245, 238],
	"sienna": [160, 82, 45],
	"silver": [192, 192, 192],
	"skyblue": [135, 206, 235],
	"slateblue": [106, 90, 205],
	"slategray": [112, 128, 144],
	"slategrey": [112, 128, 144],
	"snow": [255, 250, 250],
	"springgreen": [0, 255, 127],
	"steelblue": [70, 130, 180],
	"tan": [210, 180, 140],
	"teal": [0, 128, 128],
	"thistle": [216, 191, 216],
	"tomato": [255, 99, 71],
	"turquoise": [64, 224, 208],
	"violet": [238, 130, 238],
	"wheat": [245, 222, 179],
	"white": [255, 255, 255],
	"whitesmoke": [245, 245, 245],
	"yellow": [255, 255, 0],
	"yellowgreen": [154, 205, 50]
};


/***/ }),

/***/ 854:
/***/ ((module) => {

"use strict";


module.exports = function () {
  // https://mths.be/emoji
  return /\uD83C\uDFF4\uDB40\uDC67\uDB40\uDC62(?:\uDB40\uDC65\uDB40\uDC6E\uDB40\uDC67|\uDB40\uDC73\uDB40\uDC63\uDB40\uDC74|\uDB40\uDC77\uDB40\uDC6C\uDB40\uDC73)\uDB40\uDC7F|\uD83D\uDC68(?:\uD83C\uDFFC\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68\uD83C\uDFFB|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFF\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFE])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFE\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFD])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFD\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB\uDFFC])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83D\uDC68|(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D[\uDC66\uDC67])|[\u2695\u2696\u2708]\uFE0F|\uD83D[\uDC66\uDC67]|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|(?:\uD83C\uDFFB\u200D[\u2695\u2696\u2708]|\uD83C\uDFFF\u200D[\u2695\u2696\u2708]|\uD83C\uDFFE\u200D[\u2695\u2696\u2708]|\uD83C\uDFFD\u200D[\u2695\u2696\u2708]|\uD83C\uDFFC\u200D[\u2695\u2696\u2708])\uFE0F|\uD83C\uDFFB\u200D(?:\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C[\uDFFB-\uDFFF])|(?:\uD83E\uDDD1\uD83C\uDFFB\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFC\u200D\uD83E\uDD1D\u200D\uD83D\uDC69)\uD83C\uDFFB|\uD83E\uDDD1(?:\uD83C\uDFFF\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1(?:\uD83C[\uDFFB-\uDFFF])|\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1)|(?:\uD83E\uDDD1\uD83C\uDFFE\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFF\u200D\uD83E\uDD1D\u200D(?:\uD83D[\uDC68\uDC69]))(?:\uD83C[\uDFFB-\uDFFE])|(?:\uD83E\uDDD1\uD83C\uDFFC\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFD\u200D\uD83E\uDD1D\u200D\uD83D\uDC69)(?:\uD83C[\uDFFB\uDFFC])|\uD83D\uDC69(?:\uD83C\uDFFE\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFD\uDFFF])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFC\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB\uDFFD-\uDFFF])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFB\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFC-\uDFFF])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFD\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D(?:\uD83D[\uDC68\uDC69])|\uD83D[\uDC68\uDC69])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFF\u200D(?:\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD]))|\uD83D\uDC69\u200D\uD83D\uDC69\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|(?:\uD83E\uDDD1\uD83C\uDFFD\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFE\u200D\uD83E\uDD1D\u200D\uD83D\uDC69)(?:\uD83C[\uDFFB-\uDFFD])|\uD83D\uDC69\u200D\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC69\u200D\uD83D\uDC69\u200D(?:\uD83D[\uDC66\uDC67])|(?:\uD83D\uDC41\uFE0F\u200D\uD83D\uDDE8|\uD83D\uDC69(?:\uD83C\uDFFF\u200D[\u2695\u2696\u2708]|\uD83C\uDFFE\u200D[\u2695\u2696\u2708]|\uD83C\uDFFC\u200D[\u2695\u2696\u2708]|\uD83C\uDFFB\u200D[\u2695\u2696\u2708]|\uD83C\uDFFD\u200D[\u2695\u2696\u2708]|\u200D[\u2695\u2696\u2708])|(?:(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)\uFE0F|\uD83D\uDC6F|\uD83E[\uDD3C\uDDDE\uDDDF])\u200D[\u2640\u2642]|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642]|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD6-\uDDDD])(?:(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642]|\u200D[\u2640\u2642])|\uD83C\uDFF4\u200D\u2620)\uFE0F|\uD83D\uDC69\u200D\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08|\uD83D\uDC15\u200D\uD83E\uDDBA|\uD83D\uDC69\u200D\uD83D\uDC66|\uD83D\uDC69\u200D\uD83D\uDC67|\uD83C\uDDFD\uD83C\uDDF0|\uD83C\uDDF4\uD83C\uDDF2|\uD83C\uDDF6\uD83C\uDDE6|[#\*0-9]\uFE0F\u20E3|\uD83C\uDDE7(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEF\uDDF1-\uDDF4\uDDF6-\uDDF9\uDDFB\uDDFC\uDDFE\uDDFF])|\uD83C\uDDF9(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDED\uDDEF-\uDDF4\uDDF7\uDDF9\uDDFB\uDDFC\uDDFF])|\uD83C\uDDEA(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDED\uDDF7-\uDDFA])|\uD83E\uDDD1(?:\uD83C[\uDFFB-\uDFFF])|\uD83C\uDDF7(?:\uD83C[\uDDEA\uDDF4\uDDF8\uDDFA\uDDFC])|\uD83D\uDC69(?:\uD83C[\uDFFB-\uDFFF])|\uD83C\uDDF2(?:\uD83C[\uDDE6\uDDE8-\uDDED\uDDF0-\uDDFF])|\uD83C\uDDE6(?:\uD83C[\uDDE8-\uDDEC\uDDEE\uDDF1\uDDF2\uDDF4\uDDF6-\uDDFA\uDDFC\uDDFD\uDDFF])|\uD83C\uDDF0(?:\uD83C[\uDDEA\uDDEC-\uDDEE\uDDF2\uDDF3\uDDF5\uDDF7\uDDFC\uDDFE\uDDFF])|\uD83C\uDDED(?:\uD83C[\uDDF0\uDDF2\uDDF3\uDDF7\uDDF9\uDDFA])|\uD83C\uDDE9(?:\uD83C[\uDDEA\uDDEC\uDDEF\uDDF0\uDDF2\uDDF4\uDDFF])|\uD83C\uDDFE(?:\uD83C[\uDDEA\uDDF9])|\uD83C\uDDEC(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEE\uDDF1-\uDDF3\uDDF5-\uDDFA\uDDFC\uDDFE])|\uD83C\uDDF8(?:\uD83C[\uDDE6-\uDDEA\uDDEC-\uDDF4\uDDF7-\uDDF9\uDDFB\uDDFD-\uDDFF])|\uD83C\uDDEB(?:\uD83C[\uDDEE-\uDDF0\uDDF2\uDDF4\uDDF7])|\uD83C\uDDF5(?:\uD83C[\uDDE6\uDDEA-\uDDED\uDDF0-\uDDF3\uDDF7-\uDDF9\uDDFC\uDDFE])|\uD83C\uDDFB(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDEE\uDDF3\uDDFA])|\uD83C\uDDF3(?:\uD83C[\uDDE6\uDDE8\uDDEA-\uDDEC\uDDEE\uDDF1\uDDF4\uDDF5\uDDF7\uDDFA\uDDFF])|\uD83C\uDDE8(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDEE\uDDF0-\uDDF5\uDDF7\uDDFA-\uDDFF])|\uD83C\uDDF1(?:\uD83C[\uDDE6-\uDDE8\uDDEE\uDDF0\uDDF7-\uDDFB\uDDFE])|\uD83C\uDDFF(?:\uD83C[\uDDE6\uDDF2\uDDFC])|\uD83C\uDDFC(?:\uD83C[\uDDEB\uDDF8])|\uD83C\uDDFA(?:\uD83C[\uDDE6\uDDEC\uDDF2\uDDF3\uDDF8\uDDFE\uDDFF])|\uD83C\uDDEE(?:\uD83C[\uDDE8-\uDDEA\uDDF1-\uDDF4\uDDF6-\uDDF9])|\uD83C\uDDEF(?:\uD83C[\uDDEA\uDDF2\uDDF4\uDDF5])|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD6-\uDDDD])(?:\uD83C[\uDFFB-\uDFFF])|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uD83C[\uDFFB-\uDFFF])|(?:[\u261D\u270A-\u270D]|\uD83C[\uDF85\uDFC2\uDFC7]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66\uDC67\uDC6B-\uDC6D\uDC70\uDC72\uDC74-\uDC76\uDC78\uDC7C\uDC83\uDC85\uDCAA\uDD74\uDD7A\uDD90\uDD95\uDD96\uDE4C\uDE4F\uDEC0\uDECC]|\uD83E[\uDD0F\uDD18-\uDD1C\uDD1E\uDD1F\uDD30-\uDD36\uDDB5\uDDB6\uDDBB\uDDD2-\uDDD5])(?:\uD83C[\uDFFB-\uDFFF])|(?:[\u231A\u231B\u23E9-\u23EC\u23F0\u23F3\u25FD\u25FE\u2614\u2615\u2648-\u2653\u267F\u2693\u26A1\u26AA\u26AB\u26BD\u26BE\u26C4\u26C5\u26CE\u26D4\u26EA\u26F2\u26F3\u26F5\u26FA\u26FD\u2705\u270A\u270B\u2728\u274C\u274E\u2753-\u2755\u2757\u2795-\u2797\u27B0\u27BF\u2B1B\u2B1C\u2B50\u2B55]|\uD83C[\uDC04\uDCCF\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE1A\uDE2F\uDE32-\uDE36\uDE38-\uDE3A\uDE50\uDE51\uDF00-\uDF20\uDF2D-\uDF35\uDF37-\uDF7C\uDF7E-\uDF93\uDFA0-\uDFCA\uDFCF-\uDFD3\uDFE0-\uDFF0\uDFF4\uDFF8-\uDFFF]|\uD83D[\uDC00-\uDC3E\uDC40\uDC42-\uDCFC\uDCFF-\uDD3D\uDD4B-\uDD4E\uDD50-\uDD67\uDD7A\uDD95\uDD96\uDDA4\uDDFB-\uDE4F\uDE80-\uDEC5\uDECC\uDED0-\uDED2\uDED5\uDEEB\uDEEC\uDEF4-\uDEFA\uDFE0-\uDFEB]|\uD83E[\uDD0D-\uDD3A\uDD3C-\uDD45\uDD47-\uDD71\uDD73-\uDD76\uDD7A-\uDDA2\uDDA5-\uDDAA\uDDAE-\uDDCA\uDDCD-\uDDFF\uDE70-\uDE73\uDE78-\uDE7A\uDE80-\uDE82\uDE90-\uDE95])|(?:[#\*0-9\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u231A\u231B\u2328\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2604\u260E\u2611\u2614\u2615\u2618\u261D\u2620\u2622\u2623\u2626\u262A\u262E\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u265F\u2660\u2663\u2665\u2666\u2668\u267B\u267E\u267F\u2692-\u2697\u2699\u269B\u269C\u26A0\u26A1\u26AA\u26AB\u26B0\u26B1\u26BD\u26BE\u26C4\u26C5\u26C8\u26CE\u26CF\u26D1\u26D3\u26D4\u26E9\u26EA\u26F0-\u26F5\u26F7-\u26FA\u26FD\u2702\u2705\u2708-\u270D\u270F\u2712\u2714\u2716\u271D\u2721\u2728\u2733\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763\u2764\u2795-\u2797\u27A1\u27B0\u27BF\u2934\u2935\u2B05-\u2B07\u2B1B\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|\uD83C[\uDC04\uDCCF\uDD70\uDD71\uDD7E\uDD7F\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE02\uDE1A\uDE2F\uDE32-\uDE3A\uDE50\uDE51\uDF00-\uDF21\uDF24-\uDF93\uDF96\uDF97\uDF99-\uDF9B\uDF9E-\uDFF0\uDFF3-\uDFF5\uDFF7-\uDFFF]|\uD83D[\uDC00-\uDCFD\uDCFF-\uDD3D\uDD49-\uDD4E\uDD50-\uDD67\uDD6F\uDD70\uDD73-\uDD7A\uDD87\uDD8A-\uDD8D\uDD90\uDD95\uDD96\uDDA4\uDDA5\uDDA8\uDDB1\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA-\uDE4F\uDE80-\uDEC5\uDECB-\uDED2\uDED5\uDEE0-\uDEE5\uDEE9\uDEEB\uDEEC\uDEF0\uDEF3-\uDEFA\uDFE0-\uDFEB]|\uD83E[\uDD0D-\uDD3A\uDD3C-\uDD45\uDD47-\uDD71\uDD73-\uDD76\uDD7A-\uDDA2\uDDA5-\uDDAA\uDDAE-\uDDCA\uDDCD-\uDDFF\uDE70-\uDE73\uDE78-\uDE7A\uDE80-\uDE82\uDE90-\uDE95])\uFE0F|(?:[\u261D\u26F9\u270A-\u270D]|\uD83C[\uDF85\uDFC2-\uDFC4\uDFC7\uDFCA-\uDFCC]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66-\uDC78\uDC7C\uDC81-\uDC83\uDC85-\uDC87\uDC8F\uDC91\uDCAA\uDD74\uDD75\uDD7A\uDD90\uDD95\uDD96\uDE45-\uDE47\uDE4B-\uDE4F\uDEA3\uDEB4-\uDEB6\uDEC0\uDECC]|\uD83E[\uDD0F\uDD18-\uDD1F\uDD26\uDD30-\uDD39\uDD3C-\uDD3E\uDDB5\uDDB6\uDDB8\uDDB9\uDDBB\uDDCD-\uDDCF\uDDD1-\uDDDD])/g;
};


/***/ }),

/***/ 262:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const { dirname, resolve } = __nccwpck_require__(622);
const { readdirSync, statSync } = __nccwpck_require__(747);

module.exports = function (start, callback) {
	let dir = resolve('.', start);
	let tmp, stats = statSync(dir);

	if (!stats.isDirectory()) {
		dir = dirname(dir);
	}

	while (true) {
		tmp = callback(dir, readdirSync(dir));
		if (tmp) return resolve(dir, tmp);
		dir = dirname(tmp = dir);
		if (tmp === dir) break;
	}
}


/***/ }),

/***/ 956:
/***/ ((module) => {

"use strict";

// Call this function in a another function to find out the file from
// which that function was called from. (Inspects the v8 stack trace)
//
// Inspired by http://stackoverflow.com/questions/13227489
module.exports = function getCallerFile(position) {
    if (position === void 0) { position = 2; }
    if (position >= Error.stackTraceLimit) {
        throw new TypeError('getCallerFile(position) requires position be less then Error.stackTraceLimit but position was: `' + position + '` and Error.stackTraceLimit was: `' + Error.stackTraceLimit + '`');
    }
    var oldPrepareStackTrace = Error.prepareStackTrace;
    Error.prepareStackTrace = function (_, stack) { return stack; };
    var stack = new Error().stack;
    Error.prepareStackTrace = oldPrepareStackTrace;
    if (stack !== null && typeof stack === 'object') {
        // stack[0] holds this file
        // stack[1] holds where this function was called
        // stack[2] holds the file we're interested in
        return stack[position] ? stack[position].getFileName() : undefined;
    }
};
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 710:
/***/ ((module) => {

"use strict";
/* eslint-disable yoda */


const isFullwidthCodePoint = codePoint => {
	if (Number.isNaN(codePoint)) {
		return false;
	}

	// Code points are derived from:
	// http://www.unix.org/Public/UNIDATA/EastAsianWidth.txt
	if (
		codePoint >= 0x1100 && (
			codePoint <= 0x115F || // Hangul Jamo
			codePoint === 0x2329 || // LEFT-POINTING ANGLE BRACKET
			codePoint === 0x232A || // RIGHT-POINTING ANGLE BRACKET
			// CJK Radicals Supplement .. Enclosed CJK Letters and Months
			(0x2E80 <= codePoint && codePoint <= 0x3247 && codePoint !== 0x303F) ||
			// Enclosed CJK Letters and Months .. CJK Unified Ideographs Extension A
			(0x3250 <= codePoint && codePoint <= 0x4DBF) ||
			// CJK Unified Ideographs .. Yi Radicals
			(0x4E00 <= codePoint && codePoint <= 0xA4C6) ||
			// Hangul Jamo Extended-A
			(0xA960 <= codePoint && codePoint <= 0xA97C) ||
			// Hangul Syllables
			(0xAC00 <= codePoint && codePoint <= 0xD7A3) ||
			// CJK Compatibility Ideographs
			(0xF900 <= codePoint && codePoint <= 0xFAFF) ||
			// Vertical Forms
			(0xFE10 <= codePoint && codePoint <= 0xFE19) ||
			// CJK Compatibility Forms .. Small Form Variants
			(0xFE30 <= codePoint && codePoint <= 0xFE6B) ||
			// Halfwidth and Fullwidth Forms
			(0xFF01 <= codePoint && codePoint <= 0xFF60) ||
			(0xFFE0 <= codePoint && codePoint <= 0xFFE6) ||
			// Kana Supplement
			(0x1B000 <= codePoint && codePoint <= 0x1B001) ||
			// Enclosed Ideographic Supplement
			(0x1F200 <= codePoint && codePoint <= 0x1F251) ||
			// CJK Unified Ideographs Extension B .. Tertiary Ideographic Plane
			(0x20000 <= codePoint && codePoint <= 0x3FFFD)
		)
	) {
		return true;
	}

	return false;
};

module.exports = isFullwidthCodePoint;
module.exports.default = isFullwidthCodePoint;


/***/ }),

/***/ 597:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var fs = __nccwpck_require__(747),
  join = __nccwpck_require__(622).join,
  resolve = __nccwpck_require__(622).resolve,
  dirname = __nccwpck_require__(622).dirname,
  defaultOptions = {
    extensions: ['js', 'json', 'coffee'],
    recurse: true,
    rename: function (name) {
      return name;
    },
    visit: function (obj) {
      return obj;
    }
  };

function checkFileInclusion(path, filename, options) {
  return (
    // verify file has valid extension
    (new RegExp('\\.(' + options.extensions.join('|') + ')$', 'i').test(filename)) &&

    // if options.include is a RegExp, evaluate it and make sure the path passes
    !(options.include && options.include instanceof RegExp && !options.include.test(path)) &&

    // if options.include is a function, evaluate it and make sure the path passes
    !(options.include && typeof options.include === 'function' && !options.include(path, filename)) &&

    // if options.exclude is a RegExp, evaluate it and make sure the path doesn't pass
    !(options.exclude && options.exclude instanceof RegExp && options.exclude.test(path)) &&

    // if options.exclude is a function, evaluate it and make sure the path doesn't pass
    !(options.exclude && typeof options.exclude === 'function' && options.exclude(path, filename))
  );
}

function requireDirectory(m, path, options) {
  var retval = {};

  // path is optional
  if (path && !options && typeof path !== 'string') {
    options = path;
    path = null;
  }

  // default options
  options = options || {};
  for (var prop in defaultOptions) {
    if (typeof options[prop] === 'undefined') {
      options[prop] = defaultOptions[prop];
    }
  }

  // if no path was passed in, assume the equivelant of __dirname from caller
  // otherwise, resolve path relative to the equivalent of __dirname
  path = !path ? dirname(m.filename) : resolve(dirname(m.filename), path);

  // get the path of each file in specified directory, append to current tree node, recurse
  fs.readdirSync(path).forEach(function (filename) {
    var joined = join(path, filename),
      files,
      key,
      obj;

    if (fs.statSync(joined).isDirectory() && options.recurse) {
      // this node is a directory; recurse
      files = requireDirectory(m, joined, options);
      // exclude empty directories
      if (Object.keys(files).length) {
        retval[options.rename(filename, joined, filename)] = files;
      }
    } else {
      if (joined !== m.filename && checkFileInclusion(joined, filename, options)) {
        // hash node key shouldn't include file extension
        key = filename.substring(0, filename.lastIndexOf('.'));
        obj = m.require(joined);
        retval[options.rename(key, joined, filename)] = options.visit(obj, joined, filename) || obj;
      }
    }
  });

  return retval;
}

module.exports = requireDirectory;
module.exports.defaults = defaultOptions;


/***/ }),

/***/ 974:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";

const stripAnsi = __nccwpck_require__(282);
const isFullwidthCodePoint = __nccwpck_require__(710);
const emojiRegex = __nccwpck_require__(854);

const stringWidth = string => {
	if (typeof string !== 'string' || string.length === 0) {
		return 0;
	}

	string = stripAnsi(string);

	if (string.length === 0) {
		return 0;
	}

	string = string.replace(emojiRegex(), '  ');

	let width = 0;

	for (let i = 0; i < string.length; i++) {
		const code = string.codePointAt(i);

		// Ignore control characters
		if (code <= 0x1F || (code >= 0x7F && code <= 0x9F)) {
			continue;
		}

		// Ignore combining characters
		if (code >= 0x300 && code <= 0x36F) {
			continue;
		}

		// Surrogates
		if (code > 0xFFFF) {
			i++;
		}

		width += isFullwidthCodePoint(code) ? 2 : 1;
	}

	return width;
};

module.exports = stringWidth;
// TODO: remove this in the next major version
module.exports.default = stringWidth;


/***/ }),

/***/ 282:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";

const ansiRegex = __nccwpck_require__(107);

module.exports = string => typeof string === 'string' ? string.replace(ansiRegex(), '') : string;


/***/ }),

/***/ 808:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";

const stringWidth = __nccwpck_require__(974);
const stripAnsi = __nccwpck_require__(282);
const ansiStyles = __nccwpck_require__(850);

const ESCAPES = new Set([
	'\u001B',
	'\u009B'
]);

const END_CODE = 39;

const ANSI_ESCAPE_BELL = '\u0007';
const ANSI_CSI = '[';
const ANSI_OSC = ']';
const ANSI_SGR_TERMINATOR = 'm';
const ANSI_ESCAPE_LINK = `${ANSI_OSC}8;;`;

const wrapAnsi = code => `${ESCAPES.values().next().value}${ANSI_CSI}${code}${ANSI_SGR_TERMINATOR}`;
const wrapAnsiHyperlink = uri => `${ESCAPES.values().next().value}${ANSI_ESCAPE_LINK}${uri}${ANSI_ESCAPE_BELL}`;

// Calculate the length of words split on ' ', ignoring
// the extra characters added by ansi escape codes
const wordLengths = string => string.split(' ').map(character => stringWidth(character));

// Wrap a long word across multiple rows
// Ansi escape codes do not count towards length
const wrapWord = (rows, word, columns) => {
	const characters = [...word];

	let isInsideEscape = false;
	let isInsideLinkEscape = false;
	let visible = stringWidth(stripAnsi(rows[rows.length - 1]));

	for (const [index, character] of characters.entries()) {
		const characterLength = stringWidth(character);

		if (visible + characterLength <= columns) {
			rows[rows.length - 1] += character;
		} else {
			rows.push(character);
			visible = 0;
		}

		if (ESCAPES.has(character)) {
			isInsideEscape = true;
			isInsideLinkEscape = characters.slice(index + 1).join('').startsWith(ANSI_ESCAPE_LINK);
		}

		if (isInsideEscape) {
			if (isInsideLinkEscape) {
				if (character === ANSI_ESCAPE_BELL) {
					isInsideEscape = false;
					isInsideLinkEscape = false;
				}
			} else if (character === ANSI_SGR_TERMINATOR) {
				isInsideEscape = false;
			}

			continue;
		}

		visible += characterLength;

		if (visible === columns && index < characters.length - 1) {
			rows.push('');
			visible = 0;
		}
	}

	// It's possible that the last row we copy over is only
	// ansi escape characters, handle this edge-case
	if (!visible && rows[rows.length - 1].length > 0 && rows.length > 1) {
		rows[rows.length - 2] += rows.pop();
	}
};

// Trims spaces from a string ignoring invisible sequences
const stringVisibleTrimSpacesRight = string => {
	const words = string.split(' ');
	let last = words.length;

	while (last > 0) {
		if (stringWidth(words[last - 1]) > 0) {
			break;
		}

		last--;
	}

	if (last === words.length) {
		return string;
	}

	return words.slice(0, last).join(' ') + words.slice(last).join('');
};

// The wrap-ansi module can be invoked in either 'hard' or 'soft' wrap mode
//
// 'hard' will never allow a string to take up more than columns characters
//
// 'soft' allows long words to expand past the column length
const exec = (string, columns, options = {}) => {
	if (options.trim !== false && string.trim() === '') {
		return '';
	}

	let returnValue = '';
	let escapeCode;
	let escapeUrl;

	const lengths = wordLengths(string);
	let rows = [''];

	for (const [index, word] of string.split(' ').entries()) {
		if (options.trim !== false) {
			rows[rows.length - 1] = rows[rows.length - 1].trimStart();
		}

		let rowLength = stringWidth(rows[rows.length - 1]);

		if (index !== 0) {
			if (rowLength >= columns && (options.wordWrap === false || options.trim === false)) {
				// If we start with a new word but the current row length equals the length of the columns, add a new row
				rows.push('');
				rowLength = 0;
			}

			if (rowLength > 0 || options.trim === false) {
				rows[rows.length - 1] += ' ';
				rowLength++;
			}
		}

		// In 'hard' wrap mode, the length of a line is never allowed to extend past 'columns'
		if (options.hard && lengths[index] > columns) {
			const remainingColumns = (columns - rowLength);
			const breaksStartingThisLine = 1 + Math.floor((lengths[index] - remainingColumns - 1) / columns);
			const breaksStartingNextLine = Math.floor((lengths[index] - 1) / columns);
			if (breaksStartingNextLine < breaksStartingThisLine) {
				rows.push('');
			}

			wrapWord(rows, word, columns);
			continue;
		}

		if (rowLength + lengths[index] > columns && rowLength > 0 && lengths[index] > 0) {
			if (options.wordWrap === false && rowLength < columns) {
				wrapWord(rows, word, columns);
				continue;
			}

			rows.push('');
		}

		if (rowLength + lengths[index] > columns && options.wordWrap === false) {
			wrapWord(rows, word, columns);
			continue;
		}

		rows[rows.length - 1] += word;
	}

	if (options.trim !== false) {
		rows = rows.map(stringVisibleTrimSpacesRight);
	}

	const pre = [...rows.join('\n')];

	for (const [index, character] of pre.entries()) {
		returnValue += character;

		if (ESCAPES.has(character)) {
			const {groups} = new RegExp(`(?:\\${ANSI_CSI}(?<code>\\d+)m|\\${ANSI_ESCAPE_LINK}(?<uri>.*)${ANSI_ESCAPE_BELL})`).exec(pre.slice(index).join('')) || {groups: {}};
			if (groups.code !== undefined) {
				const code = Number.parseFloat(groups.code);
				escapeCode = code === END_CODE ? undefined : code;
			} else if (groups.uri !== undefined) {
				escapeUrl = groups.uri.length === 0 ? undefined : groups.uri;
			}
		}

		const code = ansiStyles.codes.get(Number(escapeCode));

		if (pre[index + 1] === '\n') {
			if (escapeUrl) {
				returnValue += wrapAnsiHyperlink('');
			}

			if (escapeCode && code) {
				returnValue += wrapAnsi(code);
			}
		} else if (character === '\n') {
			if (escapeCode && code) {
				returnValue += wrapAnsi(escapeCode);
			}

			if (escapeUrl) {
				returnValue += wrapAnsiHyperlink(escapeUrl);
			}
		}
	}

	return returnValue;
};

// For each newline, invoke the method separately
module.exports = (string, columns, options) => {
	return String(string)
		.normalize()
		.replace(/\r\n/g, '\n')
		.split('\n')
		.map(line => exec(line, columns, options))
		.join('\n');
};


/***/ }),

/***/ 532:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const {
  applyExtends,
  cjsPlatformShim,
  Parser,
  processArgv,
} = __nccwpck_require__(10);

module.exports = {
  applyExtends: (config, cwd, mergeExtends) => {
    return applyExtends(config, cwd, mergeExtends, cjsPlatformShim);
  },
  hideBin: processArgv.hideBin,
  Parser,
};


/***/ }),

/***/ 490:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
const helpers_1 = __nccwpck_require__(532);
const yargs_1 = __importDefault(__nccwpck_require__(845));
const { argv } = yargs_1.default(helpers_1.hideBin(process.argv));
const input = (_a = argv.input) !== null && _a !== void 0 ? _a : './';
const output = (_b = argv.output) !== null && _b !== void 0 ? _b : './docs';
console.log(input, output);


/***/ }),

/***/ 41:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const align = {
    right: alignRight,
    center: alignCenter
};
const top = 0;
const right = 1;
const bottom = 2;
const left = 3;
class UI {
    constructor(opts) {
        var _a;
        this.width = opts.width;
        this.wrap = (_a = opts.wrap) !== null && _a !== void 0 ? _a : true;
        this.rows = [];
    }
    span(...args) {
        const cols = this.div(...args);
        cols.span = true;
    }
    resetOutput() {
        this.rows = [];
    }
    div(...args) {
        if (args.length === 0) {
            this.div('');
        }
        if (this.wrap && this.shouldApplyLayoutDSL(...args) && typeof args[0] === 'string') {
            return this.applyLayoutDSL(args[0]);
        }
        const cols = args.map(arg => {
            if (typeof arg === 'string') {
                return this.colFromString(arg);
            }
            return arg;
        });
        this.rows.push(cols);
        return cols;
    }
    shouldApplyLayoutDSL(...args) {
        return args.length === 1 && typeof args[0] === 'string' &&
            /[\t\n]/.test(args[0]);
    }
    applyLayoutDSL(str) {
        const rows = str.split('\n').map(row => row.split('\t'));
        let leftColumnWidth = 0;
        // simple heuristic for layout, make sure the
        // second column lines up along the left-hand.
        // don't allow the first column to take up more
        // than 50% of the screen.
        rows.forEach(columns => {
            if (columns.length > 1 && mixin.stringWidth(columns[0]) > leftColumnWidth) {
                leftColumnWidth = Math.min(Math.floor(this.width * 0.5), mixin.stringWidth(columns[0]));
            }
        });
        // generate a table:
        //  replacing ' ' with padding calculations.
        //  using the algorithmically generated width.
        rows.forEach(columns => {
            this.div(...columns.map((r, i) => {
                return {
                    text: r.trim(),
                    padding: this.measurePadding(r),
                    width: (i === 0 && columns.length > 1) ? leftColumnWidth : undefined
                };
            }));
        });
        return this.rows[this.rows.length - 1];
    }
    colFromString(text) {
        return {
            text,
            padding: this.measurePadding(text)
        };
    }
    measurePadding(str) {
        // measure padding without ansi escape codes
        const noAnsi = mixin.stripAnsi(str);
        return [0, noAnsi.match(/\s*$/)[0].length, 0, noAnsi.match(/^\s*/)[0].length];
    }
    toString() {
        const lines = [];
        this.rows.forEach(row => {
            this.rowToString(row, lines);
        });
        // don't display any lines with the
        // hidden flag set.
        return lines
            .filter(line => !line.hidden)
            .map(line => line.text)
            .join('\n');
    }
    rowToString(row, lines) {
        this.rasterize(row).forEach((rrow, r) => {
            let str = '';
            rrow.forEach((col, c) => {
                const { width } = row[c]; // the width with padding.
                const wrapWidth = this.negatePadding(row[c]); // the width without padding.
                let ts = col; // temporary string used during alignment/padding.
                if (wrapWidth > mixin.stringWidth(col)) {
                    ts += ' '.repeat(wrapWidth - mixin.stringWidth(col));
                }
                // align the string within its column.
                if (row[c].align && row[c].align !== 'left' && this.wrap) {
                    const fn = align[row[c].align];
                    ts = fn(ts, wrapWidth);
                    if (mixin.stringWidth(ts) < wrapWidth) {
                        ts += ' '.repeat((width || 0) - mixin.stringWidth(ts) - 1);
                    }
                }
                // apply border and padding to string.
                const padding = row[c].padding || [0, 0, 0, 0];
                if (padding[left]) {
                    str += ' '.repeat(padding[left]);
                }
                str += addBorder(row[c], ts, '| ');
                str += ts;
                str += addBorder(row[c], ts, ' |');
                if (padding[right]) {
                    str += ' '.repeat(padding[right]);
                }
                // if prior row is span, try to render the
                // current row on the prior line.
                if (r === 0 && lines.length > 0) {
                    str = this.renderInline(str, lines[lines.length - 1]);
                }
            });
            // remove trailing whitespace.
            lines.push({
                text: str.replace(/ +$/, ''),
                span: row.span
            });
        });
        return lines;
    }
    // if the full 'source' can render in
    // the target line, do so.
    renderInline(source, previousLine) {
        const match = source.match(/^ */);
        const leadingWhitespace = match ? match[0].length : 0;
        const target = previousLine.text;
        const targetTextWidth = mixin.stringWidth(target.trimRight());
        if (!previousLine.span) {
            return source;
        }
        // if we're not applying wrapping logic,
        // just always append to the span.
        if (!this.wrap) {
            previousLine.hidden = true;
            return target + source;
        }
        if (leadingWhitespace < targetTextWidth) {
            return source;
        }
        previousLine.hidden = true;
        return target.trimRight() + ' '.repeat(leadingWhitespace - targetTextWidth) + source.trimLeft();
    }
    rasterize(row) {
        const rrows = [];
        const widths = this.columnWidths(row);
        let wrapped;
        // word wrap all columns, and create
        // a data-structure that is easy to rasterize.
        row.forEach((col, c) => {
            // leave room for left and right padding.
            col.width = widths[c];
            if (this.wrap) {
                wrapped = mixin.wrap(col.text, this.negatePadding(col), { hard: true }).split('\n');
            }
            else {
                wrapped = col.text.split('\n');
            }
            if (col.border) {
                wrapped.unshift('.' + '-'.repeat(this.negatePadding(col) + 2) + '.');
                wrapped.push("'" + '-'.repeat(this.negatePadding(col) + 2) + "'");
            }
            // add top and bottom padding.
            if (col.padding) {
                wrapped.unshift(...new Array(col.padding[top] || 0).fill(''));
                wrapped.push(...new Array(col.padding[bottom] || 0).fill(''));
            }
            wrapped.forEach((str, r) => {
                if (!rrows[r]) {
                    rrows.push([]);
                }
                const rrow = rrows[r];
                for (let i = 0; i < c; i++) {
                    if (rrow[i] === undefined) {
                        rrow.push('');
                    }
                }
                rrow.push(str);
            });
        });
        return rrows;
    }
    negatePadding(col) {
        let wrapWidth = col.width || 0;
        if (col.padding) {
            wrapWidth -= (col.padding[left] || 0) + (col.padding[right] || 0);
        }
        if (col.border) {
            wrapWidth -= 4;
        }
        return wrapWidth;
    }
    columnWidths(row) {
        if (!this.wrap) {
            return row.map(col => {
                return col.width || mixin.stringWidth(col.text);
            });
        }
        let unset = row.length;
        let remainingWidth = this.width;
        // column widths can be set in config.
        const widths = row.map(col => {
            if (col.width) {
                unset--;
                remainingWidth -= col.width;
                return col.width;
            }
            return undefined;
        });
        // any unset widths should be calculated.
        const unsetWidth = unset ? Math.floor(remainingWidth / unset) : 0;
        return widths.map((w, i) => {
            if (w === undefined) {
                return Math.max(unsetWidth, _minWidth(row[i]));
            }
            return w;
        });
    }
}
function addBorder(col, ts, style) {
    if (col.border) {
        if (/[.']-+[.']/.test(ts)) {
            return '';
        }
        if (ts.trim().length !== 0) {
            return style;
        }
        return '  ';
    }
    return '';
}
// calculates the minimum width of
// a column, based on padding preferences.
function _minWidth(col) {
    const padding = col.padding || [];
    const minWidth = 1 + (padding[left] || 0) + (padding[right] || 0);
    if (col.border) {
        return minWidth + 4;
    }
    return minWidth;
}
function getWindowWidth() {
    /* istanbul ignore next: depends on terminal */
    if (typeof process === 'object' && process.stdout && process.stdout.columns) {
        return process.stdout.columns;
    }
    return 80;
}
function alignRight(str, width) {
    str = str.trim();
    const strWidth = mixin.stringWidth(str);
    if (strWidth < width) {
        return ' '.repeat(width - strWidth) + str;
    }
    return str;
}
function alignCenter(str, width) {
    str = str.trim();
    const strWidth = mixin.stringWidth(str);
    /* istanbul ignore next */
    if (strWidth >= width) {
        return str;
    }
    return ' '.repeat((width - strWidth) >> 1) + str;
}
let mixin;
function cliui(opts, _mixin) {
    mixin = _mixin;
    return new UI({
        width: (opts === null || opts === void 0 ? void 0 : opts.width) || getWindowWidth(),
        wrap: opts === null || opts === void 0 ? void 0 : opts.wrap
    });
}

// Bootstrap cliui with CommonJS dependencies:
const stringWidth = __nccwpck_require__(974);
const stripAnsi = __nccwpck_require__(282);
const wrap = __nccwpck_require__(808);
function ui(opts) {
    return cliui(opts, {
        stringWidth,
        stripAnsi,
        wrap
    });
}

module.exports = ui;


/***/ }),

/***/ 415:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var fs = __nccwpck_require__(747);
var util = __nccwpck_require__(669);
var path = __nccwpck_require__(622);

let shim;
class Y18N {
    constructor(opts) {
        // configurable options.
        opts = opts || {};
        this.directory = opts.directory || './locales';
        this.updateFiles = typeof opts.updateFiles === 'boolean' ? opts.updateFiles : true;
        this.locale = opts.locale || 'en';
        this.fallbackToLanguage = typeof opts.fallbackToLanguage === 'boolean' ? opts.fallbackToLanguage : true;
        // internal stuff.
        this.cache = Object.create(null);
        this.writeQueue = [];
    }
    __(...args) {
        if (typeof arguments[0] !== 'string') {
            return this._taggedLiteral(arguments[0], ...arguments);
        }
        const str = args.shift();
        let cb = function () { }; // start with noop.
        if (typeof args[args.length - 1] === 'function')
            cb = args.pop();
        cb = cb || function () { }; // noop.
        if (!this.cache[this.locale])
            this._readLocaleFile();
        // we've observed a new string, update the language file.
        if (!this.cache[this.locale][str] && this.updateFiles) {
            this.cache[this.locale][str] = str;
            // include the current directory and locale,
            // since these values could change before the
            // write is performed.
            this._enqueueWrite({
                directory: this.directory,
                locale: this.locale,
                cb
            });
        }
        else {
            cb();
        }
        return shim.format.apply(shim.format, [this.cache[this.locale][str] || str].concat(args));
    }
    __n() {
        const args = Array.prototype.slice.call(arguments);
        const singular = args.shift();
        const plural = args.shift();
        const quantity = args.shift();
        let cb = function () { }; // start with noop.
        if (typeof args[args.length - 1] === 'function')
            cb = args.pop();
        if (!this.cache[this.locale])
            this._readLocaleFile();
        let str = quantity === 1 ? singular : plural;
        if (this.cache[this.locale][singular]) {
            const entry = this.cache[this.locale][singular];
            str = entry[quantity === 1 ? 'one' : 'other'];
        }
        // we've observed a new string, update the language file.
        if (!this.cache[this.locale][singular] && this.updateFiles) {
            this.cache[this.locale][singular] = {
                one: singular,
                other: plural
            };
            // include the current directory and locale,
            // since these values could change before the
            // write is performed.
            this._enqueueWrite({
                directory: this.directory,
                locale: this.locale,
                cb
            });
        }
        else {
            cb();
        }
        // if a %d placeholder is provided, add quantity
        // to the arguments expanded by util.format.
        var values = [str];
        if (~str.indexOf('%d'))
            values.push(quantity);
        return shim.format.apply(shim.format, values.concat(args));
    }
    setLocale(locale) {
        this.locale = locale;
    }
    getLocale() {
        return this.locale;
    }
    updateLocale(obj) {
        if (!this.cache[this.locale])
            this._readLocaleFile();
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                this.cache[this.locale][key] = obj[key];
            }
        }
    }
    _taggedLiteral(parts, ...args) {
        let str = '';
        parts.forEach(function (part, i) {
            var arg = args[i + 1];
            str += part;
            if (typeof arg !== 'undefined') {
                str += '%s';
            }
        });
        return this.__.apply(this, [str].concat([].slice.call(args, 1)));
    }
    _enqueueWrite(work) {
        this.writeQueue.push(work);
        if (this.writeQueue.length === 1)
            this._processWriteQueue();
    }
    _processWriteQueue() {
        var _this = this;
        var work = this.writeQueue[0];
        // destructure the enqueued work.
        var directory = work.directory;
        var locale = work.locale;
        var cb = work.cb;
        var languageFile = this._resolveLocaleFile(directory, locale);
        var serializedLocale = JSON.stringify(this.cache[locale], null, 2);
        shim.fs.writeFile(languageFile, serializedLocale, 'utf-8', function (err) {
            _this.writeQueue.shift();
            if (_this.writeQueue.length > 0)
                _this._processWriteQueue();
            cb(err);
        });
    }
    _readLocaleFile() {
        var localeLookup = {};
        var languageFile = this._resolveLocaleFile(this.directory, this.locale);
        try {
            localeLookup = JSON.parse(shim.fs.readFileSync(languageFile, 'utf-8'));
        }
        catch (err) {
            if (err instanceof SyntaxError) {
                err.message = 'syntax error in ' + languageFile;
            }
            if (err.code === 'ENOENT')
                localeLookup = {};
            else
                throw err;
        }
        this.cache[this.locale] = localeLookup;
    }
    _resolveLocaleFile(directory, locale) {
        var file = shim.resolve(directory, './', locale + '.json');
        if (this.fallbackToLanguage && !this._fileExistsSync(file) && ~locale.lastIndexOf('_')) {
            // attempt fallback to language only
            var languageFile = shim.resolve(directory, './', locale.split('_')[0] + '.json');
            if (this._fileExistsSync(languageFile))
                file = languageFile;
        }
        return file;
    }
    _fileExistsSync(file) {
        return shim.exists(file);
    }
}
function y18n(opts, _shim) {
    shim = _shim;
    const y18n = new Y18N(opts);
    return {
        __: y18n.__.bind(y18n),
        __n: y18n.__n.bind(y18n),
        setLocale: y18n.setLocale.bind(y18n),
        getLocale: y18n.getLocale.bind(y18n),
        updateLocale: y18n.updateLocale.bind(y18n),
        locale: y18n.locale
    };
}

var nodePlatformShim = {
    fs: {
        readFileSync: fs.readFileSync,
        writeFile: fs.writeFile
    },
    format: util.format,
    resolve: path.resolve,
    exists: (file) => {
        try {
            return fs.statSync(file).isFile();
        }
        catch (err) {
            return false;
        }
    }
};

const y18n$1 = (opts) => {
    return y18n(opts, nodePlatformShim);
};

module.exports = y18n$1;


/***/ }),

/***/ 661:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var util = __nccwpck_require__(669);
var fs = __nccwpck_require__(747);
var path = __nccwpck_require__(622);

function camelCase(str) {
    const isCamelCase = str !== str.toLowerCase() && str !== str.toUpperCase();
    if (!isCamelCase) {
        str = str.toLocaleLowerCase();
    }
    if (str.indexOf('-') === -1 && str.indexOf('_') === -1) {
        return str;
    }
    else {
        let camelcase = '';
        let nextChrUpper = false;
        const leadingHyphens = str.match(/^-+/);
        for (let i = leadingHyphens ? leadingHyphens[0].length : 0; i < str.length; i++) {
            let chr = str.charAt(i);
            if (nextChrUpper) {
                nextChrUpper = false;
                chr = chr.toLocaleUpperCase();
            }
            if (i !== 0 && (chr === '-' || chr === '_')) {
                nextChrUpper = true;
            }
            else if (chr !== '-' && chr !== '_') {
                camelcase += chr;
            }
        }
        return camelcase;
    }
}
function decamelize(str, joinString) {
    const lowercase = str.toLocaleLowerCase();
    joinString = joinString || '-';
    let notCamelcase = '';
    for (let i = 0; i < str.length; i++) {
        const chrLower = lowercase.charAt(i);
        const chrString = str.charAt(i);
        if (chrLower !== chrString && i > 0) {
            notCamelcase += `${joinString}${lowercase.charAt(i)}`;
        }
        else {
            notCamelcase += chrString;
        }
    }
    return notCamelcase;
}
function looksLikeNumber(x) {
    if (x === null || x === undefined)
        return false;
    if (typeof x === 'number')
        return true;
    if (/^0x[0-9a-f]+$/i.test(x))
        return true;
    if (x.length > 1 && x[0] === '0')
        return false;
    return /^[-]?(?:\d+(?:\.\d*)?|\.\d+)(e[-+]?\d+)?$/.test(x);
}

function tokenizeArgString(argString) {
    if (Array.isArray(argString)) {
        return argString.map(e => typeof e !== 'string' ? e + '' : e);
    }
    argString = argString.trim();
    let i = 0;
    let prevC = null;
    let c = null;
    let opening = null;
    const args = [];
    for (let ii = 0; ii < argString.length; ii++) {
        prevC = c;
        c = argString.charAt(ii);
        if (c === ' ' && !opening) {
            if (!(prevC === ' ')) {
                i++;
            }
            continue;
        }
        if (c === opening) {
            opening = null;
        }
        else if ((c === "'" || c === '"') && !opening) {
            opening = c;
        }
        if (!args[i])
            args[i] = '';
        args[i] += c;
    }
    return args;
}

let mixin;
class YargsParser {
    constructor(_mixin) {
        mixin = _mixin;
    }
    parse(argsInput, options) {
        const opts = Object.assign({
            alias: undefined,
            array: undefined,
            boolean: undefined,
            config: undefined,
            configObjects: undefined,
            configuration: undefined,
            coerce: undefined,
            count: undefined,
            default: undefined,
            envPrefix: undefined,
            narg: undefined,
            normalize: undefined,
            string: undefined,
            number: undefined,
            __: undefined,
            key: undefined
        }, options);
        const args = tokenizeArgString(argsInput);
        const aliases = combineAliases(Object.assign(Object.create(null), opts.alias));
        const configuration = Object.assign({
            'boolean-negation': true,
            'camel-case-expansion': true,
            'combine-arrays': false,
            'dot-notation': true,
            'duplicate-arguments-array': true,
            'flatten-duplicate-arrays': true,
            'greedy-arrays': true,
            'halt-at-non-option': false,
            'nargs-eats-options': false,
            'negation-prefix': 'no-',
            'parse-numbers': true,
            'parse-positional-numbers': true,
            'populate--': false,
            'set-placeholder-key': false,
            'short-option-groups': true,
            'strip-aliased': false,
            'strip-dashed': false,
            'unknown-options-as-args': false
        }, opts.configuration);
        const defaults = Object.assign(Object.create(null), opts.default);
        const configObjects = opts.configObjects || [];
        const envPrefix = opts.envPrefix;
        const notFlagsOption = configuration['populate--'];
        const notFlagsArgv = notFlagsOption ? '--' : '_';
        const newAliases = Object.create(null);
        const defaulted = Object.create(null);
        const __ = opts.__ || mixin.format;
        const flags = {
            aliases: Object.create(null),
            arrays: Object.create(null),
            bools: Object.create(null),
            strings: Object.create(null),
            numbers: Object.create(null),
            counts: Object.create(null),
            normalize: Object.create(null),
            configs: Object.create(null),
            nargs: Object.create(null),
            coercions: Object.create(null),
            keys: []
        };
        const negative = /^-([0-9]+(\.[0-9]+)?|\.[0-9]+)$/;
        const negatedBoolean = new RegExp('^--' + configuration['negation-prefix'] + '(.+)');
        [].concat(opts.array || []).filter(Boolean).forEach(function (opt) {
            const key = typeof opt === 'object' ? opt.key : opt;
            const assignment = Object.keys(opt).map(function (key) {
                const arrayFlagKeys = {
                    boolean: 'bools',
                    string: 'strings',
                    number: 'numbers'
                };
                return arrayFlagKeys[key];
            }).filter(Boolean).pop();
            if (assignment) {
                flags[assignment][key] = true;
            }
            flags.arrays[key] = true;
            flags.keys.push(key);
        });
        [].concat(opts.boolean || []).filter(Boolean).forEach(function (key) {
            flags.bools[key] = true;
            flags.keys.push(key);
        });
        [].concat(opts.string || []).filter(Boolean).forEach(function (key) {
            flags.strings[key] = true;
            flags.keys.push(key);
        });
        [].concat(opts.number || []).filter(Boolean).forEach(function (key) {
            flags.numbers[key] = true;
            flags.keys.push(key);
        });
        [].concat(opts.count || []).filter(Boolean).forEach(function (key) {
            flags.counts[key] = true;
            flags.keys.push(key);
        });
        [].concat(opts.normalize || []).filter(Boolean).forEach(function (key) {
            flags.normalize[key] = true;
            flags.keys.push(key);
        });
        if (typeof opts.narg === 'object') {
            Object.entries(opts.narg).forEach(([key, value]) => {
                if (typeof value === 'number') {
                    flags.nargs[key] = value;
                    flags.keys.push(key);
                }
            });
        }
        if (typeof opts.coerce === 'object') {
            Object.entries(opts.coerce).forEach(([key, value]) => {
                if (typeof value === 'function') {
                    flags.coercions[key] = value;
                    flags.keys.push(key);
                }
            });
        }
        if (typeof opts.config !== 'undefined') {
            if (Array.isArray(opts.config) || typeof opts.config === 'string') {
                [].concat(opts.config).filter(Boolean).forEach(function (key) {
                    flags.configs[key] = true;
                });
            }
            else if (typeof opts.config === 'object') {
                Object.entries(opts.config).forEach(([key, value]) => {
                    if (typeof value === 'boolean' || typeof value === 'function') {
                        flags.configs[key] = value;
                    }
                });
            }
        }
        extendAliases(opts.key, aliases, opts.default, flags.arrays);
        Object.keys(defaults).forEach(function (key) {
            (flags.aliases[key] || []).forEach(function (alias) {
                defaults[alias] = defaults[key];
            });
        });
        let error = null;
        checkConfiguration();
        let notFlags = [];
        const argv = Object.assign(Object.create(null), { _: [] });
        const argvReturn = {};
        for (let i = 0; i < args.length; i++) {
            const arg = args[i];
            let broken;
            let key;
            let letters;
            let m;
            let next;
            let value;
            if (arg !== '--' && isUnknownOptionAsArg(arg)) {
                pushPositional(arg);
            }
            else if (arg.match(/---+(=|$)/)) {
                pushPositional(arg);
                continue;
            }
            else if (arg.match(/^--.+=/) || (!configuration['short-option-groups'] && arg.match(/^-.+=/))) {
                m = arg.match(/^--?([^=]+)=([\s\S]*)$/);
                if (m !== null && Array.isArray(m) && m.length >= 3) {
                    if (checkAllAliases(m[1], flags.arrays)) {
                        i = eatArray(i, m[1], args, m[2]);
                    }
                    else if (checkAllAliases(m[1], flags.nargs) !== false) {
                        i = eatNargs(i, m[1], args, m[2]);
                    }
                    else {
                        setArg(m[1], m[2]);
                    }
                }
            }
            else if (arg.match(negatedBoolean) && configuration['boolean-negation']) {
                m = arg.match(negatedBoolean);
                if (m !== null && Array.isArray(m) && m.length >= 2) {
                    key = m[1];
                    setArg(key, checkAllAliases(key, flags.arrays) ? [false] : false);
                }
            }
            else if (arg.match(/^--.+/) || (!configuration['short-option-groups'] && arg.match(/^-[^-]+/))) {
                m = arg.match(/^--?(.+)/);
                if (m !== null && Array.isArray(m) && m.length >= 2) {
                    key = m[1];
                    if (checkAllAliases(key, flags.arrays)) {
                        i = eatArray(i, key, args);
                    }
                    else if (checkAllAliases(key, flags.nargs) !== false) {
                        i = eatNargs(i, key, args);
                    }
                    else {
                        next = args[i + 1];
                        if (next !== undefined && (!next.match(/^-/) ||
                            next.match(negative)) &&
                            !checkAllAliases(key, flags.bools) &&
                            !checkAllAliases(key, flags.counts)) {
                            setArg(key, next);
                            i++;
                        }
                        else if (/^(true|false)$/.test(next)) {
                            setArg(key, next);
                            i++;
                        }
                        else {
                            setArg(key, defaultValue(key));
                        }
                    }
                }
            }
            else if (arg.match(/^-.\..+=/)) {
                m = arg.match(/^-([^=]+)=([\s\S]*)$/);
                if (m !== null && Array.isArray(m) && m.length >= 3) {
                    setArg(m[1], m[2]);
                }
            }
            else if (arg.match(/^-.\..+/) && !arg.match(negative)) {
                next = args[i + 1];
                m = arg.match(/^-(.\..+)/);
                if (m !== null && Array.isArray(m) && m.length >= 2) {
                    key = m[1];
                    if (next !== undefined && !next.match(/^-/) &&
                        !checkAllAliases(key, flags.bools) &&
                        !checkAllAliases(key, flags.counts)) {
                        setArg(key, next);
                        i++;
                    }
                    else {
                        setArg(key, defaultValue(key));
                    }
                }
            }
            else if (arg.match(/^-[^-]+/) && !arg.match(negative)) {
                letters = arg.slice(1, -1).split('');
                broken = false;
                for (let j = 0; j < letters.length; j++) {
                    next = arg.slice(j + 2);
                    if (letters[j + 1] && letters[j + 1] === '=') {
                        value = arg.slice(j + 3);
                        key = letters[j];
                        if (checkAllAliases(key, flags.arrays)) {
                            i = eatArray(i, key, args, value);
                        }
                        else if (checkAllAliases(key, flags.nargs) !== false) {
                            i = eatNargs(i, key, args, value);
                        }
                        else {
                            setArg(key, value);
                        }
                        broken = true;
                        break;
                    }
                    if (next === '-') {
                        setArg(letters[j], next);
                        continue;
                    }
                    if (/[A-Za-z]/.test(letters[j]) &&
                        /^-?\d+(\.\d*)?(e-?\d+)?$/.test(next) &&
                        checkAllAliases(next, flags.bools) === false) {
                        setArg(letters[j], next);
                        broken = true;
                        break;
                    }
                    if (letters[j + 1] && letters[j + 1].match(/\W/)) {
                        setArg(letters[j], next);
                        broken = true;
                        break;
                    }
                    else {
                        setArg(letters[j], defaultValue(letters[j]));
                    }
                }
                key = arg.slice(-1)[0];
                if (!broken && key !== '-') {
                    if (checkAllAliases(key, flags.arrays)) {
                        i = eatArray(i, key, args);
                    }
                    else if (checkAllAliases(key, flags.nargs) !== false) {
                        i = eatNargs(i, key, args);
                    }
                    else {
                        next = args[i + 1];
                        if (next !== undefined && (!/^(-|--)[^-]/.test(next) ||
                            next.match(negative)) &&
                            !checkAllAliases(key, flags.bools) &&
                            !checkAllAliases(key, flags.counts)) {
                            setArg(key, next);
                            i++;
                        }
                        else if (/^(true|false)$/.test(next)) {
                            setArg(key, next);
                            i++;
                        }
                        else {
                            setArg(key, defaultValue(key));
                        }
                    }
                }
            }
            else if (arg.match(/^-[0-9]$/) &&
                arg.match(negative) &&
                checkAllAliases(arg.slice(1), flags.bools)) {
                key = arg.slice(1);
                setArg(key, defaultValue(key));
            }
            else if (arg === '--') {
                notFlags = args.slice(i + 1);
                break;
            }
            else if (configuration['halt-at-non-option']) {
                notFlags = args.slice(i);
                break;
            }
            else {
                pushPositional(arg);
            }
        }
        applyEnvVars(argv, true);
        applyEnvVars(argv, false);
        setConfig(argv);
        setConfigObjects();
        applyDefaultsAndAliases(argv, flags.aliases, defaults, true);
        applyCoercions(argv);
        if (configuration['set-placeholder-key'])
            setPlaceholderKeys(argv);
        Object.keys(flags.counts).forEach(function (key) {
            if (!hasKey(argv, key.split('.')))
                setArg(key, 0);
        });
        if (notFlagsOption && notFlags.length)
            argv[notFlagsArgv] = [];
        notFlags.forEach(function (key) {
            argv[notFlagsArgv].push(key);
        });
        if (configuration['camel-case-expansion'] && configuration['strip-dashed']) {
            Object.keys(argv).filter(key => key !== '--' && key.includes('-')).forEach(key => {
                delete argv[key];
            });
        }
        if (configuration['strip-aliased']) {
            [].concat(...Object.keys(aliases).map(k => aliases[k])).forEach(alias => {
                if (configuration['camel-case-expansion'] && alias.includes('-')) {
                    delete argv[alias.split('.').map(prop => camelCase(prop)).join('.')];
                }
                delete argv[alias];
            });
        }
        function pushPositional(arg) {
            const maybeCoercedNumber = maybeCoerceNumber('_', arg);
            if (typeof maybeCoercedNumber === 'string' || typeof maybeCoercedNumber === 'number') {
                argv._.push(maybeCoercedNumber);
            }
        }
        function eatNargs(i, key, args, argAfterEqualSign) {
            let ii;
            let toEat = checkAllAliases(key, flags.nargs);
            toEat = typeof toEat !== 'number' || isNaN(toEat) ? 1 : toEat;
            if (toEat === 0) {
                if (!isUndefined(argAfterEqualSign)) {
                    error = Error(__('Argument unexpected for: %s', key));
                }
                setArg(key, defaultValue(key));
                return i;
            }
            let available = isUndefined(argAfterEqualSign) ? 0 : 1;
            if (configuration['nargs-eats-options']) {
                if (args.length - (i + 1) + available < toEat) {
                    error = Error(__('Not enough arguments following: %s', key));
                }
                available = toEat;
            }
            else {
                for (ii = i + 1; ii < args.length; ii++) {
                    if (!args[ii].match(/^-[^0-9]/) || args[ii].match(negative) || isUnknownOptionAsArg(args[ii]))
                        available++;
                    else
                        break;
                }
                if (available < toEat)
                    error = Error(__('Not enough arguments following: %s', key));
            }
            let consumed = Math.min(available, toEat);
            if (!isUndefined(argAfterEqualSign) && consumed > 0) {
                setArg(key, argAfterEqualSign);
                consumed--;
            }
            for (ii = i + 1; ii < (consumed + i + 1); ii++) {
                setArg(key, args[ii]);
            }
            return (i + consumed);
        }
        function eatArray(i, key, args, argAfterEqualSign) {
            let argsToSet = [];
            let next = argAfterEqualSign || args[i + 1];
            const nargsCount = checkAllAliases(key, flags.nargs);
            if (checkAllAliases(key, flags.bools) && !(/^(true|false)$/.test(next))) {
                argsToSet.push(true);
            }
            else if (isUndefined(next) ||
                (isUndefined(argAfterEqualSign) && /^-/.test(next) && !negative.test(next) && !isUnknownOptionAsArg(next))) {
                if (defaults[key] !== undefined) {
                    const defVal = defaults[key];
                    argsToSet = Array.isArray(defVal) ? defVal : [defVal];
                }
            }
            else {
                if (!isUndefined(argAfterEqualSign)) {
                    argsToSet.push(processValue(key, argAfterEqualSign));
                }
                for (let ii = i + 1; ii < args.length; ii++) {
                    if ((!configuration['greedy-arrays'] && argsToSet.length > 0) ||
                        (nargsCount && typeof nargsCount === 'number' && argsToSet.length >= nargsCount))
                        break;
                    next = args[ii];
                    if (/^-/.test(next) && !negative.test(next) && !isUnknownOptionAsArg(next))
                        break;
                    i = ii;
                    argsToSet.push(processValue(key, next));
                }
            }
            if (typeof nargsCount === 'number' && ((nargsCount && argsToSet.length < nargsCount) ||
                (isNaN(nargsCount) && argsToSet.length === 0))) {
                error = Error(__('Not enough arguments following: %s', key));
            }
            setArg(key, argsToSet);
            return i;
        }
        function setArg(key, val) {
            if (/-/.test(key) && configuration['camel-case-expansion']) {
                const alias = key.split('.').map(function (prop) {
                    return camelCase(prop);
                }).join('.');
                addNewAlias(key, alias);
            }
            const value = processValue(key, val);
            const splitKey = key.split('.');
            setKey(argv, splitKey, value);
            if (flags.aliases[key]) {
                flags.aliases[key].forEach(function (x) {
                    const keyProperties = x.split('.');
                    setKey(argv, keyProperties, value);
                });
            }
            if (splitKey.length > 1 && configuration['dot-notation']) {
                (flags.aliases[splitKey[0]] || []).forEach(function (x) {
                    let keyProperties = x.split('.');
                    const a = [].concat(splitKey);
                    a.shift();
                    keyProperties = keyProperties.concat(a);
                    if (!(flags.aliases[key] || []).includes(keyProperties.join('.'))) {
                        setKey(argv, keyProperties, value);
                    }
                });
            }
            if (checkAllAliases(key, flags.normalize) && !checkAllAliases(key, flags.arrays)) {
                const keys = [key].concat(flags.aliases[key] || []);
                keys.forEach(function (key) {
                    Object.defineProperty(argvReturn, key, {
                        enumerable: true,
                        get() {
                            return val;
                        },
                        set(value) {
                            val = typeof value === 'string' ? mixin.normalize(value) : value;
                        }
                    });
                });
            }
        }
        function addNewAlias(key, alias) {
            if (!(flags.aliases[key] && flags.aliases[key].length)) {
                flags.aliases[key] = [alias];
                newAliases[alias] = true;
            }
            if (!(flags.aliases[alias] && flags.aliases[alias].length)) {
                addNewAlias(alias, key);
            }
        }
        function processValue(key, val) {
            if (typeof val === 'string' &&
                (val[0] === "'" || val[0] === '"') &&
                val[val.length - 1] === val[0]) {
                val = val.substring(1, val.length - 1);
            }
            if (checkAllAliases(key, flags.bools) || checkAllAliases(key, flags.counts)) {
                if (typeof val === 'string')
                    val = val === 'true';
            }
            let value = Array.isArray(val)
                ? val.map(function (v) { return maybeCoerceNumber(key, v); })
                : maybeCoerceNumber(key, val);
            if (checkAllAliases(key, flags.counts) && (isUndefined(value) || typeof value === 'boolean')) {
                value = increment();
            }
            if (checkAllAliases(key, flags.normalize) && checkAllAliases(key, flags.arrays)) {
                if (Array.isArray(val))
                    value = val.map((val) => { return mixin.normalize(val); });
                else
                    value = mixin.normalize(val);
            }
            return value;
        }
        function maybeCoerceNumber(key, value) {
            if (!configuration['parse-positional-numbers'] && key === '_')
                return value;
            if (!checkAllAliases(key, flags.strings) && !checkAllAliases(key, flags.bools) && !Array.isArray(value)) {
                const shouldCoerceNumber = looksLikeNumber(value) && configuration['parse-numbers'] && (Number.isSafeInteger(Math.floor(parseFloat(`${value}`))));
                if (shouldCoerceNumber || (!isUndefined(value) && checkAllAliases(key, flags.numbers))) {
                    value = Number(value);
                }
            }
            return value;
        }
        function setConfig(argv) {
            const configLookup = Object.create(null);
            applyDefaultsAndAliases(configLookup, flags.aliases, defaults);
            Object.keys(flags.configs).forEach(function (configKey) {
                const configPath = argv[configKey] || configLookup[configKey];
                if (configPath) {
                    try {
                        let config = null;
                        const resolvedConfigPath = mixin.resolve(mixin.cwd(), configPath);
                        const resolveConfig = flags.configs[configKey];
                        if (typeof resolveConfig === 'function') {
                            try {
                                config = resolveConfig(resolvedConfigPath);
                            }
                            catch (e) {
                                config = e;
                            }
                            if (config instanceof Error) {
                                error = config;
                                return;
                            }
                        }
                        else {
                            config = mixin.require(resolvedConfigPath);
                        }
                        setConfigObject(config);
                    }
                    catch (ex) {
                        if (ex.name === 'PermissionDenied')
                            error = ex;
                        else if (argv[configKey])
                            error = Error(__('Invalid JSON config file: %s', configPath));
                    }
                }
            });
        }
        function setConfigObject(config, prev) {
            Object.keys(config).forEach(function (key) {
                const value = config[key];
                const fullKey = prev ? prev + '.' + key : key;
                if (typeof value === 'object' && value !== null && !Array.isArray(value) && configuration['dot-notation']) {
                    setConfigObject(value, fullKey);
                }
                else {
                    if (!hasKey(argv, fullKey.split('.')) || (checkAllAliases(fullKey, flags.arrays) && configuration['combine-arrays'])) {
                        setArg(fullKey, value);
                    }
                }
            });
        }
        function setConfigObjects() {
            if (typeof configObjects !== 'undefined') {
                configObjects.forEach(function (configObject) {
                    setConfigObject(configObject);
                });
            }
        }
        function applyEnvVars(argv, configOnly) {
            if (typeof envPrefix === 'undefined')
                return;
            const prefix = typeof envPrefix === 'string' ? envPrefix : '';
            const env = mixin.env();
            Object.keys(env).forEach(function (envVar) {
                if (prefix === '' || envVar.lastIndexOf(prefix, 0) === 0) {
                    const keys = envVar.split('__').map(function (key, i) {
                        if (i === 0) {
                            key = key.substring(prefix.length);
                        }
                        return camelCase(key);
                    });
                    if (((configOnly && flags.configs[keys.join('.')]) || !configOnly) && !hasKey(argv, keys)) {
                        setArg(keys.join('.'), env[envVar]);
                    }
                }
            });
        }
        function applyCoercions(argv) {
            let coerce;
            const applied = new Set();
            Object.keys(argv).forEach(function (key) {
                if (!applied.has(key)) {
                    coerce = checkAllAliases(key, flags.coercions);
                    if (typeof coerce === 'function') {
                        try {
                            const value = maybeCoerceNumber(key, coerce(argv[key]));
                            ([].concat(flags.aliases[key] || [], key)).forEach(ali => {
                                applied.add(ali);
                                argv[ali] = value;
                            });
                        }
                        catch (err) {
                            error = err;
                        }
                    }
                }
            });
        }
        function setPlaceholderKeys(argv) {
            flags.keys.forEach((key) => {
                if (~key.indexOf('.'))
                    return;
                if (typeof argv[key] === 'undefined')
                    argv[key] = undefined;
            });
            return argv;
        }
        function applyDefaultsAndAliases(obj, aliases, defaults, canLog = false) {
            Object.keys(defaults).forEach(function (key) {
                if (!hasKey(obj, key.split('.'))) {
                    setKey(obj, key.split('.'), defaults[key]);
                    if (canLog)
                        defaulted[key] = true;
                    (aliases[key] || []).forEach(function (x) {
                        if (hasKey(obj, x.split('.')))
                            return;
                        setKey(obj, x.split('.'), defaults[key]);
                    });
                }
            });
        }
        function hasKey(obj, keys) {
            let o = obj;
            if (!configuration['dot-notation'])
                keys = [keys.join('.')];
            keys.slice(0, -1).forEach(function (key) {
                o = (o[key] || {});
            });
            const key = keys[keys.length - 1];
            if (typeof o !== 'object')
                return false;
            else
                return key in o;
        }
        function setKey(obj, keys, value) {
            let o = obj;
            if (!configuration['dot-notation'])
                keys = [keys.join('.')];
            keys.slice(0, -1).forEach(function (key) {
                key = sanitizeKey(key);
                if (typeof o === 'object' && o[key] === undefined) {
                    o[key] = {};
                }
                if (typeof o[key] !== 'object' || Array.isArray(o[key])) {
                    if (Array.isArray(o[key])) {
                        o[key].push({});
                    }
                    else {
                        o[key] = [o[key], {}];
                    }
                    o = o[key][o[key].length - 1];
                }
                else {
                    o = o[key];
                }
            });
            const key = sanitizeKey(keys[keys.length - 1]);
            const isTypeArray = checkAllAliases(keys.join('.'), flags.arrays);
            const isValueArray = Array.isArray(value);
            let duplicate = configuration['duplicate-arguments-array'];
            if (!duplicate && checkAllAliases(key, flags.nargs)) {
                duplicate = true;
                if ((!isUndefined(o[key]) && flags.nargs[key] === 1) || (Array.isArray(o[key]) && o[key].length === flags.nargs[key])) {
                    o[key] = undefined;
                }
            }
            if (value === increment()) {
                o[key] = increment(o[key]);
            }
            else if (Array.isArray(o[key])) {
                if (duplicate && isTypeArray && isValueArray) {
                    o[key] = configuration['flatten-duplicate-arrays'] ? o[key].concat(value) : (Array.isArray(o[key][0]) ? o[key] : [o[key]]).concat([value]);
                }
                else if (!duplicate && Boolean(isTypeArray) === Boolean(isValueArray)) {
                    o[key] = value;
                }
                else {
                    o[key] = o[key].concat([value]);
                }
            }
            else if (o[key] === undefined && isTypeArray) {
                o[key] = isValueArray ? value : [value];
            }
            else if (duplicate && !(o[key] === undefined ||
                checkAllAliases(key, flags.counts) ||
                checkAllAliases(key, flags.bools))) {
                o[key] = [o[key], value];
            }
            else {
                o[key] = value;
            }
        }
        function extendAliases(...args) {
            args.forEach(function (obj) {
                Object.keys(obj || {}).forEach(function (key) {
                    if (flags.aliases[key])
                        return;
                    flags.aliases[key] = [].concat(aliases[key] || []);
                    flags.aliases[key].concat(key).forEach(function (x) {
                        if (/-/.test(x) && configuration['camel-case-expansion']) {
                            const c = camelCase(x);
                            if (c !== key && flags.aliases[key].indexOf(c) === -1) {
                                flags.aliases[key].push(c);
                                newAliases[c] = true;
                            }
                        }
                    });
                    flags.aliases[key].concat(key).forEach(function (x) {
                        if (x.length > 1 && /[A-Z]/.test(x) && configuration['camel-case-expansion']) {
                            const c = decamelize(x, '-');
                            if (c !== key && flags.aliases[key].indexOf(c) === -1) {
                                flags.aliases[key].push(c);
                                newAliases[c] = true;
                            }
                        }
                    });
                    flags.aliases[key].forEach(function (x) {
                        flags.aliases[x] = [key].concat(flags.aliases[key].filter(function (y) {
                            return x !== y;
                        }));
                    });
                });
            });
        }
        function checkAllAliases(key, flag) {
            const toCheck = [].concat(flags.aliases[key] || [], key);
            const keys = Object.keys(flag);
            const setAlias = toCheck.find(key => keys.includes(key));
            return setAlias ? flag[setAlias] : false;
        }
        function hasAnyFlag(key) {
            const flagsKeys = Object.keys(flags);
            const toCheck = [].concat(flagsKeys.map(k => flags[k]));
            return toCheck.some(function (flag) {
                return Array.isArray(flag) ? flag.includes(key) : flag[key];
            });
        }
        function hasFlagsMatching(arg, ...patterns) {
            const toCheck = [].concat(...patterns);
            return toCheck.some(function (pattern) {
                const match = arg.match(pattern);
                return match && hasAnyFlag(match[1]);
            });
        }
        function hasAllShortFlags(arg) {
            if (arg.match(negative) || !arg.match(/^-[^-]+/)) {
                return false;
            }
            let hasAllFlags = true;
            let next;
            const letters = arg.slice(1).split('');
            for (let j = 0; j < letters.length; j++) {
                next = arg.slice(j + 2);
                if (!hasAnyFlag(letters[j])) {
                    hasAllFlags = false;
                    break;
                }
                if ((letters[j + 1] && letters[j + 1] === '=') ||
                    next === '-' ||
                    (/[A-Za-z]/.test(letters[j]) && /^-?\d+(\.\d*)?(e-?\d+)?$/.test(next)) ||
                    (letters[j + 1] && letters[j + 1].match(/\W/))) {
                    break;
                }
            }
            return hasAllFlags;
        }
        function isUnknownOptionAsArg(arg) {
            return configuration['unknown-options-as-args'] && isUnknownOption(arg);
        }
        function isUnknownOption(arg) {
            if (arg.match(negative)) {
                return false;
            }
            if (hasAllShortFlags(arg)) {
                return false;
            }
            const flagWithEquals = /^-+([^=]+?)=[\s\S]*$/;
            const normalFlag = /^-+([^=]+?)$/;
            const flagEndingInHyphen = /^-+([^=]+?)-$/;
            const flagEndingInDigits = /^-+([^=]+?\d+)$/;
            const flagEndingInNonWordCharacters = /^-+([^=]+?)\W+.*$/;
            return !hasFlagsMatching(arg, flagWithEquals, negatedBoolean, normalFlag, flagEndingInHyphen, flagEndingInDigits, flagEndingInNonWordCharacters);
        }
        function defaultValue(key) {
            if (!checkAllAliases(key, flags.bools) &&
                !checkAllAliases(key, flags.counts) &&
                `${key}` in defaults) {
                return defaults[key];
            }
            else {
                return defaultForType(guessType(key));
            }
        }
        function defaultForType(type) {
            const def = {
                boolean: true,
                string: '',
                number: undefined,
                array: []
            };
            return def[type];
        }
        function guessType(key) {
            let type = 'boolean';
            if (checkAllAliases(key, flags.strings))
                type = 'string';
            else if (checkAllAliases(key, flags.numbers))
                type = 'number';
            else if (checkAllAliases(key, flags.bools))
                type = 'boolean';
            else if (checkAllAliases(key, flags.arrays))
                type = 'array';
            return type;
        }
        function isUndefined(num) {
            return num === undefined;
        }
        function checkConfiguration() {
            Object.keys(flags.counts).find(key => {
                if (checkAllAliases(key, flags.arrays)) {
                    error = Error(__('Invalid configuration: %s, opts.count excludes opts.array.', key));
                    return true;
                }
                else if (checkAllAliases(key, flags.nargs)) {
                    error = Error(__('Invalid configuration: %s, opts.count excludes opts.narg.', key));
                    return true;
                }
                return false;
            });
        }
        return {
            aliases: Object.assign({}, flags.aliases),
            argv: Object.assign(argvReturn, argv),
            configuration: configuration,
            defaulted: Object.assign({}, defaulted),
            error: error,
            newAliases: Object.assign({}, newAliases)
        };
    }
}
function combineAliases(aliases) {
    const aliasArrays = [];
    const combined = Object.create(null);
    let change = true;
    Object.keys(aliases).forEach(function (key) {
        aliasArrays.push([].concat(aliases[key], key));
    });
    while (change) {
        change = false;
        for (let i = 0; i < aliasArrays.length; i++) {
            for (let ii = i + 1; ii < aliasArrays.length; ii++) {
                const intersect = aliasArrays[i].filter(function (v) {
                    return aliasArrays[ii].indexOf(v) !== -1;
                });
                if (intersect.length) {
                    aliasArrays[i] = aliasArrays[i].concat(aliasArrays[ii]);
                    aliasArrays.splice(ii, 1);
                    change = true;
                    break;
                }
            }
        }
    }
    aliasArrays.forEach(function (aliasArray) {
        aliasArray = aliasArray.filter(function (v, i, self) {
            return self.indexOf(v) === i;
        });
        const lastAlias = aliasArray.pop();
        if (lastAlias !== undefined && typeof lastAlias === 'string') {
            combined[lastAlias] = aliasArray;
        }
    });
    return combined;
}
function increment(orig) {
    return orig !== undefined ? orig + 1 : 1;
}
function sanitizeKey(key) {
    if (key === '__proto__')
        return '___proto___';
    return key;
}

const minNodeVersion = (process && process.env && process.env.YARGS_MIN_NODE_VERSION)
    ? Number(process.env.YARGS_MIN_NODE_VERSION)
    : 10;
if (process && process.version) {
    const major = Number(process.version.match(/v([^.]+)/)[1]);
    if (major < minNodeVersion) {
        throw Error(`yargs parser supports a minimum Node.js version of ${minNodeVersion}. Read our version support policy: https://github.com/yargs/yargs-parser#supported-nodejs-versions`);
    }
}
const env = process ? process.env : {};
const parser = new YargsParser({
    cwd: process.cwd,
    env: () => {
        return env;
    },
    format: util.format,
    normalize: path.normalize,
    resolve: path.resolve,
    require: (path) => {
        if (true) {
            return __nccwpck_require__(222)(path);
        }
        else {}
    }
});
const yargsParser = function Parser(args, opts) {
    const result = parser.parse(args.slice(), opts);
    return result.argv;
};
yargsParser.detailed = function (args, opts) {
    return parser.parse(args.slice(), opts);
};
yargsParser.camelCase = camelCase;
yargsParser.decamelize = decamelize;
yargsParser.looksLikeNumber = looksLikeNumber;

module.exports = yargsParser;


/***/ }),

/***/ 10:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var assert = __nccwpck_require__(357);

class YError extends Error {
    constructor(msg) {
        super(msg || 'yargs error');
        this.name = 'YError';
        Error.captureStackTrace(this, YError);
    }
}

let previouslyVisitedConfigs = [];
let shim;
function applyExtends(config, cwd, mergeExtends, _shim) {
    shim = _shim;
    let defaultConfig = {};
    if (Object.prototype.hasOwnProperty.call(config, 'extends')) {
        if (typeof config.extends !== 'string')
            return defaultConfig;
        const isPath = /\.json|\..*rc$/.test(config.extends);
        let pathToDefault = null;
        if (!isPath) {
            try {
                pathToDefault = /*require.resolve*/(__nccwpck_require__(404).resolve(config.extends));
            }
            catch (_err) {
                return config;
            }
        }
        else {
            pathToDefault = getPathToDefaultConfig(cwd, config.extends);
        }
        checkForCircularExtends(pathToDefault);
        previouslyVisitedConfigs.push(pathToDefault);
        defaultConfig = isPath
            ? JSON.parse(shim.readFileSync(pathToDefault, 'utf8'))
            : __nccwpck_require__(404)(config.extends);
        delete config.extends;
        defaultConfig = applyExtends(defaultConfig, shim.path.dirname(pathToDefault), mergeExtends, shim);
    }
    previouslyVisitedConfigs = [];
    return mergeExtends
        ? mergeDeep(defaultConfig, config)
        : Object.assign({}, defaultConfig, config);
}
function checkForCircularExtends(cfgPath) {
    if (previouslyVisitedConfigs.indexOf(cfgPath) > -1) {
        throw new YError(`Circular extended configurations: '${cfgPath}'.`);
    }
}
function getPathToDefaultConfig(cwd, pathToExtend) {
    return shim.path.resolve(cwd, pathToExtend);
}
function mergeDeep(config1, config2) {
    const target = {};
    function isObject(obj) {
        return obj && typeof obj === 'object' && !Array.isArray(obj);
    }
    Object.assign(target, config1);
    for (const key of Object.keys(config2)) {
        if (isObject(config2[key]) && isObject(target[key])) {
            target[key] = mergeDeep(config1[key], config2[key]);
        }
        else {
            target[key] = config2[key];
        }
    }
    return target;
}

function parseCommand(cmd) {
    const extraSpacesStrippedCommand = cmd.replace(/\s{2,}/g, ' ');
    const splitCommand = extraSpacesStrippedCommand.split(/\s+(?![^[]*]|[^<]*>)/);
    const bregex = /\.*[\][<>]/g;
    const firstCommand = splitCommand.shift();
    if (!firstCommand)
        throw new Error(`No command found in: ${cmd}`);
    const parsedCommand = {
        cmd: firstCommand.replace(bregex, ''),
        demanded: [],
        optional: [],
    };
    splitCommand.forEach((cmd, i) => {
        let variadic = false;
        cmd = cmd.replace(/\s/g, '');
        if (/\.+[\]>]/.test(cmd) && i === splitCommand.length - 1)
            variadic = true;
        if (/^\[/.test(cmd)) {
            parsedCommand.optional.push({
                cmd: cmd.replace(bregex, '').split('|'),
                variadic,
            });
        }
        else {
            parsedCommand.demanded.push({
                cmd: cmd.replace(bregex, '').split('|'),
                variadic,
            });
        }
    });
    return parsedCommand;
}

const positionName = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth'];
function argsert(arg1, arg2, arg3) {
    function parseArgs() {
        return typeof arg1 === 'object'
            ? [{ demanded: [], optional: [] }, arg1, arg2]
            : [
                parseCommand(`cmd ${arg1}`),
                arg2,
                arg3,
            ];
    }
    try {
        let position = 0;
        const [parsed, callerArguments, _length] = parseArgs();
        const args = [].slice.call(callerArguments);
        while (args.length && args[args.length - 1] === undefined)
            args.pop();
        const length = _length || args.length;
        if (length < parsed.demanded.length) {
            throw new YError(`Not enough arguments provided. Expected ${parsed.demanded.length} but received ${args.length}.`);
        }
        const totalCommands = parsed.demanded.length + parsed.optional.length;
        if (length > totalCommands) {
            throw new YError(`Too many arguments provided. Expected max ${totalCommands} but received ${length}.`);
        }
        parsed.demanded.forEach(demanded => {
            const arg = args.shift();
            const observedType = guessType(arg);
            const matchingTypes = demanded.cmd.filter(type => type === observedType || type === '*');
            if (matchingTypes.length === 0)
                argumentTypeError(observedType, demanded.cmd, position);
            position += 1;
        });
        parsed.optional.forEach(optional => {
            if (args.length === 0)
                return;
            const arg = args.shift();
            const observedType = guessType(arg);
            const matchingTypes = optional.cmd.filter(type => type === observedType || type === '*');
            if (matchingTypes.length === 0)
                argumentTypeError(observedType, optional.cmd, position);
            position += 1;
        });
    }
    catch (err) {
        console.warn(err.stack);
    }
}
function guessType(arg) {
    if (Array.isArray(arg)) {
        return 'array';
    }
    else if (arg === null) {
        return 'null';
    }
    return typeof arg;
}
function argumentTypeError(observedType, allowedTypes, position) {
    throw new YError(`Invalid ${positionName[position] || 'manyith'} argument. Expected ${allowedTypes.join(' or ')} but received ${observedType}.`);
}

function isPromise(maybePromise) {
    return (!!maybePromise &&
        !!maybePromise.then &&
        typeof maybePromise.then === 'function');
}

function assertNotStrictEqual(actual, expected, shim, message) {
    shim.assert.notStrictEqual(actual, expected, message);
}
function assertSingleKey(actual, shim) {
    shim.assert.strictEqual(typeof actual, 'string');
}
function objectKeys(object) {
    return Object.keys(object);
}

function objFilter(original = {}, filter = () => true) {
    const obj = {};
    objectKeys(original).forEach(key => {
        if (filter(key, original[key])) {
            obj[key] = original[key];
        }
    });
    return obj;
}

function globalMiddlewareFactory(globalMiddleware, context) {
    return function (callback, applyBeforeValidation = false) {
        argsert('<array|function> [boolean]', [callback, applyBeforeValidation], arguments.length);
        if (Array.isArray(callback)) {
            for (let i = 0; i < callback.length; i++) {
                if (typeof callback[i] !== 'function') {
                    throw Error('middleware must be a function');
                }
                callback[i].applyBeforeValidation = applyBeforeValidation;
            }
            Array.prototype.push.apply(globalMiddleware, callback);
        }
        else if (typeof callback === 'function') {
            callback.applyBeforeValidation = applyBeforeValidation;
            globalMiddleware.push(callback);
        }
        return context;
    };
}
function commandMiddlewareFactory(commandMiddleware) {
    if (!commandMiddleware)
        return [];
    return commandMiddleware.map(middleware => {
        middleware.applyBeforeValidation = false;
        return middleware;
    });
}
function applyMiddleware(argv, yargs, middlewares, beforeValidation) {
    const beforeValidationError = new Error('middleware cannot return a promise when applyBeforeValidation is true');
    return middlewares.reduce((acc, middleware) => {
        if (middleware.applyBeforeValidation !== beforeValidation) {
            return acc;
        }
        if (isPromise(acc)) {
            return acc
                .then(initialObj => Promise.all([
                initialObj,
                middleware(initialObj, yargs),
            ]))
                .then(([initialObj, middlewareObj]) => Object.assign(initialObj, middlewareObj));
        }
        else {
            const result = middleware(acc, yargs);
            if (beforeValidation && isPromise(result))
                throw beforeValidationError;
            return isPromise(result)
                ? result.then(middlewareObj => Object.assign(acc, middlewareObj))
                : Object.assign(acc, result);
        }
    }, argv);
}

function getProcessArgvBinIndex() {
    if (isBundledElectronApp())
        return 0;
    return 1;
}
function isBundledElectronApp() {
    return isElectronApp() && !process.defaultApp;
}
function isElectronApp() {
    return !!process.versions.electron;
}
function hideBin(argv) {
    return argv.slice(getProcessArgvBinIndex() + 1);
}
function getProcessArgvBin() {
    return process.argv[getProcessArgvBinIndex()];
}

var processArgv = /*#__PURE__*/Object.freeze({
  __proto__: null,
  hideBin: hideBin,
  getProcessArgvBin: getProcessArgvBin
});

function whichModule(exported) {
    if (false)
        {}
    for (let i = 0, files = Object.keys(__nccwpck_require__.c), mod; i < files.length; i++) {
        mod = __nccwpck_require__.c[files[i]];
        if (mod.exports === exported)
            return mod;
    }
    return null;
}

const DEFAULT_MARKER = /(^\*)|(^\$0)/;
function command(yargs, usage, validation, globalMiddleware = [], shim) {
    const self = {};
    let handlers = {};
    let aliasMap = {};
    let defaultCommand;
    self.addHandler = function addHandler(cmd, description, builder, handler, commandMiddleware, deprecated) {
        let aliases = [];
        const middlewares = commandMiddlewareFactory(commandMiddleware);
        handler = handler || (() => { });
        if (Array.isArray(cmd)) {
            if (isCommandAndAliases(cmd)) {
                [cmd, ...aliases] = cmd;
            }
            else {
                for (const command of cmd) {
                    self.addHandler(command);
                }
            }
        }
        else if (isCommandHandlerDefinition(cmd)) {
            let command = Array.isArray(cmd.command) || typeof cmd.command === 'string'
                ? cmd.command
                : moduleName(cmd);
            if (cmd.aliases)
                command = [].concat(command).concat(cmd.aliases);
            self.addHandler(command, extractDesc(cmd), cmd.builder, cmd.handler, cmd.middlewares, cmd.deprecated);
            return;
        }
        else if (isCommandBuilderDefinition(builder)) {
            self.addHandler([cmd].concat(aliases), description, builder.builder, builder.handler, builder.middlewares, builder.deprecated);
            return;
        }
        if (typeof cmd === 'string') {
            const parsedCommand = parseCommand(cmd);
            aliases = aliases.map(alias => parseCommand(alias).cmd);
            let isDefault = false;
            const parsedAliases = [parsedCommand.cmd].concat(aliases).filter(c => {
                if (DEFAULT_MARKER.test(c)) {
                    isDefault = true;
                    return false;
                }
                return true;
            });
            if (parsedAliases.length === 0 && isDefault)
                parsedAliases.push('$0');
            if (isDefault) {
                parsedCommand.cmd = parsedAliases[0];
                aliases = parsedAliases.slice(1);
                cmd = cmd.replace(DEFAULT_MARKER, parsedCommand.cmd);
            }
            aliases.forEach(alias => {
                aliasMap[alias] = parsedCommand.cmd;
            });
            if (description !== false) {
                usage.command(cmd, description, isDefault, aliases, deprecated);
            }
            handlers[parsedCommand.cmd] = {
                original: cmd,
                description,
                handler,
                builder: builder || {},
                middlewares,
                deprecated,
                demanded: parsedCommand.demanded,
                optional: parsedCommand.optional,
            };
            if (isDefault)
                defaultCommand = handlers[parsedCommand.cmd];
        }
    };
    self.addDirectory = function addDirectory(dir, context, req, callerFile, opts) {
        opts = opts || {};
        if (typeof opts.recurse !== 'boolean')
            opts.recurse = false;
        if (!Array.isArray(opts.extensions))
            opts.extensions = ['js'];
        const parentVisit = typeof opts.visit === 'function' ? opts.visit : (o) => o;
        opts.visit = function visit(obj, joined, filename) {
            const visited = parentVisit(obj, joined, filename);
            if (visited) {
                if (~context.files.indexOf(joined))
                    return visited;
                context.files.push(joined);
                self.addHandler(visited);
            }
            return visited;
        };
        shim.requireDirectory({ require: req, filename: callerFile }, dir, opts);
    };
    function moduleName(obj) {
        const mod = whichModule(obj);
        if (!mod)
            throw new Error(`No command name given for module: ${shim.inspect(obj)}`);
        return commandFromFilename(mod.filename);
    }
    function commandFromFilename(filename) {
        return shim.path.basename(filename, shim.path.extname(filename));
    }
    function extractDesc({ describe, description, desc, }) {
        for (const test of [describe, description, desc]) {
            if (typeof test === 'string' || test === false)
                return test;
            assertNotStrictEqual(test, true, shim);
        }
        return false;
    }
    self.getCommands = () => Object.keys(handlers).concat(Object.keys(aliasMap));
    self.getCommandHandlers = () => handlers;
    self.hasDefaultCommand = () => !!defaultCommand;
    self.runCommand = function runCommand(command, yargs, parsed, commandIndex) {
        let aliases = parsed.aliases;
        const commandHandler = handlers[command] || handlers[aliasMap[command]] || defaultCommand;
        const currentContext = yargs.getContext();
        let numFiles = currentContext.files.length;
        const parentCommands = currentContext.commands.slice();
        let innerArgv = parsed.argv;
        let positionalMap = {};
        if (command) {
            currentContext.commands.push(command);
            currentContext.fullCommands.push(commandHandler.original);
        }
        const builder = commandHandler.builder;
        if (isCommandBuilderCallback(builder)) {
            const builderOutput = builder(yargs.reset(parsed.aliases));
            const innerYargs = isYargsInstance(builderOutput) ? builderOutput : yargs;
            if (shouldUpdateUsage(innerYargs)) {
                innerYargs
                    .getUsageInstance()
                    .usage(usageFromParentCommandsCommandHandler(parentCommands, commandHandler), commandHandler.description);
            }
            innerArgv = innerYargs._parseArgs(null, null, true, commandIndex);
            aliases = innerYargs.parsed.aliases;
        }
        else if (isCommandBuilderOptionDefinitions(builder)) {
            const innerYargs = yargs.reset(parsed.aliases);
            if (shouldUpdateUsage(innerYargs)) {
                innerYargs
                    .getUsageInstance()
                    .usage(usageFromParentCommandsCommandHandler(parentCommands, commandHandler), commandHandler.description);
            }
            Object.keys(commandHandler.builder).forEach(key => {
                innerYargs.option(key, builder[key]);
            });
            innerArgv = innerYargs._parseArgs(null, null, true, commandIndex);
            aliases = innerYargs.parsed.aliases;
        }
        if (!yargs._hasOutput()) {
            positionalMap = populatePositionals(commandHandler, innerArgv, currentContext);
        }
        const middlewares = globalMiddleware
            .slice(0)
            .concat(commandHandler.middlewares);
        applyMiddleware(innerArgv, yargs, middlewares, true);
        if (!yargs._hasOutput()) {
            yargs._runValidation(innerArgv, aliases, positionalMap, yargs.parsed.error, !command);
        }
        if (commandHandler.handler && !yargs._hasOutput()) {
            yargs._setHasOutput();
            const populateDoubleDash = !!yargs.getOptions().configuration['populate--'];
            yargs._postProcess(innerArgv, populateDoubleDash);
            innerArgv = applyMiddleware(innerArgv, yargs, middlewares, false);
            let handlerResult;
            if (isPromise(innerArgv)) {
                handlerResult = innerArgv.then(argv => commandHandler.handler(argv));
            }
            else {
                handlerResult = commandHandler.handler(innerArgv);
            }
            const handlerFinishCommand = yargs.getHandlerFinishCommand();
            if (isPromise(handlerResult)) {
                yargs.getUsageInstance().cacheHelpMessage();
                handlerResult
                    .then(value => {
                    if (handlerFinishCommand) {
                        handlerFinishCommand(value);
                    }
                })
                    .catch(error => {
                    try {
                        yargs.getUsageInstance().fail(null, error);
                    }
                    catch (err) {
                    }
                })
                    .then(() => {
                    yargs.getUsageInstance().clearCachedHelpMessage();
                });
            }
            else {
                if (handlerFinishCommand) {
                    handlerFinishCommand(handlerResult);
                }
            }
        }
        if (command) {
            currentContext.commands.pop();
            currentContext.fullCommands.pop();
        }
        numFiles = currentContext.files.length - numFiles;
        if (numFiles > 0)
            currentContext.files.splice(numFiles * -1, numFiles);
        return innerArgv;
    };
    function shouldUpdateUsage(yargs) {
        return (!yargs.getUsageInstance().getUsageDisabled() &&
            yargs.getUsageInstance().getUsage().length === 0);
    }
    function usageFromParentCommandsCommandHandler(parentCommands, commandHandler) {
        const c = DEFAULT_MARKER.test(commandHandler.original)
            ? commandHandler.original.replace(DEFAULT_MARKER, '').trim()
            : commandHandler.original;
        const pc = parentCommands.filter(c => {
            return !DEFAULT_MARKER.test(c);
        });
        pc.push(c);
        return `$0 ${pc.join(' ')}`;
    }
    self.runDefaultBuilderOn = function (yargs) {
        assertNotStrictEqual(defaultCommand, undefined, shim);
        if (shouldUpdateUsage(yargs)) {
            const commandString = DEFAULT_MARKER.test(defaultCommand.original)
                ? defaultCommand.original
                : defaultCommand.original.replace(/^[^[\]<>]*/, '$0 ');
            yargs.getUsageInstance().usage(commandString, defaultCommand.description);
        }
        const builder = defaultCommand.builder;
        if (isCommandBuilderCallback(builder)) {
            builder(yargs);
        }
        else if (!isCommandBuilderDefinition(builder)) {
            Object.keys(builder).forEach(key => {
                yargs.option(key, builder[key]);
            });
        }
    };
    function populatePositionals(commandHandler, argv, context) {
        argv._ = argv._.slice(context.commands.length);
        const demanded = commandHandler.demanded.slice(0);
        const optional = commandHandler.optional.slice(0);
        const positionalMap = {};
        validation.positionalCount(demanded.length, argv._.length);
        while (demanded.length) {
            const demand = demanded.shift();
            populatePositional(demand, argv, positionalMap);
        }
        while (optional.length) {
            const maybe = optional.shift();
            populatePositional(maybe, argv, positionalMap);
        }
        argv._ = context.commands.concat(argv._.map(a => '' + a));
        postProcessPositionals(argv, positionalMap, self.cmdToParseOptions(commandHandler.original));
        return positionalMap;
    }
    function populatePositional(positional, argv, positionalMap) {
        const cmd = positional.cmd[0];
        if (positional.variadic) {
            positionalMap[cmd] = argv._.splice(0).map(String);
        }
        else {
            if (argv._.length)
                positionalMap[cmd] = [String(argv._.shift())];
        }
    }
    function postProcessPositionals(argv, positionalMap, parseOptions) {
        const options = Object.assign({}, yargs.getOptions());
        options.default = Object.assign(parseOptions.default, options.default);
        for (const key of Object.keys(parseOptions.alias)) {
            options.alias[key] = (options.alias[key] || []).concat(parseOptions.alias[key]);
        }
        options.array = options.array.concat(parseOptions.array);
        options.config = {};
        const unparsed = [];
        Object.keys(positionalMap).forEach(key => {
            positionalMap[key].map(value => {
                if (options.configuration['unknown-options-as-args'])
                    options.key[key] = true;
                unparsed.push(`--${key}`);
                unparsed.push(value);
            });
        });
        if (!unparsed.length)
            return;
        const config = Object.assign({}, options.configuration, {
            'populate--': true,
        });
        const parsed = shim.Parser.detailed(unparsed, Object.assign({}, options, {
            configuration: config,
        }));
        if (parsed.error) {
            yargs.getUsageInstance().fail(parsed.error.message, parsed.error);
        }
        else {
            const positionalKeys = Object.keys(positionalMap);
            Object.keys(positionalMap).forEach(key => {
                positionalKeys.push(...parsed.aliases[key]);
            });
            Object.keys(parsed.argv).forEach(key => {
                if (positionalKeys.indexOf(key) !== -1) {
                    if (!positionalMap[key])
                        positionalMap[key] = parsed.argv[key];
                    argv[key] = parsed.argv[key];
                }
            });
        }
    }
    self.cmdToParseOptions = function (cmdString) {
        const parseOptions = {
            array: [],
            default: {},
            alias: {},
            demand: {},
        };
        const parsed = parseCommand(cmdString);
        parsed.demanded.forEach(d => {
            const [cmd, ...aliases] = d.cmd;
            if (d.variadic) {
                parseOptions.array.push(cmd);
                parseOptions.default[cmd] = [];
            }
            parseOptions.alias[cmd] = aliases;
            parseOptions.demand[cmd] = true;
        });
        parsed.optional.forEach(o => {
            const [cmd, ...aliases] = o.cmd;
            if (o.variadic) {
                parseOptions.array.push(cmd);
                parseOptions.default[cmd] = [];
            }
            parseOptions.alias[cmd] = aliases;
        });
        return parseOptions;
    };
    self.reset = () => {
        handlers = {};
        aliasMap = {};
        defaultCommand = undefined;
        return self;
    };
    const frozens = [];
    self.freeze = () => {
        frozens.push({
            handlers,
            aliasMap,
            defaultCommand,
        });
    };
    self.unfreeze = () => {
        const frozen = frozens.pop();
        assertNotStrictEqual(frozen, undefined, shim);
        ({ handlers, aliasMap, defaultCommand } = frozen);
    };
    return self;
}
function isCommandBuilderDefinition(builder) {
    return (typeof builder === 'object' &&
        !!builder.builder &&
        typeof builder.handler === 'function');
}
function isCommandAndAliases(cmd) {
    if (cmd.every(c => typeof c === 'string')) {
        return true;
    }
    else {
        return false;
    }
}
function isCommandBuilderCallback(builder) {
    return typeof builder === 'function';
}
function isCommandBuilderOptionDefinitions(builder) {
    return typeof builder === 'object';
}
function isCommandHandlerDefinition(cmd) {
    return typeof cmd === 'object' && !Array.isArray(cmd);
}

function setBlocking(blocking) {
    if (typeof process === 'undefined')
        return;
    [process.stdout, process.stderr].forEach(_stream => {
        const stream = _stream;
        if (stream._handle &&
            stream.isTTY &&
            typeof stream._handle.setBlocking === 'function') {
            stream._handle.setBlocking(blocking);
        }
    });
}

function usage(yargs, y18n, shim) {
    const __ = y18n.__;
    const self = {};
    const fails = [];
    self.failFn = function failFn(f) {
        fails.push(f);
    };
    let failMessage = null;
    let showHelpOnFail = true;
    self.showHelpOnFail = function showHelpOnFailFn(arg1 = true, arg2) {
        function parseFunctionArgs() {
            return typeof arg1 === 'string' ? [true, arg1] : [arg1, arg2];
        }
        const [enabled, message] = parseFunctionArgs();
        failMessage = message;
        showHelpOnFail = enabled;
        return self;
    };
    let failureOutput = false;
    self.fail = function fail(msg, err) {
        const logger = yargs._getLoggerInstance();
        if (fails.length) {
            for (let i = fails.length - 1; i >= 0; --i) {
                fails[i](msg, err, self);
            }
        }
        else {
            if (yargs.getExitProcess())
                setBlocking(true);
            if (!failureOutput) {
                failureOutput = true;
                if (showHelpOnFail) {
                    yargs.showHelp('error');
                    logger.error();
                }
                if (msg || err)
                    logger.error(msg || err);
                if (failMessage) {
                    if (msg || err)
                        logger.error('');
                    logger.error(failMessage);
                }
            }
            err = err || new YError(msg);
            if (yargs.getExitProcess()) {
                return yargs.exit(1);
            }
            else if (yargs._hasParseCallback()) {
                return yargs.exit(1, err);
            }
            else {
                throw err;
            }
        }
    };
    let usages = [];
    let usageDisabled = false;
    self.usage = (msg, description) => {
        if (msg === null) {
            usageDisabled = true;
            usages = [];
            return self;
        }
        usageDisabled = false;
        usages.push([msg, description || '']);
        return self;
    };
    self.getUsage = () => {
        return usages;
    };
    self.getUsageDisabled = () => {
        return usageDisabled;
    };
    self.getPositionalGroupName = () => {
        return __('Positionals:');
    };
    let examples = [];
    self.example = (cmd, description) => {
        examples.push([cmd, description || '']);
    };
    let commands = [];
    self.command = function command(cmd, description, isDefault, aliases, deprecated = false) {
        if (isDefault) {
            commands = commands.map(cmdArray => {
                cmdArray[2] = false;
                return cmdArray;
            });
        }
        commands.push([cmd, description || '', isDefault, aliases, deprecated]);
    };
    self.getCommands = () => commands;
    let descriptions = {};
    self.describe = function describe(keyOrKeys, desc) {
        if (Array.isArray(keyOrKeys)) {
            keyOrKeys.forEach(k => {
                self.describe(k, desc);
            });
        }
        else if (typeof keyOrKeys === 'object') {
            Object.keys(keyOrKeys).forEach(k => {
                self.describe(k, keyOrKeys[k]);
            });
        }
        else {
            descriptions[keyOrKeys] = desc;
        }
    };
    self.getDescriptions = () => descriptions;
    let epilogs = [];
    self.epilog = msg => {
        epilogs.push(msg);
    };
    let wrapSet = false;
    let wrap;
    self.wrap = cols => {
        wrapSet = true;
        wrap = cols;
    };
    function getWrap() {
        if (!wrapSet) {
            wrap = windowWidth();
            wrapSet = true;
        }
        return wrap;
    }
    const deferY18nLookupPrefix = '__yargsString__:';
    self.deferY18nLookup = str => deferY18nLookupPrefix + str;
    self.help = function help() {
        if (cachedHelpMessage)
            return cachedHelpMessage;
        normalizeAliases();
        const base$0 = yargs.customScriptName
            ? yargs.$0
            : shim.path.basename(yargs.$0);
        const demandedOptions = yargs.getDemandedOptions();
        const demandedCommands = yargs.getDemandedCommands();
        const deprecatedOptions = yargs.getDeprecatedOptions();
        const groups = yargs.getGroups();
        const options = yargs.getOptions();
        let keys = [];
        keys = keys.concat(Object.keys(descriptions));
        keys = keys.concat(Object.keys(demandedOptions));
        keys = keys.concat(Object.keys(demandedCommands));
        keys = keys.concat(Object.keys(options.default));
        keys = keys.filter(filterHiddenOptions);
        keys = Object.keys(keys.reduce((acc, key) => {
            if (key !== '_')
                acc[key] = true;
            return acc;
        }, {}));
        const theWrap = getWrap();
        const ui = shim.cliui({
            width: theWrap,
            wrap: !!theWrap,
        });
        if (!usageDisabled) {
            if (usages.length) {
                usages.forEach(usage => {
                    ui.div(`${usage[0].replace(/\$0/g, base$0)}`);
                    if (usage[1]) {
                        ui.div({ text: `${usage[1]}`, padding: [1, 0, 0, 0] });
                    }
                });
                ui.div();
            }
            else if (commands.length) {
                let u = null;
                if (demandedCommands._) {
                    u = `${base$0} <${__('command')}>\n`;
                }
                else {
                    u = `${base$0} [${__('command')}]\n`;
                }
                ui.div(`${u}`);
            }
        }
        if (commands.length) {
            ui.div(__('Commands:'));
            const context = yargs.getContext();
            const parentCommands = context.commands.length
                ? `${context.commands.join(' ')} `
                : '';
            if (yargs.getParserConfiguration()['sort-commands'] === true) {
                commands = commands.sort((a, b) => a[0].localeCompare(b[0]));
            }
            commands.forEach(command => {
                const commandString = `${base$0} ${parentCommands}${command[0].replace(/^\$0 ?/, '')}`;
                ui.span({
                    text: commandString,
                    padding: [0, 2, 0, 2],
                    width: maxWidth(commands, theWrap, `${base$0}${parentCommands}`) + 4,
                }, { text: command[1] });
                const hints = [];
                if (command[2])
                    hints.push(`[${__('default')}]`);
                if (command[3] && command[3].length) {
                    hints.push(`[${__('aliases:')} ${command[3].join(', ')}]`);
                }
                if (command[4]) {
                    if (typeof command[4] === 'string') {
                        hints.push(`[${__('deprecated: %s', command[4])}]`);
                    }
                    else {
                        hints.push(`[${__('deprecated')}]`);
                    }
                }
                if (hints.length) {
                    ui.div({
                        text: hints.join(' '),
                        padding: [0, 0, 0, 2],
                        align: 'right',
                    });
                }
                else {
                    ui.div();
                }
            });
            ui.div();
        }
        const aliasKeys = (Object.keys(options.alias) || []).concat(Object.keys(yargs.parsed.newAliases) || []);
        keys = keys.filter(key => !yargs.parsed.newAliases[key] &&
            aliasKeys.every(alias => (options.alias[alias] || []).indexOf(key) === -1));
        const defaultGroup = __('Options:');
        if (!groups[defaultGroup])
            groups[defaultGroup] = [];
        addUngroupedKeys(keys, options.alias, groups, defaultGroup);
        const isLongSwitch = (sw) => /^--/.test(getText(sw));
        const displayedGroups = Object.keys(groups)
            .filter(groupName => groups[groupName].length > 0)
            .map(groupName => {
            const normalizedKeys = groups[groupName]
                .filter(filterHiddenOptions)
                .map(key => {
                if (~aliasKeys.indexOf(key))
                    return key;
                for (let i = 0, aliasKey; (aliasKey = aliasKeys[i]) !== undefined; i++) {
                    if (~(options.alias[aliasKey] || []).indexOf(key))
                        return aliasKey;
                }
                return key;
            });
            return { groupName, normalizedKeys };
        })
            .filter(({ normalizedKeys }) => normalizedKeys.length > 0)
            .map(({ groupName, normalizedKeys }) => {
            const switches = normalizedKeys.reduce((acc, key) => {
                acc[key] = [key]
                    .concat(options.alias[key] || [])
                    .map(sw => {
                    if (groupName === self.getPositionalGroupName())
                        return sw;
                    else {
                        return ((/^[0-9]$/.test(sw)
                            ? ~options.boolean.indexOf(key)
                                ? '-'
                                : '--'
                            : sw.length > 1
                                ? '--'
                                : '-') + sw);
                    }
                })
                    .sort((sw1, sw2) => isLongSwitch(sw1) === isLongSwitch(sw2)
                    ? 0
                    : isLongSwitch(sw1)
                        ? 1
                        : -1)
                    .join(', ');
                return acc;
            }, {});
            return { groupName, normalizedKeys, switches };
        });
        const shortSwitchesUsed = displayedGroups
            .filter(({ groupName }) => groupName !== self.getPositionalGroupName())
            .some(({ normalizedKeys, switches }) => !normalizedKeys.every(key => isLongSwitch(switches[key])));
        if (shortSwitchesUsed) {
            displayedGroups
                .filter(({ groupName }) => groupName !== self.getPositionalGroupName())
                .forEach(({ normalizedKeys, switches }) => {
                normalizedKeys.forEach(key => {
                    if (isLongSwitch(switches[key])) {
                        switches[key] = addIndentation(switches[key], '-x, '.length);
                    }
                });
            });
        }
        displayedGroups.forEach(({ groupName, normalizedKeys, switches }) => {
            ui.div(groupName);
            normalizedKeys.forEach(key => {
                const kswitch = switches[key];
                let desc = descriptions[key] || '';
                let type = null;
                if (~desc.lastIndexOf(deferY18nLookupPrefix))
                    desc = __(desc.substring(deferY18nLookupPrefix.length));
                if (~options.boolean.indexOf(key))
                    type = `[${__('boolean')}]`;
                if (~options.count.indexOf(key))
                    type = `[${__('count')}]`;
                if (~options.string.indexOf(key))
                    type = `[${__('string')}]`;
                if (~options.normalize.indexOf(key))
                    type = `[${__('string')}]`;
                if (~options.array.indexOf(key))
                    type = `[${__('array')}]`;
                if (~options.number.indexOf(key))
                    type = `[${__('number')}]`;
                const deprecatedExtra = (deprecated) => typeof deprecated === 'string'
                    ? `[${__('deprecated: %s', deprecated)}]`
                    : `[${__('deprecated')}]`;
                const extra = [
                    key in deprecatedOptions
                        ? deprecatedExtra(deprecatedOptions[key])
                        : null,
                    type,
                    key in demandedOptions ? `[${__('required')}]` : null,
                    options.choices && options.choices[key]
                        ? `[${__('choices:')} ${self.stringifiedValues(options.choices[key])}]`
                        : null,
                    defaultString(options.default[key], options.defaultDescription[key]),
                ]
                    .filter(Boolean)
                    .join(' ');
                ui.span({
                    text: getText(kswitch),
                    padding: [0, 2, 0, 2 + getIndentation(kswitch)],
                    width: maxWidth(switches, theWrap) + 4,
                }, desc);
                if (extra)
                    ui.div({ text: extra, padding: [0, 0, 0, 2], align: 'right' });
                else
                    ui.div();
            });
            ui.div();
        });
        if (examples.length) {
            ui.div(__('Examples:'));
            examples.forEach(example => {
                example[0] = example[0].replace(/\$0/g, base$0);
            });
            examples.forEach(example => {
                if (example[1] === '') {
                    ui.div({
                        text: example[0],
                        padding: [0, 2, 0, 2],
                    });
                }
                else {
                    ui.div({
                        text: example[0],
                        padding: [0, 2, 0, 2],
                        width: maxWidth(examples, theWrap) + 4,
                    }, {
                        text: example[1],
                    });
                }
            });
            ui.div();
        }
        if (epilogs.length > 0) {
            const e = epilogs
                .map(epilog => epilog.replace(/\$0/g, base$0))
                .join('\n');
            ui.div(`${e}\n`);
        }
        return ui.toString().replace(/\s*$/, '');
    };
    function maxWidth(table, theWrap, modifier) {
        let width = 0;
        if (!Array.isArray(table)) {
            table = Object.values(table).map(v => [v]);
        }
        table.forEach(v => {
            width = Math.max(shim.stringWidth(modifier ? `${modifier} ${getText(v[0])}` : getText(v[0])) + getIndentation(v[0]), width);
        });
        if (theWrap)
            width = Math.min(width, parseInt((theWrap * 0.5).toString(), 10));
        return width;
    }
    function normalizeAliases() {
        const demandedOptions = yargs.getDemandedOptions();
        const options = yargs.getOptions();
        (Object.keys(options.alias) || []).forEach(key => {
            options.alias[key].forEach(alias => {
                if (descriptions[alias])
                    self.describe(key, descriptions[alias]);
                if (alias in demandedOptions)
                    yargs.demandOption(key, demandedOptions[alias]);
                if (~options.boolean.indexOf(alias))
                    yargs.boolean(key);
                if (~options.count.indexOf(alias))
                    yargs.count(key);
                if (~options.string.indexOf(alias))
                    yargs.string(key);
                if (~options.normalize.indexOf(alias))
                    yargs.normalize(key);
                if (~options.array.indexOf(alias))
                    yargs.array(key);
                if (~options.number.indexOf(alias))
                    yargs.number(key);
            });
        });
    }
    let cachedHelpMessage;
    self.cacheHelpMessage = function () {
        cachedHelpMessage = this.help();
    };
    self.clearCachedHelpMessage = function () {
        cachedHelpMessage = undefined;
    };
    function addUngroupedKeys(keys, aliases, groups, defaultGroup) {
        let groupedKeys = [];
        let toCheck = null;
        Object.keys(groups).forEach(group => {
            groupedKeys = groupedKeys.concat(groups[group]);
        });
        keys.forEach(key => {
            toCheck = [key].concat(aliases[key]);
            if (!toCheck.some(k => groupedKeys.indexOf(k) !== -1)) {
                groups[defaultGroup].push(key);
            }
        });
        return groupedKeys;
    }
    function filterHiddenOptions(key) {
        return (yargs.getOptions().hiddenOptions.indexOf(key) < 0 ||
            yargs.parsed.argv[yargs.getOptions().showHiddenOpt]);
    }
    self.showHelp = (level) => {
        const logger = yargs._getLoggerInstance();
        if (!level)
            level = 'error';
        const emit = typeof level === 'function' ? level : logger[level];
        emit(self.help());
    };
    self.functionDescription = fn => {
        const description = fn.name
            ? shim.Parser.decamelize(fn.name, '-')
            : __('generated-value');
        return ['(', description, ')'].join('');
    };
    self.stringifiedValues = function stringifiedValues(values, separator) {
        let string = '';
        const sep = separator || ', ';
        const array = [].concat(values);
        if (!values || !array.length)
            return string;
        array.forEach(value => {
            if (string.length)
                string += sep;
            string += JSON.stringify(value);
        });
        return string;
    };
    function defaultString(value, defaultDescription) {
        let string = `[${__('default:')} `;
        if (value === undefined && !defaultDescription)
            return null;
        if (defaultDescription) {
            string += defaultDescription;
        }
        else {
            switch (typeof value) {
                case 'string':
                    string += `"${value}"`;
                    break;
                case 'object':
                    string += JSON.stringify(value);
                    break;
                default:
                    string += value;
            }
        }
        return `${string}]`;
    }
    function windowWidth() {
        const maxWidth = 80;
        if (shim.process.stdColumns) {
            return Math.min(maxWidth, shim.process.stdColumns);
        }
        else {
            return maxWidth;
        }
    }
    let version = null;
    self.version = ver => {
        version = ver;
    };
    self.showVersion = () => {
        const logger = yargs._getLoggerInstance();
        logger.log(version);
    };
    self.reset = function reset(localLookup) {
        failMessage = null;
        failureOutput = false;
        usages = [];
        usageDisabled = false;
        epilogs = [];
        examples = [];
        commands = [];
        descriptions = objFilter(descriptions, k => !localLookup[k]);
        return self;
    };
    const frozens = [];
    self.freeze = function freeze() {
        frozens.push({
            failMessage,
            failureOutput,
            usages,
            usageDisabled,
            epilogs,
            examples,
            commands,
            descriptions,
        });
    };
    self.unfreeze = function unfreeze() {
        const frozen = frozens.pop();
        assertNotStrictEqual(frozen, undefined, shim);
        ({
            failMessage,
            failureOutput,
            usages,
            usageDisabled,
            epilogs,
            examples,
            commands,
            descriptions,
        } = frozen);
    };
    return self;
}
function isIndentedText(text) {
    return typeof text === 'object';
}
function addIndentation(text, indent) {
    return isIndentedText(text)
        ? { text: text.text, indentation: text.indentation + indent }
        : { text, indentation: indent };
}
function getIndentation(text) {
    return isIndentedText(text) ? text.indentation : 0;
}
function getText(text) {
    return isIndentedText(text) ? text.text : text;
}

const completionShTemplate = `###-begin-{{app_name}}-completions-###
#
# yargs command completion script
#
# Installation: {{app_path}} {{completion_command}} >> ~/.bashrc
#    or {{app_path}} {{completion_command}} >> ~/.bash_profile on OSX.
#
_yargs_completions()
{
    local cur_word args type_list

    cur_word="\${COMP_WORDS[COMP_CWORD]}"
    args=("\${COMP_WORDS[@]}")

    # ask yargs to generate completions.
    type_list=$({{app_path}} --get-yargs-completions "\${args[@]}")

    COMPREPLY=( $(compgen -W "\${type_list}" -- \${cur_word}) )

    # if no match was found, fall back to filename completion
    if [ \${#COMPREPLY[@]} -eq 0 ]; then
      COMPREPLY=()
    fi

    return 0
}
complete -o default -F _yargs_completions {{app_name}}
###-end-{{app_name}}-completions-###
`;
const completionZshTemplate = `###-begin-{{app_name}}-completions-###
#
# yargs command completion script
#
# Installation: {{app_path}} {{completion_command}} >> ~/.zshrc
#    or {{app_path}} {{completion_command}} >> ~/.zsh_profile on OSX.
#
_{{app_name}}_yargs_completions()
{
  local reply
  local si=$IFS
  IFS=$'\n' reply=($(COMP_CWORD="$((CURRENT-1))" COMP_LINE="$BUFFER" COMP_POINT="$CURSOR" {{app_path}} --get-yargs-completions "\${words[@]}"))
  IFS=$si
  _describe 'values' reply
}
compdef _{{app_name}}_yargs_completions {{app_name}}
###-end-{{app_name}}-completions-###
`;

function completion(yargs, usage, command, shim) {
    const self = {
        completionKey: 'get-yargs-completions',
    };
    let aliases;
    self.setParsed = function setParsed(parsed) {
        aliases = parsed.aliases;
    };
    const zshShell = (shim.getEnv('SHELL') && shim.getEnv('SHELL').indexOf('zsh') !== -1) ||
        (shim.getEnv('ZSH_NAME') && shim.getEnv('ZSH_NAME').indexOf('zsh') !== -1);
    self.getCompletion = function getCompletion(args, done) {
        const completions = [];
        const current = args.length ? args[args.length - 1] : '';
        const argv = yargs.parse(args, true);
        const parentCommands = yargs.getContext().commands;
        function runCompletionFunction(argv) {
            assertNotStrictEqual(completionFunction, null, shim);
            if (isSyncCompletionFunction(completionFunction)) {
                const result = completionFunction(current, argv);
                if (isPromise(result)) {
                    return result
                        .then(list => {
                        shim.process.nextTick(() => {
                            done(list);
                        });
                    })
                        .catch(err => {
                        shim.process.nextTick(() => {
                            throw err;
                        });
                    });
                }
                return done(result);
            }
            else {
                return completionFunction(current, argv, completions => {
                    done(completions);
                });
            }
        }
        if (completionFunction) {
            return isPromise(argv)
                ? argv.then(runCompletionFunction)
                : runCompletionFunction(argv);
        }
        const handlers = command.getCommandHandlers();
        for (let i = 0, ii = args.length; i < ii; ++i) {
            if (handlers[args[i]] && handlers[args[i]].builder) {
                const builder = handlers[args[i]].builder;
                if (isCommandBuilderCallback(builder)) {
                    const y = yargs.reset();
                    builder(y);
                    return y.argv;
                }
            }
        }
        if (!current.match(/^-/) &&
            parentCommands[parentCommands.length - 1] !== current) {
            usage.getCommands().forEach(usageCommand => {
                const commandName = parseCommand(usageCommand[0]).cmd;
                if (args.indexOf(commandName) === -1) {
                    if (!zshShell) {
                        completions.push(commandName);
                    }
                    else {
                        const desc = usageCommand[1] || '';
                        completions.push(commandName.replace(/:/g, '\\:') + ':' + desc);
                    }
                }
            });
        }
        if (current.match(/^-/) || (current === '' && completions.length === 0)) {
            const descs = usage.getDescriptions();
            const options = yargs.getOptions();
            Object.keys(options.key).forEach(key => {
                const negable = !!options.configuration['boolean-negation'] &&
                    options.boolean.includes(key);
                let keyAndAliases = [key].concat(aliases[key] || []);
                if (negable)
                    keyAndAliases = keyAndAliases.concat(keyAndAliases.map(key => `no-${key}`));
                function completeOptionKey(key) {
                    const notInArgs = keyAndAliases.every(val => args.indexOf(`--${val}`) === -1);
                    if (notInArgs) {
                        const startsByTwoDashes = (s) => /^--/.test(s);
                        const isShortOption = (s) => /^[^0-9]$/.test(s);
                        const dashes = !startsByTwoDashes(current) && isShortOption(key) ? '-' : '--';
                        if (!zshShell) {
                            completions.push(dashes + key);
                        }
                        else {
                            const desc = descs[key] || '';
                            completions.push(dashes +
                                `${key.replace(/:/g, '\\:')}:${desc.replace('__yargsString__:', '')}`);
                        }
                    }
                }
                completeOptionKey(key);
                if (negable && !!options.default[key])
                    completeOptionKey(`no-${key}`);
            });
        }
        done(completions);
    };
    self.generateCompletionScript = function generateCompletionScript($0, cmd) {
        let script = zshShell
            ? completionZshTemplate
            : completionShTemplate;
        const name = shim.path.basename($0);
        if ($0.match(/\.js$/))
            $0 = `./${$0}`;
        script = script.replace(/{{app_name}}/g, name);
        script = script.replace(/{{completion_command}}/g, cmd);
        return script.replace(/{{app_path}}/g, $0);
    };
    let completionFunction = null;
    self.registerFunction = fn => {
        completionFunction = fn;
    };
    return self;
}
function isSyncCompletionFunction(completionFunction) {
    return completionFunction.length < 3;
}

function levenshtein(a, b) {
    if (a.length === 0)
        return b.length;
    if (b.length === 0)
        return a.length;
    const matrix = [];
    let i;
    for (i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }
    let j;
    for (j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }
    for (i = 1; i <= b.length; i++) {
        for (j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            }
            else {
                matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1));
            }
        }
    }
    return matrix[b.length][a.length];
}

const specialKeys = ['$0', '--', '_'];
function validation(yargs, usage, y18n, shim) {
    const __ = y18n.__;
    const __n = y18n.__n;
    const self = {};
    self.nonOptionCount = function nonOptionCount(argv) {
        const demandedCommands = yargs.getDemandedCommands();
        const positionalCount = argv._.length + (argv['--'] ? argv['--'].length : 0);
        const _s = positionalCount - yargs.getContext().commands.length;
        if (demandedCommands._ &&
            (_s < demandedCommands._.min || _s > demandedCommands._.max)) {
            if (_s < demandedCommands._.min) {
                if (demandedCommands._.minMsg !== undefined) {
                    usage.fail(demandedCommands._.minMsg
                        ? demandedCommands._.minMsg
                            .replace(/\$0/g, _s.toString())
                            .replace(/\$1/, demandedCommands._.min.toString())
                        : null);
                }
                else {
                    usage.fail(__n('Not enough non-option arguments: got %s, need at least %s', 'Not enough non-option arguments: got %s, need at least %s', _s, _s.toString(), demandedCommands._.min.toString()));
                }
            }
            else if (_s > demandedCommands._.max) {
                if (demandedCommands._.maxMsg !== undefined) {
                    usage.fail(demandedCommands._.maxMsg
                        ? demandedCommands._.maxMsg
                            .replace(/\$0/g, _s.toString())
                            .replace(/\$1/, demandedCommands._.max.toString())
                        : null);
                }
                else {
                    usage.fail(__n('Too many non-option arguments: got %s, maximum of %s', 'Too many non-option arguments: got %s, maximum of %s', _s, _s.toString(), demandedCommands._.max.toString()));
                }
            }
        }
    };
    self.positionalCount = function positionalCount(required, observed) {
        if (observed < required) {
            usage.fail(__n('Not enough non-option arguments: got %s, need at least %s', 'Not enough non-option arguments: got %s, need at least %s', observed, observed + '', required + ''));
        }
    };
    self.requiredArguments = function requiredArguments(argv) {
        const demandedOptions = yargs.getDemandedOptions();
        let missing = null;
        for (const key of Object.keys(demandedOptions)) {
            if (!Object.prototype.hasOwnProperty.call(argv, key) ||
                typeof argv[key] === 'undefined') {
                missing = missing || {};
                missing[key] = demandedOptions[key];
            }
        }
        if (missing) {
            const customMsgs = [];
            for (const key of Object.keys(missing)) {
                const msg = missing[key];
                if (msg && customMsgs.indexOf(msg) < 0) {
                    customMsgs.push(msg);
                }
            }
            const customMsg = customMsgs.length ? `\n${customMsgs.join('\n')}` : '';
            usage.fail(__n('Missing required argument: %s', 'Missing required arguments: %s', Object.keys(missing).length, Object.keys(missing).join(', ') + customMsg));
        }
    };
    self.unknownArguments = function unknownArguments(argv, aliases, positionalMap, isDefaultCommand, checkPositionals = true) {
        const commandKeys = yargs.getCommandInstance().getCommands();
        const unknown = [];
        const currentContext = yargs.getContext();
        Object.keys(argv).forEach(key => {
            if (specialKeys.indexOf(key) === -1 &&
                !Object.prototype.hasOwnProperty.call(positionalMap, key) &&
                !Object.prototype.hasOwnProperty.call(yargs._getParseContext(), key) &&
                !self.isValidAndSomeAliasIsNotNew(key, aliases)) {
                unknown.push(key);
            }
        });
        if (checkPositionals &&
            (currentContext.commands.length > 0 ||
                commandKeys.length > 0 ||
                isDefaultCommand)) {
            argv._.slice(currentContext.commands.length).forEach(key => {
                if (commandKeys.indexOf('' + key) === -1) {
                    unknown.push('' + key);
                }
            });
        }
        if (unknown.length > 0) {
            usage.fail(__n('Unknown argument: %s', 'Unknown arguments: %s', unknown.length, unknown.join(', ')));
        }
    };
    self.unknownCommands = function unknownCommands(argv) {
        const commandKeys = yargs.getCommandInstance().getCommands();
        const unknown = [];
        const currentContext = yargs.getContext();
        if (currentContext.commands.length > 0 || commandKeys.length > 0) {
            argv._.slice(currentContext.commands.length).forEach(key => {
                if (commandKeys.indexOf('' + key) === -1) {
                    unknown.push('' + key);
                }
            });
        }
        if (unknown.length > 0) {
            usage.fail(__n('Unknown command: %s', 'Unknown commands: %s', unknown.length, unknown.join(', ')));
            return true;
        }
        else {
            return false;
        }
    };
    self.isValidAndSomeAliasIsNotNew = function isValidAndSomeAliasIsNotNew(key, aliases) {
        if (!Object.prototype.hasOwnProperty.call(aliases, key)) {
            return false;
        }
        const newAliases = yargs.parsed.newAliases;
        for (const a of [key, ...aliases[key]]) {
            if (!Object.prototype.hasOwnProperty.call(newAliases, a) ||
                !newAliases[key]) {
                return true;
            }
        }
        return false;
    };
    self.limitedChoices = function limitedChoices(argv) {
        const options = yargs.getOptions();
        const invalid = {};
        if (!Object.keys(options.choices).length)
            return;
        Object.keys(argv).forEach(key => {
            if (specialKeys.indexOf(key) === -1 &&
                Object.prototype.hasOwnProperty.call(options.choices, key)) {
                [].concat(argv[key]).forEach(value => {
                    if (options.choices[key].indexOf(value) === -1 &&
                        value !== undefined) {
                        invalid[key] = (invalid[key] || []).concat(value);
                    }
                });
            }
        });
        const invalidKeys = Object.keys(invalid);
        if (!invalidKeys.length)
            return;
        let msg = __('Invalid values:');
        invalidKeys.forEach(key => {
            msg += `\n  ${__('Argument: %s, Given: %s, Choices: %s', key, usage.stringifiedValues(invalid[key]), usage.stringifiedValues(options.choices[key]))}`;
        });
        usage.fail(msg);
    };
    let checks = [];
    self.check = function check(f, global) {
        checks.push({
            func: f,
            global,
        });
    };
    self.customChecks = function customChecks(argv, aliases) {
        for (let i = 0, f; (f = checks[i]) !== undefined; i++) {
            const func = f.func;
            let result = null;
            try {
                result = func(argv, aliases);
            }
            catch (err) {
                usage.fail(err.message ? err.message : err, err);
                continue;
            }
            if (!result) {
                usage.fail(__('Argument check failed: %s', func.toString()));
            }
            else if (typeof result === 'string' || result instanceof Error) {
                usage.fail(result.toString(), result);
            }
        }
    };
    let implied = {};
    self.implies = function implies(key, value) {
        argsert('<string|object> [array|number|string]', [key, value], arguments.length);
        if (typeof key === 'object') {
            Object.keys(key).forEach(k => {
                self.implies(k, key[k]);
            });
        }
        else {
            yargs.global(key);
            if (!implied[key]) {
                implied[key] = [];
            }
            if (Array.isArray(value)) {
                value.forEach(i => self.implies(key, i));
            }
            else {
                assertNotStrictEqual(value, undefined, shim);
                implied[key].push(value);
            }
        }
    };
    self.getImplied = function getImplied() {
        return implied;
    };
    function keyExists(argv, val) {
        const num = Number(val);
        val = isNaN(num) ? val : num;
        if (typeof val === 'number') {
            val = argv._.length >= val;
        }
        else if (val.match(/^--no-.+/)) {
            val = val.match(/^--no-(.+)/)[1];
            val = !argv[val];
        }
        else {
            val = argv[val];
        }
        return val;
    }
    self.implications = function implications(argv) {
        const implyFail = [];
        Object.keys(implied).forEach(key => {
            const origKey = key;
            (implied[key] || []).forEach(value => {
                let key = origKey;
                const origValue = value;
                key = keyExists(argv, key);
                value = keyExists(argv, value);
                if (key && !value) {
                    implyFail.push(` ${origKey} -> ${origValue}`);
                }
            });
        });
        if (implyFail.length) {
            let msg = `${__('Implications failed:')}\n`;
            implyFail.forEach(value => {
                msg += value;
            });
            usage.fail(msg);
        }
    };
    let conflicting = {};
    self.conflicts = function conflicts(key, value) {
        argsert('<string|object> [array|string]', [key, value], arguments.length);
        if (typeof key === 'object') {
            Object.keys(key).forEach(k => {
                self.conflicts(k, key[k]);
            });
        }
        else {
            yargs.global(key);
            if (!conflicting[key]) {
                conflicting[key] = [];
            }
            if (Array.isArray(value)) {
                value.forEach(i => self.conflicts(key, i));
            }
            else {
                conflicting[key].push(value);
            }
        }
    };
    self.getConflicting = () => conflicting;
    self.conflicting = function conflictingFn(argv) {
        Object.keys(argv).forEach(key => {
            if (conflicting[key]) {
                conflicting[key].forEach(value => {
                    if (value && argv[key] !== undefined && argv[value] !== undefined) {
                        usage.fail(__('Arguments %s and %s are mutually exclusive', key, value));
                    }
                });
            }
        });
    };
    self.recommendCommands = function recommendCommands(cmd, potentialCommands) {
        const threshold = 3;
        potentialCommands = potentialCommands.sort((a, b) => b.length - a.length);
        let recommended = null;
        let bestDistance = Infinity;
        for (let i = 0, candidate; (candidate = potentialCommands[i]) !== undefined; i++) {
            const d = levenshtein(cmd, candidate);
            if (d <= threshold && d < bestDistance) {
                bestDistance = d;
                recommended = candidate;
            }
        }
        if (recommended)
            usage.fail(__('Did you mean %s?', recommended));
    };
    self.reset = function reset(localLookup) {
        implied = objFilter(implied, k => !localLookup[k]);
        conflicting = objFilter(conflicting, k => !localLookup[k]);
        checks = checks.filter(c => c.global);
        return self;
    };
    const frozens = [];
    self.freeze = function freeze() {
        frozens.push({
            implied,
            checks,
            conflicting,
        });
    };
    self.unfreeze = function unfreeze() {
        const frozen = frozens.pop();
        assertNotStrictEqual(frozen, undefined, shim);
        ({ implied, checks, conflicting } = frozen);
    };
    return self;
}

let shim$1;
function YargsWithShim(_shim) {
    shim$1 = _shim;
    return Yargs;
}
function Yargs(processArgs = [], cwd = shim$1.process.cwd(), parentRequire) {
    const self = {};
    let command$1;
    let completion$1 = null;
    let groups = {};
    const globalMiddleware = [];
    let output = '';
    const preservedGroups = {};
    let usage$1;
    let validation$1;
    let handlerFinishCommand = null;
    const y18n = shim$1.y18n;
    self.middleware = globalMiddlewareFactory(globalMiddleware, self);
    self.scriptName = function (scriptName) {
        self.customScriptName = true;
        self.$0 = scriptName;
        return self;
    };
    let default$0;
    if (/\b(node|iojs|electron)(\.exe)?$/.test(shim$1.process.argv()[0])) {
        default$0 = shim$1.process.argv().slice(1, 2);
    }
    else {
        default$0 = shim$1.process.argv().slice(0, 1);
    }
    self.$0 = default$0
        .map(x => {
        const b = rebase(cwd, x);
        return x.match(/^(\/|([a-zA-Z]:)?\\)/) && b.length < x.length ? b : x;
    })
        .join(' ')
        .trim();
    if (shim$1.getEnv('_') && shim$1.getProcessArgvBin() === shim$1.getEnv('_')) {
        self.$0 = shim$1
            .getEnv('_')
            .replace(`${shim$1.path.dirname(shim$1.process.execPath())}/`, '');
    }
    const context = { resets: -1, commands: [], fullCommands: [], files: [] };
    self.getContext = () => context;
    let hasOutput = false;
    let exitError = null;
    self.exit = (code, err) => {
        hasOutput = true;
        exitError = err;
        if (exitProcess)
            shim$1.process.exit(code);
    };
    let completionCommand = null;
    self.completion = function (cmd, desc, fn) {
        argsert('[string] [string|boolean|function] [function]', [cmd, desc, fn], arguments.length);
        if (typeof desc === 'function') {
            fn = desc;
            desc = undefined;
        }
        completionCommand = cmd || completionCommand || 'completion';
        if (!desc && desc !== false) {
            desc = 'generate completion script';
        }
        self.command(completionCommand, desc);
        if (fn)
            completion$1.registerFunction(fn);
        return self;
    };
    let options;
    self.resetOptions = self.reset = function resetOptions(aliases = {}) {
        context.resets++;
        options = options || {};
        const tmpOptions = {};
        tmpOptions.local = options.local ? options.local : [];
        tmpOptions.configObjects = options.configObjects
            ? options.configObjects
            : [];
        const localLookup = {};
        tmpOptions.local.forEach(l => {
            localLookup[l] = true;
            (aliases[l] || []).forEach(a => {
                localLookup[a] = true;
            });
        });
        Object.assign(preservedGroups, Object.keys(groups).reduce((acc, groupName) => {
            const keys = groups[groupName].filter(key => !(key in localLookup));
            if (keys.length > 0) {
                acc[groupName] = keys;
            }
            return acc;
        }, {}));
        groups = {};
        const arrayOptions = [
            'array',
            'boolean',
            'string',
            'skipValidation',
            'count',
            'normalize',
            'number',
            'hiddenOptions',
        ];
        const objectOptions = [
            'narg',
            'key',
            'alias',
            'default',
            'defaultDescription',
            'config',
            'choices',
            'demandedOptions',
            'demandedCommands',
            'coerce',
            'deprecatedOptions',
        ];
        arrayOptions.forEach(k => {
            tmpOptions[k] = (options[k] || []).filter((k) => !localLookup[k]);
        });
        objectOptions.forEach((k) => {
            tmpOptions[k] = objFilter(options[k], k => !localLookup[k]);
        });
        tmpOptions.envPrefix = options.envPrefix;
        options = tmpOptions;
        usage$1 = usage$1 ? usage$1.reset(localLookup) : usage(self, y18n, shim$1);
        validation$1 = validation$1
            ? validation$1.reset(localLookup)
            : validation(self, usage$1, y18n, shim$1);
        command$1 = command$1
            ? command$1.reset()
            : command(self, usage$1, validation$1, globalMiddleware, shim$1);
        if (!completion$1)
            completion$1 = completion(self, usage$1, command$1, shim$1);
        completionCommand = null;
        output = '';
        exitError = null;
        hasOutput = false;
        self.parsed = false;
        return self;
    };
    self.resetOptions();
    const frozens = [];
    function freeze() {
        frozens.push({
            options,
            configObjects: options.configObjects.slice(0),
            exitProcess,
            groups,
            strict,
            strictCommands,
            strictOptions,
            completionCommand,
            output,
            exitError,
            hasOutput,
            parsed: self.parsed,
            parseFn,
            parseContext,
            handlerFinishCommand,
        });
        usage$1.freeze();
        validation$1.freeze();
        command$1.freeze();
    }
    function unfreeze() {
        const frozen = frozens.pop();
        assertNotStrictEqual(frozen, undefined, shim$1);
        let configObjects;
        ({
            options,
            configObjects,
            exitProcess,
            groups,
            output,
            exitError,
            hasOutput,
            parsed: self.parsed,
            strict,
            strictCommands,
            strictOptions,
            completionCommand,
            parseFn,
            parseContext,
            handlerFinishCommand,
        } = frozen);
        options.configObjects = configObjects;
        usage$1.unfreeze();
        validation$1.unfreeze();
        command$1.unfreeze();
    }
    self.boolean = function (keys) {
        argsert('<array|string>', [keys], arguments.length);
        populateParserHintArray('boolean', keys);
        return self;
    };
    self.array = function (keys) {
        argsert('<array|string>', [keys], arguments.length);
        populateParserHintArray('array', keys);
        return self;
    };
    self.number = function (keys) {
        argsert('<array|string>', [keys], arguments.length);
        populateParserHintArray('number', keys);
        return self;
    };
    self.normalize = function (keys) {
        argsert('<array|string>', [keys], arguments.length);
        populateParserHintArray('normalize', keys);
        return self;
    };
    self.count = function (keys) {
        argsert('<array|string>', [keys], arguments.length);
        populateParserHintArray('count', keys);
        return self;
    };
    self.string = function (keys) {
        argsert('<array|string>', [keys], arguments.length);
        populateParserHintArray('string', keys);
        return self;
    };
    self.requiresArg = function (keys) {
        argsert('<array|string|object> [number]', [keys], arguments.length);
        if (typeof keys === 'string' && options.narg[keys]) {
            return self;
        }
        else {
            populateParserHintSingleValueDictionary(self.requiresArg, 'narg', keys, NaN);
        }
        return self;
    };
    self.skipValidation = function (keys) {
        argsert('<array|string>', [keys], arguments.length);
        populateParserHintArray('skipValidation', keys);
        return self;
    };
    function populateParserHintArray(type, keys) {
        keys = [].concat(keys);
        keys.forEach(key => {
            key = sanitizeKey(key);
            options[type].push(key);
        });
    }
    self.nargs = function (key, value) {
        argsert('<string|object|array> [number]', [key, value], arguments.length);
        populateParserHintSingleValueDictionary(self.nargs, 'narg', key, value);
        return self;
    };
    self.choices = function (key, value) {
        argsert('<object|string|array> [string|array]', [key, value], arguments.length);
        populateParserHintArrayDictionary(self.choices, 'choices', key, value);
        return self;
    };
    self.alias = function (key, value) {
        argsert('<object|string|array> [string|array]', [key, value], arguments.length);
        populateParserHintArrayDictionary(self.alias, 'alias', key, value);
        return self;
    };
    self.default = self.defaults = function (key, value, defaultDescription) {
        argsert('<object|string|array> [*] [string]', [key, value, defaultDescription], arguments.length);
        if (defaultDescription) {
            assertSingleKey(key, shim$1);
            options.defaultDescription[key] = defaultDescription;
        }
        if (typeof value === 'function') {
            assertSingleKey(key, shim$1);
            if (!options.defaultDescription[key])
                options.defaultDescription[key] = usage$1.functionDescription(value);
            value = value.call();
        }
        populateParserHintSingleValueDictionary(self.default, 'default', key, value);
        return self;
    };
    self.describe = function (key, desc) {
        argsert('<object|string|array> [string]', [key, desc], arguments.length);
        setKey(key, true);
        usage$1.describe(key, desc);
        return self;
    };
    function setKey(key, set) {
        populateParserHintSingleValueDictionary(setKey, 'key', key, set);
        return self;
    }
    function demandOption(keys, msg) {
        argsert('<object|string|array> [string]', [keys, msg], arguments.length);
        populateParserHintSingleValueDictionary(self.demandOption, 'demandedOptions', keys, msg);
        return self;
    }
    self.demandOption = demandOption;
    self.coerce = function (keys, value) {
        argsert('<object|string|array> [function]', [keys, value], arguments.length);
        populateParserHintSingleValueDictionary(self.coerce, 'coerce', keys, value);
        return self;
    };
    function populateParserHintSingleValueDictionary(builder, type, key, value) {
        populateParserHintDictionary(builder, type, key, value, (type, key, value) => {
            options[type][key] = value;
        });
    }
    function populateParserHintArrayDictionary(builder, type, key, value) {
        populateParserHintDictionary(builder, type, key, value, (type, key, value) => {
            options[type][key] = (options[type][key] || []).concat(value);
        });
    }
    function populateParserHintDictionary(builder, type, key, value, singleKeyHandler) {
        if (Array.isArray(key)) {
            key.forEach(k => {
                builder(k, value);
            });
        }
        else if (((key) => typeof key === 'object')(key)) {
            for (const k of objectKeys(key)) {
                builder(k, key[k]);
            }
        }
        else {
            singleKeyHandler(type, sanitizeKey(key), value);
        }
    }
    function sanitizeKey(key) {
        if (key === '__proto__')
            return '___proto___';
        return key;
    }
    function deleteFromParserHintObject(optionKey) {
        objectKeys(options).forEach((hintKey) => {
            if (((key) => key === 'configObjects')(hintKey))
                return;
            const hint = options[hintKey];
            if (Array.isArray(hint)) {
                if (~hint.indexOf(optionKey))
                    hint.splice(hint.indexOf(optionKey), 1);
            }
            else if (typeof hint === 'object') {
                delete hint[optionKey];
            }
        });
        delete usage$1.getDescriptions()[optionKey];
    }
    self.config = function config(key = 'config', msg, parseFn) {
        argsert('[object|string] [string|function] [function]', [key, msg, parseFn], arguments.length);
        if (typeof key === 'object' && !Array.isArray(key)) {
            key = applyExtends(key, cwd, self.getParserConfiguration()['deep-merge-config'] || false, shim$1);
            options.configObjects = (options.configObjects || []).concat(key);
            return self;
        }
        if (typeof msg === 'function') {
            parseFn = msg;
            msg = undefined;
        }
        self.describe(key, msg || usage$1.deferY18nLookup('Path to JSON config file'));
        (Array.isArray(key) ? key : [key]).forEach(k => {
            options.config[k] = parseFn || true;
        });
        return self;
    };
    self.example = function (cmd, description) {
        argsert('<string|array> [string]', [cmd, description], arguments.length);
        if (Array.isArray(cmd)) {
            cmd.forEach(exampleParams => self.example(...exampleParams));
        }
        else {
            usage$1.example(cmd, description);
        }
        return self;
    };
    self.command = function (cmd, description, builder, handler, middlewares, deprecated) {
        argsert('<string|array|object> [string|boolean] [function|object] [function] [array] [boolean|string]', [cmd, description, builder, handler, middlewares, deprecated], arguments.length);
        command$1.addHandler(cmd, description, builder, handler, middlewares, deprecated);
        return self;
    };
    self.commandDir = function (dir, opts) {
        argsert('<string> [object]', [dir, opts], arguments.length);
        const req = parentRequire || shim$1.require;
        command$1.addDirectory(dir, self.getContext(), req, shim$1.getCallerFile(), opts);
        return self;
    };
    self.demand = self.required = self.require = function demand(keys, max, msg) {
        if (Array.isArray(max)) {
            max.forEach(key => {
                assertNotStrictEqual(msg, true, shim$1);
                demandOption(key, msg);
            });
            max = Infinity;
        }
        else if (typeof max !== 'number') {
            msg = max;
            max = Infinity;
        }
        if (typeof keys === 'number') {
            assertNotStrictEqual(msg, true, shim$1);
            self.demandCommand(keys, max, msg, msg);
        }
        else if (Array.isArray(keys)) {
            keys.forEach(key => {
                assertNotStrictEqual(msg, true, shim$1);
                demandOption(key, msg);
            });
        }
        else {
            if (typeof msg === 'string') {
                demandOption(keys, msg);
            }
            else if (msg === true || typeof msg === 'undefined') {
                demandOption(keys);
            }
        }
        return self;
    };
    self.demandCommand = function demandCommand(min = 1, max, minMsg, maxMsg) {
        argsert('[number] [number|string] [string|null|undefined] [string|null|undefined]', [min, max, minMsg, maxMsg], arguments.length);
        if (typeof max !== 'number') {
            minMsg = max;
            max = Infinity;
        }
        self.global('_', false);
        options.demandedCommands._ = {
            min,
            max,
            minMsg,
            maxMsg,
        };
        return self;
    };
    self.getDemandedOptions = () => {
        argsert([], 0);
        return options.demandedOptions;
    };
    self.getDemandedCommands = () => {
        argsert([], 0);
        return options.demandedCommands;
    };
    self.deprecateOption = function deprecateOption(option, message) {
        argsert('<string> [string|boolean]', [option, message], arguments.length);
        options.deprecatedOptions[option] = message;
        return self;
    };
    self.getDeprecatedOptions = () => {
        argsert([], 0);
        return options.deprecatedOptions;
    };
    self.implies = function (key, value) {
        argsert('<string|object> [number|string|array]', [key, value], arguments.length);
        validation$1.implies(key, value);
        return self;
    };
    self.conflicts = function (key1, key2) {
        argsert('<string|object> [string|array]', [key1, key2], arguments.length);
        validation$1.conflicts(key1, key2);
        return self;
    };
    self.usage = function (msg, description, builder, handler) {
        argsert('<string|null|undefined> [string|boolean] [function|object] [function]', [msg, description, builder, handler], arguments.length);
        if (description !== undefined) {
            assertNotStrictEqual(msg, null, shim$1);
            if ((msg || '').match(/^\$0( |$)/)) {
                return self.command(msg, description, builder, handler);
            }
            else {
                throw new YError('.usage() description must start with $0 if being used as alias for .command()');
            }
        }
        else {
            usage$1.usage(msg);
            return self;
        }
    };
    self.epilogue = self.epilog = function (msg) {
        argsert('<string>', [msg], arguments.length);
        usage$1.epilog(msg);
        return self;
    };
    self.fail = function (f) {
        argsert('<function>', [f], arguments.length);
        usage$1.failFn(f);
        return self;
    };
    self.onFinishCommand = function (f) {
        argsert('<function>', [f], arguments.length);
        handlerFinishCommand = f;
        return self;
    };
    self.getHandlerFinishCommand = () => handlerFinishCommand;
    self.check = function (f, _global) {
        argsert('<function> [boolean]', [f, _global], arguments.length);
        validation$1.check(f, _global !== false);
        return self;
    };
    self.global = function global(globals, global) {
        argsert('<string|array> [boolean]', [globals, global], arguments.length);
        globals = [].concat(globals);
        if (global !== false) {
            options.local = options.local.filter(l => globals.indexOf(l) === -1);
        }
        else {
            globals.forEach(g => {
                if (options.local.indexOf(g) === -1)
                    options.local.push(g);
            });
        }
        return self;
    };
    self.pkgConf = function pkgConf(key, rootPath) {
        argsert('<string> [string]', [key, rootPath], arguments.length);
        let conf = null;
        const obj = pkgUp(rootPath || cwd);
        if (obj[key] && typeof obj[key] === 'object') {
            conf = applyExtends(obj[key], rootPath || cwd, self.getParserConfiguration()['deep-merge-config'] || false, shim$1);
            options.configObjects = (options.configObjects || []).concat(conf);
        }
        return self;
    };
    const pkgs = {};
    function pkgUp(rootPath) {
        const npath = rootPath || '*';
        if (pkgs[npath])
            return pkgs[npath];
        let obj = {};
        try {
            let startDir = rootPath || shim$1.mainFilename;
            if (!rootPath && shim$1.path.extname(startDir)) {
                startDir = shim$1.path.dirname(startDir);
            }
            const pkgJsonPath = shim$1.findUp(startDir, (dir, names) => {
                if (names.includes('package.json')) {
                    return 'package.json';
                }
                else {
                    return undefined;
                }
            });
            assertNotStrictEqual(pkgJsonPath, undefined, shim$1);
            obj = JSON.parse(shim$1.readFileSync(pkgJsonPath, 'utf8'));
        }
        catch (_noop) { }
        pkgs[npath] = obj || {};
        return pkgs[npath];
    }
    let parseFn = null;
    let parseContext = null;
    self.parse = function parse(args, shortCircuit, _parseFn) {
        argsert('[string|array] [function|boolean|object] [function]', [args, shortCircuit, _parseFn], arguments.length);
        freeze();
        if (typeof args === 'undefined') {
            const argv = self._parseArgs(processArgs);
            const tmpParsed = self.parsed;
            unfreeze();
            self.parsed = tmpParsed;
            return argv;
        }
        if (typeof shortCircuit === 'object') {
            parseContext = shortCircuit;
            shortCircuit = _parseFn;
        }
        if (typeof shortCircuit === 'function') {
            parseFn = shortCircuit;
            shortCircuit = false;
        }
        if (!shortCircuit)
            processArgs = args;
        if (parseFn)
            exitProcess = false;
        const parsed = self._parseArgs(args, !!shortCircuit);
        completion$1.setParsed(self.parsed);
        if (parseFn)
            parseFn(exitError, parsed, output);
        unfreeze();
        return parsed;
    };
    self._getParseContext = () => parseContext || {};
    self._hasParseCallback = () => !!parseFn;
    self.option = self.options = function option(key, opt) {
        argsert('<string|object> [object]', [key, opt], arguments.length);
        if (typeof key === 'object') {
            Object.keys(key).forEach(k => {
                self.options(k, key[k]);
            });
        }
        else {
            if (typeof opt !== 'object') {
                opt = {};
            }
            options.key[key] = true;
            if (opt.alias)
                self.alias(key, opt.alias);
            const deprecate = opt.deprecate || opt.deprecated;
            if (deprecate) {
                self.deprecateOption(key, deprecate);
            }
            const demand = opt.demand || opt.required || opt.require;
            if (demand) {
                self.demand(key, demand);
            }
            if (opt.demandOption) {
                self.demandOption(key, typeof opt.demandOption === 'string' ? opt.demandOption : undefined);
            }
            if (opt.conflicts) {
                self.conflicts(key, opt.conflicts);
            }
            if ('default' in opt) {
                self.default(key, opt.default);
            }
            if (opt.implies !== undefined) {
                self.implies(key, opt.implies);
            }
            if (opt.nargs !== undefined) {
                self.nargs(key, opt.nargs);
            }
            if (opt.config) {
                self.config(key, opt.configParser);
            }
            if (opt.normalize) {
                self.normalize(key);
            }
            if (opt.choices) {
                self.choices(key, opt.choices);
            }
            if (opt.coerce) {
                self.coerce(key, opt.coerce);
            }
            if (opt.group) {
                self.group(key, opt.group);
            }
            if (opt.boolean || opt.type === 'boolean') {
                self.boolean(key);
                if (opt.alias)
                    self.boolean(opt.alias);
            }
            if (opt.array || opt.type === 'array') {
                self.array(key);
                if (opt.alias)
                    self.array(opt.alias);
            }
            if (opt.number || opt.type === 'number') {
                self.number(key);
                if (opt.alias)
                    self.number(opt.alias);
            }
            if (opt.string || opt.type === 'string') {
                self.string(key);
                if (opt.alias)
                    self.string(opt.alias);
            }
            if (opt.count || opt.type === 'count') {
                self.count(key);
            }
            if (typeof opt.global === 'boolean') {
                self.global(key, opt.global);
            }
            if (opt.defaultDescription) {
                options.defaultDescription[key] = opt.defaultDescription;
            }
            if (opt.skipValidation) {
                self.skipValidation(key);
            }
            const desc = opt.describe || opt.description || opt.desc;
            self.describe(key, desc);
            if (opt.hidden) {
                self.hide(key);
            }
            if (opt.requiresArg) {
                self.requiresArg(key);
            }
        }
        return self;
    };
    self.getOptions = () => options;
    self.positional = function (key, opts) {
        argsert('<string> <object>', [key, opts], arguments.length);
        if (context.resets === 0) {
            throw new YError(".positional() can only be called in a command's builder function");
        }
        const supportedOpts = [
            'default',
            'defaultDescription',
            'implies',
            'normalize',
            'choices',
            'conflicts',
            'coerce',
            'type',
            'describe',
            'desc',
            'description',
            'alias',
        ];
        opts = objFilter(opts, (k, v) => {
            let accept = supportedOpts.indexOf(k) !== -1;
            if (k === 'type' && ['string', 'number', 'boolean'].indexOf(v) === -1)
                accept = false;
            return accept;
        });
        const fullCommand = context.fullCommands[context.fullCommands.length - 1];
        const parseOptions = fullCommand
            ? command$1.cmdToParseOptions(fullCommand)
            : {
                array: [],
                alias: {},
                default: {},
                demand: {},
            };
        objectKeys(parseOptions).forEach(pk => {
            const parseOption = parseOptions[pk];
            if (Array.isArray(parseOption)) {
                if (parseOption.indexOf(key) !== -1)
                    opts[pk] = true;
            }
            else {
                if (parseOption[key] && !(pk in opts))
                    opts[pk] = parseOption[key];
            }
        });
        self.group(key, usage$1.getPositionalGroupName());
        return self.option(key, opts);
    };
    self.group = function group(opts, groupName) {
        argsert('<string|array> <string>', [opts, groupName], arguments.length);
        const existing = preservedGroups[groupName] || groups[groupName];
        if (preservedGroups[groupName]) {
            delete preservedGroups[groupName];
        }
        const seen = {};
        groups[groupName] = (existing || []).concat(opts).filter(key => {
            if (seen[key])
                return false;
            return (seen[key] = true);
        });
        return self;
    };
    self.getGroups = () => Object.assign({}, groups, preservedGroups);
    self.env = function (prefix) {
        argsert('[string|boolean]', [prefix], arguments.length);
        if (prefix === false)
            delete options.envPrefix;
        else
            options.envPrefix = prefix || '';
        return self;
    };
    self.wrap = function (cols) {
        argsert('<number|null|undefined>', [cols], arguments.length);
        usage$1.wrap(cols);
        return self;
    };
    let strict = false;
    self.strict = function (enabled) {
        argsert('[boolean]', [enabled], arguments.length);
        strict = enabled !== false;
        return self;
    };
    self.getStrict = () => strict;
    let strictCommands = false;
    self.strictCommands = function (enabled) {
        argsert('[boolean]', [enabled], arguments.length);
        strictCommands = enabled !== false;
        return self;
    };
    self.getStrictCommands = () => strictCommands;
    let strictOptions = false;
    self.strictOptions = function (enabled) {
        argsert('[boolean]', [enabled], arguments.length);
        strictOptions = enabled !== false;
        return self;
    };
    self.getStrictOptions = () => strictOptions;
    let parserConfig = {};
    self.parserConfiguration = function parserConfiguration(config) {
        argsert('<object>', [config], arguments.length);
        parserConfig = config;
        return self;
    };
    self.getParserConfiguration = () => parserConfig;
    self.showHelp = function (level) {
        argsert('[string|function]', [level], arguments.length);
        if (!self.parsed)
            self._parseArgs(processArgs);
        if (command$1.hasDefaultCommand()) {
            context.resets++;
            command$1.runDefaultBuilderOn(self);
        }
        usage$1.showHelp(level);
        return self;
    };
    let versionOpt = null;
    self.version = function version(opt, msg, ver) {
        const defaultVersionOpt = 'version';
        argsert('[boolean|string] [string] [string]', [opt, msg, ver], arguments.length);
        if (versionOpt) {
            deleteFromParserHintObject(versionOpt);
            usage$1.version(undefined);
            versionOpt = null;
        }
        if (arguments.length === 0) {
            ver = guessVersion();
            opt = defaultVersionOpt;
        }
        else if (arguments.length === 1) {
            if (opt === false) {
                return self;
            }
            ver = opt;
            opt = defaultVersionOpt;
        }
        else if (arguments.length === 2) {
            ver = msg;
            msg = undefined;
        }
        versionOpt = typeof opt === 'string' ? opt : defaultVersionOpt;
        msg = msg || usage$1.deferY18nLookup('Show version number');
        usage$1.version(ver || undefined);
        self.boolean(versionOpt);
        self.describe(versionOpt, msg);
        return self;
    };
    function guessVersion() {
        const obj = pkgUp();
        return obj.version || 'unknown';
    }
    let helpOpt = null;
    self.addHelpOpt = self.help = function addHelpOpt(opt, msg) {
        const defaultHelpOpt = 'help';
        argsert('[string|boolean] [string]', [opt, msg], arguments.length);
        if (helpOpt) {
            deleteFromParserHintObject(helpOpt);
            helpOpt = null;
        }
        if (arguments.length === 1) {
            if (opt === false)
                return self;
        }
        helpOpt = typeof opt === 'string' ? opt : defaultHelpOpt;
        self.boolean(helpOpt);
        self.describe(helpOpt, msg || usage$1.deferY18nLookup('Show help'));
        return self;
    };
    const defaultShowHiddenOpt = 'show-hidden';
    options.showHiddenOpt = defaultShowHiddenOpt;
    self.addShowHiddenOpt = self.showHidden = function addShowHiddenOpt(opt, msg) {
        argsert('[string|boolean] [string]', [opt, msg], arguments.length);
        if (arguments.length === 1) {
            if (opt === false)
                return self;
        }
        const showHiddenOpt = typeof opt === 'string' ? opt : defaultShowHiddenOpt;
        self.boolean(showHiddenOpt);
        self.describe(showHiddenOpt, msg || usage$1.deferY18nLookup('Show hidden options'));
        options.showHiddenOpt = showHiddenOpt;
        return self;
    };
    self.hide = function hide(key) {
        argsert('<string>', [key], arguments.length);
        options.hiddenOptions.push(key);
        return self;
    };
    self.showHelpOnFail = function showHelpOnFail(enabled, message) {
        argsert('[boolean|string] [string]', [enabled, message], arguments.length);
        usage$1.showHelpOnFail(enabled, message);
        return self;
    };
    let exitProcess = true;
    self.exitProcess = function (enabled = true) {
        argsert('[boolean]', [enabled], arguments.length);
        exitProcess = enabled;
        return self;
    };
    self.getExitProcess = () => exitProcess;
    self.showCompletionScript = function ($0, cmd) {
        argsert('[string] [string]', [$0, cmd], arguments.length);
        $0 = $0 || self.$0;
        _logger.log(completion$1.generateCompletionScript($0, cmd || completionCommand || 'completion'));
        return self;
    };
    self.getCompletion = function (args, done) {
        argsert('<array> <function>', [args, done], arguments.length);
        completion$1.getCompletion(args, done);
    };
    self.locale = function (locale) {
        argsert('[string]', [locale], arguments.length);
        if (!locale) {
            guessLocale();
            return y18n.getLocale();
        }
        detectLocale = false;
        y18n.setLocale(locale);
        return self;
    };
    self.updateStrings = self.updateLocale = function (obj) {
        argsert('<object>', [obj], arguments.length);
        detectLocale = false;
        y18n.updateLocale(obj);
        return self;
    };
    let detectLocale = true;
    self.detectLocale = function (detect) {
        argsert('<boolean>', [detect], arguments.length);
        detectLocale = detect;
        return self;
    };
    self.getDetectLocale = () => detectLocale;
    const _logger = {
        log(...args) {
            if (!self._hasParseCallback())
                console.log(...args);
            hasOutput = true;
            if (output.length)
                output += '\n';
            output += args.join(' ');
        },
        error(...args) {
            if (!self._hasParseCallback())
                console.error(...args);
            hasOutput = true;
            if (output.length)
                output += '\n';
            output += args.join(' ');
        },
    };
    self._getLoggerInstance = () => _logger;
    self._hasOutput = () => hasOutput;
    self._setHasOutput = () => {
        hasOutput = true;
    };
    let recommendCommands;
    self.recommendCommands = function (recommend = true) {
        argsert('[boolean]', [recommend], arguments.length);
        recommendCommands = recommend;
        return self;
    };
    self.getUsageInstance = () => usage$1;
    self.getValidationInstance = () => validation$1;
    self.getCommandInstance = () => command$1;
    self.terminalWidth = () => {
        argsert([], 0);
        return shim$1.process.stdColumns;
    };
    Object.defineProperty(self, 'argv', {
        get: () => self._parseArgs(processArgs),
        enumerable: true,
    });
    self._parseArgs = function parseArgs(args, shortCircuit, _calledFromCommand, commandIndex) {
        let skipValidation = !!_calledFromCommand;
        args = args || processArgs;
        options.__ = y18n.__;
        options.configuration = self.getParserConfiguration();
        const populateDoubleDash = !!options.configuration['populate--'];
        const config = Object.assign({}, options.configuration, {
            'populate--': true,
        });
        const parsed = shim$1.Parser.detailed(args, Object.assign({}, options, {
            configuration: Object.assign({ 'parse-positional-numbers': false }, config),
        }));
        let argv = parsed.argv;
        if (parseContext)
            argv = Object.assign({}, argv, parseContext);
        const aliases = parsed.aliases;
        argv.$0 = self.$0;
        self.parsed = parsed;
        try {
            guessLocale();
            if (shortCircuit) {
                return self._postProcess(argv, populateDoubleDash, _calledFromCommand);
            }
            if (helpOpt) {
                const helpCmds = [helpOpt]
                    .concat(aliases[helpOpt] || [])
                    .filter(k => k.length > 1);
                if (~helpCmds.indexOf('' + argv._[argv._.length - 1])) {
                    argv._.pop();
                    argv[helpOpt] = true;
                }
            }
            const handlerKeys = command$1.getCommands();
            const requestCompletions = completion$1.completionKey in argv;
            const skipRecommendation = argv[helpOpt] || requestCompletions;
            const skipDefaultCommand = skipRecommendation &&
                (handlerKeys.length > 1 || handlerKeys[0] !== '$0');
            if (argv._.length) {
                if (handlerKeys.length) {
                    let firstUnknownCommand;
                    for (let i = commandIndex || 0, cmd; argv._[i] !== undefined; i++) {
                        cmd = String(argv._[i]);
                        if (~handlerKeys.indexOf(cmd) && cmd !== completionCommand) {
                            const innerArgv = command$1.runCommand(cmd, self, parsed, i + 1);
                            return self._postProcess(innerArgv, populateDoubleDash);
                        }
                        else if (!firstUnknownCommand && cmd !== completionCommand) {
                            firstUnknownCommand = cmd;
                            break;
                        }
                    }
                    if (command$1.hasDefaultCommand() && !skipDefaultCommand) {
                        const innerArgv = command$1.runCommand(null, self, parsed);
                        return self._postProcess(innerArgv, populateDoubleDash);
                    }
                    if (recommendCommands && firstUnknownCommand && !skipRecommendation) {
                        validation$1.recommendCommands(firstUnknownCommand, handlerKeys);
                    }
                }
                if (completionCommand &&
                    ~argv._.indexOf(completionCommand) &&
                    !requestCompletions) {
                    if (exitProcess)
                        setBlocking(true);
                    self.showCompletionScript();
                    self.exit(0);
                }
            }
            else if (command$1.hasDefaultCommand() && !skipDefaultCommand) {
                const innerArgv = command$1.runCommand(null, self, parsed);
                return self._postProcess(innerArgv, populateDoubleDash);
            }
            if (requestCompletions) {
                if (exitProcess)
                    setBlocking(true);
                args = [].concat(args);
                const completionArgs = args.slice(args.indexOf(`--${completion$1.completionKey}`) + 1);
                completion$1.getCompletion(completionArgs, completions => {
                    (completions || []).forEach(completion => {
                        _logger.log(completion);
                    });
                    self.exit(0);
                });
                return self._postProcess(argv, !populateDoubleDash, _calledFromCommand);
            }
            if (!hasOutput) {
                Object.keys(argv).forEach(key => {
                    if (key === helpOpt && argv[key]) {
                        if (exitProcess)
                            setBlocking(true);
                        skipValidation = true;
                        self.showHelp('log');
                        self.exit(0);
                    }
                    else if (key === versionOpt && argv[key]) {
                        if (exitProcess)
                            setBlocking(true);
                        skipValidation = true;
                        usage$1.showVersion();
                        self.exit(0);
                    }
                });
            }
            if (!skipValidation && options.skipValidation.length > 0) {
                skipValidation = Object.keys(argv).some(key => options.skipValidation.indexOf(key) >= 0 && argv[key] === true);
            }
            if (!skipValidation) {
                if (parsed.error)
                    throw new YError(parsed.error.message);
                if (!requestCompletions) {
                    self._runValidation(argv, aliases, {}, parsed.error);
                }
            }
        }
        catch (err) {
            if (err instanceof YError)
                usage$1.fail(err.message, err);
            else
                throw err;
        }
        return self._postProcess(argv, populateDoubleDash, _calledFromCommand);
    };
    self._postProcess = function (argv, populateDoubleDash, calledFromCommand = false) {
        if (isPromise(argv))
            return argv;
        if (calledFromCommand)
            return argv;
        if (!populateDoubleDash) {
            argv = self._copyDoubleDash(argv);
        }
        const parsePositionalNumbers = self.getParserConfiguration()['parse-positional-numbers'] ||
            self.getParserConfiguration()['parse-positional-numbers'] === undefined;
        if (parsePositionalNumbers) {
            argv = self._parsePositionalNumbers(argv);
        }
        return argv;
    };
    self._copyDoubleDash = function (argv) {
        if (!argv._ || !argv['--'])
            return argv;
        argv._.push.apply(argv._, argv['--']);
        try {
            delete argv['--'];
        }
        catch (_err) { }
        return argv;
    };
    self._parsePositionalNumbers = function (argv) {
        const args = argv['--'] ? argv['--'] : argv._;
        for (let i = 0, arg; (arg = args[i]) !== undefined; i++) {
            if (shim$1.Parser.looksLikeNumber(arg) &&
                Number.isSafeInteger(Math.floor(parseFloat(`${arg}`)))) {
                args[i] = Number(arg);
            }
        }
        return argv;
    };
    self._runValidation = function runValidation(argv, aliases, positionalMap, parseErrors, isDefaultCommand = false) {
        if (parseErrors)
            throw new YError(parseErrors.message);
        validation$1.nonOptionCount(argv);
        validation$1.requiredArguments(argv);
        let failedStrictCommands = false;
        if (strictCommands) {
            failedStrictCommands = validation$1.unknownCommands(argv);
        }
        if (strict && !failedStrictCommands) {
            validation$1.unknownArguments(argv, aliases, positionalMap, isDefaultCommand);
        }
        else if (strictOptions) {
            validation$1.unknownArguments(argv, aliases, {}, false, false);
        }
        validation$1.customChecks(argv, aliases);
        validation$1.limitedChoices(argv);
        validation$1.implications(argv);
        validation$1.conflicting(argv);
    };
    function guessLocale() {
        if (!detectLocale)
            return;
        const locale = shim$1.getEnv('LC_ALL') ||
            shim$1.getEnv('LC_MESSAGES') ||
            shim$1.getEnv('LANG') ||
            shim$1.getEnv('LANGUAGE') ||
            'en_US';
        self.locale(locale.replace(/[.:].*/, ''));
    }
    self.help();
    self.version();
    return self;
}
const rebase = (base, dir) => shim$1.path.relative(base, dir);
function isYargsInstance(y) {
    return !!y && typeof y._parseArgs === 'function';
}

var _a, _b;
const { readFileSync } = __nccwpck_require__(747);
const { inspect } = __nccwpck_require__(669);
const { resolve } = __nccwpck_require__(622);
const y18n = __nccwpck_require__(415);
const Parser = __nccwpck_require__(661);
var cjsPlatformShim = {
    assert: {
        notStrictEqual: assert.notStrictEqual,
        strictEqual: assert.strictEqual,
    },
    cliui: __nccwpck_require__(41),
    findUp: __nccwpck_require__(262),
    getEnv: (key) => {
        return process.env[key];
    },
    getCallerFile: __nccwpck_require__(956),
    getProcessArgvBin: getProcessArgvBin,
    inspect,
    mainFilename: (_b = (_a =  false || __nccwpck_require__(404) === void 0 ? void 0 : __nccwpck_require__.c[__nccwpck_require__.s]) === null || _a === void 0 ? void 0 : _a.filename) !== null && _b !== void 0 ? _b : process.cwd(),
    Parser,
    path: __nccwpck_require__(622),
    process: {
        argv: () => process.argv,
        cwd: process.cwd,
        execPath: () => process.execPath,
        exit: (code) => {
            process.exit(code);
        },
        nextTick: process.nextTick,
        stdColumns: typeof process.stdout.columns !== 'undefined'
            ? process.stdout.columns
            : null,
    },
    readFileSync,
    require: __nccwpck_require__(404),
    requireDirectory: __nccwpck_require__(597),
    stringWidth: __nccwpck_require__(974),
    y18n: y18n({
        directory: resolve(__dirname, '../locales'),
        updateFiles: false,
    }),
};

const minNodeVersion = process && process.env && process.env.YARGS_MIN_NODE_VERSION
    ? Number(process.env.YARGS_MIN_NODE_VERSION)
    : 10;
if (process && process.version) {
    const major = Number(process.version.match(/v([^.]+)/)[1]);
    if (major < minNodeVersion) {
        throw Error(`yargs supports a minimum Node.js version of ${minNodeVersion}. Read our version support policy: https://github.com/yargs/yargs#supported-nodejs-versions`);
    }
}
const Parser$1 = __nccwpck_require__(661);
const Yargs$1 = YargsWithShim(cjsPlatformShim);
var cjs = {
    applyExtends,
    cjsPlatformShim,
    Yargs: Yargs$1,
    argsert,
    globalMiddlewareFactory,
    isPromise,
    objFilter,
    parseCommand,
    Parser: Parser$1,
    processArgv,
    rebase,
    YError,
};

module.exports = cjs;


/***/ }),

/***/ 845:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

// TODO: consolidate on using a helpers file at some point in the future, which
// is the approach currently used to export Parser and applyExtends for ESM:
const {applyExtends, cjsPlatformShim, Parser, Yargs, processArgv} = __nccwpck_require__(10)
Yargs.applyExtends = (config, cwd, mergeExtends) => {
  return applyExtends(config, cwd, mergeExtends, cjsPlatformShim)
}
Yargs.hideBin = processArgv.hideBin
Yargs.Parser = Parser
module.exports = Yargs


/***/ }),

/***/ 222:
/***/ ((module) => {

function webpackEmptyContext(req) {
	var e = new Error("Cannot find module '" + req + "'");
	e.code = 'MODULE_NOT_FOUND';
	throw e;
}
webpackEmptyContext.keys = () => [];
webpackEmptyContext.resolve = webpackEmptyContext;
webpackEmptyContext.id = 222;
module.exports = webpackEmptyContext;

/***/ }),

/***/ 404:
/***/ ((module) => {

function webpackEmptyContext(req) {
	var e = new Error("Cannot find module '" + req + "'");
	e.code = 'MODULE_NOT_FOUND';
	throw e;
}
webpackEmptyContext.keys = () => [];
webpackEmptyContext.resolve = webpackEmptyContext;
webpackEmptyContext.id = 404;
module.exports = webpackEmptyContext;

/***/ }),

/***/ 357:
/***/ ((module) => {

"use strict";
module.exports = require("assert");;

/***/ }),

/***/ 747:
/***/ ((module) => {

"use strict";
module.exports = require("fs");;

/***/ }),

/***/ 622:
/***/ ((module) => {

"use strict";
module.exports = require("path");;

/***/ }),

/***/ 669:
/***/ ((module) => {

"use strict";
module.exports = require("util");;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId].call(module.exports, module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the module cache
/******/ 	__nccwpck_require__.c = __webpack_module_cache__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__nccwpck_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop)
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/node module decorator */
/******/ 	(() => {
/******/ 		__nccwpck_require__.nmd = (module) => {
/******/ 			module.paths = [];
/******/ 			if (!module.children) module.children = [];
/******/ 			return module;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	__nccwpck_require__.ab = __dirname + "/";/************************************************************************/
/******/ 	// module cache are used so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	return __nccwpck_require__(__nccwpck_require__.s = 490);
/******/ })()
;