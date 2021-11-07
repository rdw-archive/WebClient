const Enum = {};

// This isn't a proper IPC mirror! (see https://github.com/RevivalEngine/WebClient/issues/9)
const NODE = {
	FileSystem: require("fs"),
};

// Dependencies imported via their NPM package
const BABYLON = require("babylonjs/babylon.max"); // C_WebGL & C_Sound
const BITMAP = require("bmp-js"); // C_Bitmap
const MESSAGEPACK = require("@msgpack/msgpack"); // C_Message
