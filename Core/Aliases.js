// This isn't a proper IPC mirror! (see https://github.com/RevivalEngine/WebClient/issues/9)
const NODE = {
	FileSystem: require("fs"),
	Assert: require("assert"),
};

// Dependencies imported via their NPM package
const BABYLON = require("babylonjs/babylon.max"); // C_WebGL & C_Sound
const BITMAP = require("bmp-js"); // C_Bitmap
const MESSAGEPACK = require("@msgpack/msgpack"); // C_Message
const JOI = require("joi"); // C_Validation
const UUID = require("uuid"); // UniqueID builtin
const PNG = require("pngjs").PNG; // Bitmap serialization (better than zlib?)
const JPEG = require('jpeg-js');

// Yes, I really am that lazy.
const keys = Object.keys;
const values = Object.entries;

function count(object) {
	return Object.keys(object).length;
}

function dump(...data) {
	console.log(data);
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
