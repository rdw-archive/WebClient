class ScriptObject {
	constructor() {}
	onLoad() {}
	onUpdate(deltaTime) {}
	getScript(event) {
		event = event.toLowerCase();
		return this_obj[event];
	}
	hasScript(event) {
		event = event.toLowerCase();
		return this_obj[event] !== undefined;
	}
	setScript(event, handler) {
		event = event.toLowerCase(); // The DOM event seem to be case sensitive? I'd rather write OnEvent than onevent, though
		this._obj[event] = handler;
	}
}
