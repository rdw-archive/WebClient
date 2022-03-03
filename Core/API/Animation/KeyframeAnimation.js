class KeyframeAnimation {
	constructor(options) {
		const name = options.name || new UniqueID().toString();
		const animationObject = new BABYLON.Animation(
			name,
			options.property,
			options.fps,
			options.type,
			options.loopMode,
			true
		);
		this.name = name;
		this.animationObject = animationObject;

		this.keyframes = [];
		this.animationObject.setKeys(this.keyframes);

		animationObject.enableBlending = false;
	}
	addFrame(animationKeyframe) {
		this.keyframes.push(animationKeyframe);
		// Just to be sure it's always updated
		this.animationObject.setKeys(this.keyframes);
	}
	getFrame(frameIndex) {
		return this.keyframes[frameIndex];
	}
	getObject() {
		// Only needed for BJS...
		return this.animationObject;
	}
}
