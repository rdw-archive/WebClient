// This isn't a proper IPC mirror! (see https://github.com/RevivalEngine/WebClient/issues/9)
const NODE = {
	FileSystem: require("fs"),
	Assert: require("assert"),
	path: require("path"),
	format: require("util").format,
};

const format = NODE.format;

// Dependencies imported via their NPM package
const BABYLON = require("babylonjs/babylon.max"); // C_WebGL & C_Sound
const BITMAP = require("bmp-js"); // C_Bitmap
const MESSAGEPACK = require("@msgpack/msgpack"); // C_Message
const JOI = require("joi"); // C_Validation
const UUID = require("uuid"); // UniqueID builtin
const BINPACK = require("maxrects-packer"); // For creating spritesheets

function dump(...data) {
	console.log(data);
}

function count(object) {
	return Object.keys(object).length;
}

function printf(message, ...rest) {
	// If we don't check the length, it will print an empty array when there are no parameters
	rest.length > 0 ? console.log(message, ...rest) : console.log(message);
}

// Explicitly export so that their presence can be tested for more easily
// BABYLON already exports itself globally by default
window.BITMAP = BITMAP;
window.JOI = JOI;
window.MESSAGEPACK = MESSAGEPACK;
window.NODE = NODE;
window.UUID = UUID;
