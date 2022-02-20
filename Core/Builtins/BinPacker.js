//TODO: Make sure that we never add so much padding that a texture is completely invisible on the atlas, or so much padding that the padded areas overlap

// Settings
const PACKING_MODE = ""; // TODO NYI
const ATLAS_PADDING = 128;
const ATLAS_BORDER = 128;

class BinPacker {
	constructor(atlasWidth, atlasHeight, padding = ATLAS_PADDING, border = ATLAS_BORDER) {
		const options = {
			smart: true,
			pot: true,
			square: true, // true for easier processing in BJS? need a JSON to define frames otherwise?
			allowRotation: false, // don't think BJS likes this very much
			tag: false, // ??
			border: ATLAS_BORDER, // NYI
		}; // Set packing options

		this.packer = new BINPACK.MaxRectsPacker(atlasWidth, atlasHeight, padding, options); // todo proper import (module)?
	}

	setFrames(frameData) {
		this.packer.addArray(frameData);
	}

	getNumBins() {
		return this.packer.bins.length;
	}

	getBin(index) {
		return this.packer.bins[index];
	}

	getRectangles() {
		return this.packer.bins[0].rects; // Only one is currently supported (TODO: What could possibly go wrong?)
	}
}
