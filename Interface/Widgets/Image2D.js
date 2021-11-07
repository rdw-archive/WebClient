// Widget container for an image that can be rendered on the UI layer. Pixel data is the expected form, as it's easily converted.
class Image2D extends Widget {
	constructor(bitmap, widgetName, parentFrame, template) {
		// tbd bitmap should be moved to function setBitmap?
		super(widgetName, parentFrame, template);
		const canvas = new Canvas(widgetName + "Canvas"); // tbd width, height parameters here?
		// canvas._obj:remove() -- We only want an internal representation, not an actual display element

		const context = canvas._obj.getContext("2d"); // tbd better API: Canvas.getPixelData() ?

		// canvas._obj.className = "ImagePreviewCanvas";
		// canvas._obj.id = name;

		canvas._obj.width = bitmap.width;
		canvas._obj.height = bitmap.height;

		this.pixelData = bitmap.pixelData;
		this.width = bitmap.width;
		this.height = bitmap.height;

		const pixelData = new Uint8ClampedArray(bitmap.pixelData); // tbd not needed?
		console.log(bitmap);
		const imageData = new ImageData(pixelData, bitmap.width, bitmap.height);
		context.putImageData(imageData, 0, 0);

		this.context = context;
		this.canvas = canvas;
		this._obj = canvas;
		canvas.setName(widgetName);
		canvas.setParent(parentFrame);
		this.imageData = imageData;
	}
	setScript(...args) {
		this.canvas.setScript(...args);
	}
	clearTransparentPixels(transparentColor) {
		// transparentColor = Color.MAGENTA ?
		const pixels = this.imageData.data;

		const r = 0,
			g = 1,
			b = 2,
			a = 3;
		for (let p = 0; p < pixels.length; p += 4) {
			if (pixels[p + r] >= 0xfe && pixels[p + g] < 0x04 && pixels[p + b] >= 0xfe) {
				// if magenta then change alpha to 0
				pixels[p + a] = 0;
				// pixels[p + a] = 255;

				// 7c6f6f
				// pixels[p + r] = 0x7c;
				// pixels[p + g] = 0x6f;
				// pixels[p + b] = 0x6f;
			}
		}

		this.context.putImageData(this.imageData, 0, 0);
	}
	setBitmap(bitmap) {
		const imageData = new ImageData(bitmap.pixelData, bitmap.width, bitmap.height);
		// reclear pixels? sigh
		this.imageData = imageData;
		this.context.putImageData(this.imageData, 0, 0);
	}
}
