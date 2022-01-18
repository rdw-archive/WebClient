class Color {
	static RED = { red: 255, green: 0, blue: 0, alpha: 255 };
	static GREEN = { red: 0, green: 255, blue: 0, alpha: 255 };
	static BLUE = { red: 0, green: 0, blue: 255, alpha: 255 };
	static BLACK = { red: 0, green: 0, blue: 0, alpha: 255 };
	static WHITE = { red: 255, green: 255, blue: 255, alpha: 255 };
	static GREY = { red: 200, green: 200, blue: 200, alpha: 255 };
	static MAGENTA = { red: 255, green: 0, blue: 255, alpha: 255 };
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
	}
	copy() {
		return new Color(this.red, this.green, this.blue, this.alpha);
	}
}
