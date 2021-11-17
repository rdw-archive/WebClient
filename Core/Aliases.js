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

function dump(...data) {
	console.log(data);
}

function printf(message, ...rest) {
	// If we don't check the length, it will print an empty array when there are no parameters
	rest.length > 0 ? console.log(message, ...rest) : console.log(message);
}
