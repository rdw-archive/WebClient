class Color {
	static RED = new Color(255, 0, 0, 255);
	static GREEN = new Color(0, 255, 0, 255);
	static BLUE = new Color(0, 0, 255, 255);
	static BLACK = new Color(0, 0, 0, 255);
	static WHITE = new Color(255, 255, 255, 255);
	static GREY = { red: 200, green: 200, blue: 200, alpha: 255 };
	static MAGENTA = new Color(255, 0, 255, 255);
	static PURPLE = { red: 200, green: 0, blue: 200, alpha: 255 };
	static TERRAIN_VISUALIZATION_COLORS = [
		{
			red: 165,
			green: 191,
			blue: 101,
		},
		{
			red: 0,
			green: 0,
			blue: 0,
		},
		{
			red: 38,
			green: 34,
			blue: 74,
		},
		{
			red: 82,
			green: 127,
			blue: 128,
		},
		{
			red: 76,
			green: 80,
			blue: 115,
		},
		{
			red: 193,
			green: 197,
			blue: 178,
		},
		{
			red: 60,
			green: 64,
			blue: 43,
		},
		{
			red: 255,
			green: 0,
			blue: 255,
		},
	];

	constructor(red, green, blue, alpha = 255) {
		this.red = red;
		this.green = green;
		this.blue = blue;
		this.alpha = alpha;

		this.bitsPerPixel = 8;
	}
	setColorDepth(bitsPerPixel) {
		if (bitsPerPixel === 8 && this.bitsPerPixel === 32) {
			this.red *= 255;
			this.green *= 255;
			this.blue *= 255;
			this.alpha *= 255;
		}

		if (bitsPerPixel === 32 && this.bitsPerPixel === 8) {
			this.red *= 1 / 255;
			this.green *= 1 / 255;
			this.blue *= 1 / 255;
			this.alpha *= 1 / 255;
		}

		this.bitsPerPixel = bitsPerPixel;
	}
	getColorDepth() {
		return this.bitsPerPixel;
	}
}
