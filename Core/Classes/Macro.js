class Macro {
	constructor(name = "", icon = DEFAULT_MACRO_ICON_PATH, text = "") {
		this.name = name;
		this.icon = icon;
		this.text = text;
	}
	getName() {
		return this.name;
	}
	getBody() {
		return this.text;
	}
	getIcon() {
		return this.icon;
	}
	setBody(newText) {
		this.text = newText;
	}
	setName(newName) {
		this.name = newName;
	}
	toJSON() {
		const serializedMacro = {
			name: this.name,
			icon: this.icon,
			text: this.text,
		};
		return serializedMacro;
	}
}
