class Color {
	static RED = { red: 255, green: 0, blue: 0, alpha: 255 };
	static GREEN = { red: 0, green: 255, blue: 0, alpha: 255 };
	static BLUE = { red: 0, green: 0, blue: 255, alpha: 255 };
	static BLACK = { red: 0, green: 0, blue: 0, alpha: 255 };
	static WHITE = { red: 255, green: 255, blue: 255, alpha: 255 };
	static GREY = { red: 200, green: 200, blue: 200, alpha: 255 };
	static MAGENTA = { red: 255, green: 0, blue: 255, alpha: 255 };
	static PURPLE = { red: 200, green: 0, blue: 200, alpha: 255 };

	constructor(red, green, blue, alpha = 255) {
		this.red = red;
		this.green = green;
		this.blue = blue;
		this.alpha = alpha;
	}
}
