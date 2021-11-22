class AudioSource {
	static ERROR_INVALID_PLAYBACK_RATE = "Cannot set negative or zero playback rate; only positive values are supported";
	static ERROR_NEGATIVE_VOLUME_GAIN = "Cannot set negative volume gain; the lowest possible value is zero";
	static ERROR_NEGATIVE_TRANSITION_TIME = "Cannot set negative time value; the lowest possible value is zero";
	static ERROR_SOUND_NOT_READY = "Cannot play before audio is decoded; wait for isReady() or use setAutoplay(true)";

	constructor(filePath) {
		this.filePath = filePath;

		// BJS doesn't expose this, so we have to store it at this level (at the risk of being wrong)
		this.playbackRate = 1;

		// May be fetched from disk (TODO: It's blocking, use async?)
		const resource = C_Decoding.decodeFile(filePath);
		this.uniqueID = new UniqueID();

		// BJS uses WebAudio's context.decodeAudio, which consumes the buffer, so we must copy it or the original will be empty (TODO: Test for this)
		function copy(src) {
			var dst = new ArrayBuffer(src.byteLength);
			new Uint8Array(dst).set(new Uint8Array(src));
			return dst;
		}
		const buffer = copy(resource.data);
		const currentScene = C_Rendering.getActiveScene();
		const sound = new BABYLON.Sound(this.getUniqueID(), buffer, currentScene);

		// Apply some sane defaults (can be overwritten at will)
		sound.spatialSound = true;
		sound.loop = false;
		sound.autoplay = false;
		sound.maxDistance = 100;
		sound.distanceModel = "linear";

		this.sound = sound;
		this.useHighQualityStereo(C_Settings.getValue("useHighQualityStereo"));
	}
	isUsingHighQualityStereo() {
		return this.isUsingHRTF;
	}
	useHighQualityStereo(enabledFlag) {
		// TODO Ensure only boolean can be passed
		if (!enabledFlag) this.sound.switchPanningModelToEqualPower();
		else this.sound.switchPanningModelToHRTF();

		this.isUsingHRTF = enabledFlag;
	}
	getDistanceModel() {
		return this.sound.distanceModel;
	}
	setDistanceModel(newDistanceModel) {
		// TODO Ensure it's a valid model string
		this.sound.distanceModel = newDistanceModel;
	}
	playWhenReady(shouldPlayOnLoad) {
		this.sound.autoplay = shouldPlayOnLoad;
	}
	setMaxDistance(distanceInWorldUnits) {
		this.sound.maxDistance = distanceInWorldUnits;
	}
	getMaxDistance() {
		return this.sound.maxDistance;
	}
	setLooping(isLooping) {
		return (this.sound.loop = isLooping);
	}
	isLooping() {
		return this.sound.loop;
	}
	isSpatialized() {
		return this.sound.spatialSound;
	}
	setSpatialized(isSoundSpatialized) {
		this.sound.spatialSound = isSoundSpatialized;
	}
	getFilePath() {
		return this.filePath;
	}
	startPlaying(transitionTimeInMilliseconds = 0) {
		this.playWhenReady(true); // Needed if the audio is still decoding (awkward...)
		this.sound.play(transitionTimeInMilliseconds / 1000); // ms to sec
	}
	stopPlaying(timeToFadeOutCompletelyInMilliseconds = 0) {
		this.sound.stop(timeToFadeOutCompletelyInMilliseconds / 1000); // ms to sec
	}
	isPaused() {
		return this.sound.isPaused;
	}
	isPlaying() {
		return this.sound.isPlaying;
	}
	setVolume(volumeGain, transitionTimeInMilliseconds = 0) {
		const usageError = "Usage: AudioSource.setVolume(Number volumeGain, Number transitionTimeInMilliseconds)";
		validateNumber(volumeGain, usageError);
		validateNumber(transitionTimeInMilliseconds, usageError);

		if (volumeGain < 0) throw new RangeError(AudioSource.ERROR_NEGATIVE_VOLUME_GAIN);
		if (transitionTimeInMilliseconds < 0) throw new RangeError(AudioSource.ERROR_NEGATIVE_TRANSITION_TIME);

		this.sound.setVolume(volumeGain, transitionTimeInMilliseconds / 1000); // ms to sec
	}
	getVolume() {
		return this.sound.getVolume();
	}
	pause() {
		this.sound.pause();
	}
	resume() {
		this.sound.play();
	}
	getCurrentTime() {
		return this.sound.currentTime * 1000; // s to ms
	}
	fadeOut(timeToFadeOutCompletelyInMilliseconds = 0) {
		const usageError = "Usage: AudioSource.fadeOut(Number timeToFadeOutCompletelyInMilliseconds)";
		validateNumber(timeToFadeOutCompletelyInMilliseconds, usageError);

		if (timeToFadeOutCompletelyInMilliseconds < 0) throw new RangeError(AudioSource.ERROR_NEGATIVE_TRANSITION_TIME);
		this.setVolume(0, timeToFadeOutCompletelyInMilliseconds);
	}
	fadeIn(volumeGain = 1, transitionTimeInMilliseconds = 0) {
		const usageError = "Usage: AudioSource.fadeIn(Number volumeGain, Number transitionTimeInMilliseconds)";
		validateNumber(volumeGain, usageError);
		validateNumber(transitionTimeInMilliseconds, usageError);

		if (volumeGain < 0) throw new RangeError(AudioSource.ERROR_NEGATIVE_VOLUME_GAIN);
		if (transitionTimeInMilliseconds < 0) throw new RangeError(AudioSource.ERROR_NEGATIVE_TRANSITION_TIME);

		this.setVolume(volumeGain, transitionTimeInMilliseconds);
	}
	getPlaybackRate() {
		return this.playbackRate;
	}
	setPlaybackRate(newPlaybackRate) {
		validateNumber(newPlaybackRate, "Usage: AudioSource.setPlaybackRate(Number newPlaybackRate)");

		if (newPlaybackRate <= 0) throw new RangeError(AudioSource.ERROR_INVALID_PLAYBACK_RATE);

		this.playbackRate = newPlaybackRate;
		this.sound.setPlaybackRate(newPlaybackRate);
	}
	getUniqueID() {
		return this.uniqueID.toString();
	}
	destroy() {
		if (this.sound === null) return false; // Already destroyed; all operations should fail

		this.sound.dispose();
		this.sound = null;

		return true;
	}
}
