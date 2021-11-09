// tbd: differentiate between packed texture (this one) and regular ones (nyi)
class TextureAtlas {
	constructor(images = []) {
		this.regions = []; // tbd use frame index as key to later sync act and spr data?
		this.image = new Bitmap();
		this.clearColor = Color.MAGENTA;

		// tbd: always force power of two texture sizes?

		this.cellPaddingInPixels = 4;
	}
}
