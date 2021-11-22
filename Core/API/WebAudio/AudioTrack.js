// var format = require("util").format;

class AudioTrack {
	// static ERROR_INVALID_VOICE_HANDLE = "Invalid voice handle";
	constructor() {
		this.volume = 1; // TODO set for each track in C_WebAudio
		this.isTrackMuted = false;
		this.useHRTF = C_Settings.getValue("useHighQualityStereo"); // TODO update via options

		const currentScene = C_Rendering.getActiveScene();
		this.soundtrack = new BABYLON.SoundTrack(currentScene);
	}
	getNumSounds() {
		return this.soundtrack.soundCollection.length;
	}
	getUniqueID() {
		return this.soundtrack.id;
	}
	addSound(sound) {
		this.soundtrack.addSound(sound);
	}
	removeSound(sound) {
		this.soundtrack.removeSound(sound);
	}
	connectAnalyzer(analyzer) {
		this.soundtrack.connectToAnalyser(analyzer);
	}
	destroy() {
		this.soundtrack.dispose();
	}
	setVolume(volumeGain) {
		this.volume = volumeGain;
		if (this.isTrackMuted) return; // Do not change the actual volume until it's unmuted

		this.soundtrack.setVolume(volumeGain);
	}
	isMuted() {
		return this.isTrackMuted;
	}
	mute() {
		this.isTrackMuted = true;
		this.soundtrack.setVolume(0);
	}
	unmute() {
		this.isTrackMuted = false;
		this.soundtrack.setVolume(this.volume);
	}
	useHighQualityStereo(enabledFlag) {
		if (enabledFlag) this.soundtrack.switchPanningModelToHRTF();
		else this.soundtrack.switchPanningModelToEqualPower();

		this.useHRTF = enabledFlag;
	}
	isUsingHighQualityStereo() {
		return this.useHRTF;
	}
	fadeOutStop(fadeoutTimeInMilliseconds = 500) {
		this.soundtrack.soundCollection.forEach((sound) => {
			DEBUG("Cleaning up audio source " + sound.name + " (playback has ended)");
			sound.setVolume(0, fadeoutTimeInMilliseconds / 1000); // ms to s
			sound.stop(fadeoutTimeInMilliseconds / 1000);

			setTimeout(() => {
				// Defer cleanup so the fadeout has time to finish
				this.removeSound(sound);
				sound.dispose();
			}, fadeoutTimeInMilliseconds);
		});
	}
	// getAudioSource(soundHandleID) {
	// 	if (soundHandleID === undefined) throw new RangeError(AudioTrack.ERROR_INVALID_VOICE_HANDLE + ": " + soundHandleID);
	// 	return this.voices[soundHandleID];
	// }
	// addAudioSource(audioSource) {
	// 	const soundHandleID = audioSource.getUniqueID(); // New index at which the source will be inserted
	// 	audioSource.setVolume(this.volumeGain);
	// 	// Volumes need to be synchronized or some sounds will stick out like a sore thumb
	// 	this.voices[soundHandleID] = audioSource;
	// 	this.soundtrack.addSound(audioSource.sound);
	// 	audioSource.sound.onEndedObservable.add(() => {
	// 		DEBUG("Playback for audio source " + audioSource.uniqueID + " has ended");
	// 		this.removeAudioSource(soundHandleID);
	// 	});
	// 	this.numVoices++;
	// 	return soundHandleID;
	// }
	// removeAudioSource(soundHandleID) {
	// 	// ringbuffer, FIFO - size: music = 1, ambience = 10, sfx = 32, track.hasAudioSource to determine when it's removed? object pool?
	// 	DEBUG(format("Removing audio source %s", soundHandleID));
	// 	if (soundHandleID === undefined) {
	// 		throw new RangeError(AudioTrack.ERROR_INVALID_VOICE_HANDLE + ": " + soundHandleID);
	// 	}
	// 	const audioSource = this.voices[soundHandleID];
	// 	if (audioSource === undefined) return true;

	// 	audioSource.stopPlaying();
	// 	this.soundtrack.removeSound(audioSource.sound);
	// 	audioSource.destroy();

	// 	delete this.voices[soundHandleID];
	// 	this.numVoices--;

	// 	return audioSource;
	// }
	// purgeInactiveVoices() {
	// 	for (const soundHandleID of Object.keys(this.voices)) {
	// 		const audioSource = this.voices[soundHandleID];
	// 		if (!audioSource.isPlaying()) {
	// 			DEBUG(format("Purging inactive audio source %s (%s)", soundHandleID, audioSource.getFilePath()));
	// 			this.removeAudioSource(soundHandleID);
	// 		}
	// 	}
	// }
	// purgeAllVoices() {
	// 	for (const soundHandleID of Object.keys(this.voices)) {
	// 		const audioSource = this.voices[soundHandleID];
	// 		DEBUG(format("Purging audio source %s (%s)", soundHandleID, audioSource.getFilePath()));
	// 		this.removeAudioSource(soundHandleID);
	// 	}
	// }
	// fadeOutStop(fadeoutTimeInMilliseconds = 500) {
	// 	for (const soundHandleID of Object.keys(this.voices)) {
	// 		const audioSource = this.voices[soundHandleID];

	// 		audioSource.fadeOut(fadeoutTimeInMilliseconds);
	// 		audioSource.stopPlaying(fadeoutTimeInMilliseconds);
	// 	}
	// }
	// fadeInStart(fadeInTimeInMilliseconds = 500) {
	// 	for (const soundHandleID of Object.keys(this.voices)) {
	// 		const audioSource = this.voices[soundHandleID];
	// 		// Can't fade in properly if it starts blasting at a higher volume immediately
	// 		audioSource.setVolume(0);
	// 		audioSource.startPlaying();
	// 		audioSource.fadeIn(this.volumeGain, fadeInTimeInMilliseconds);
	// 		// audioSource.setVolume(this.volumeGain, timeToTransitionInMilliseconds);
	// 	}
	// }
	// getVolume() {
	// 	return this.volumeGain;
	// }
	// setVolume(volumeGain, timeToTransitionInMilliseconds = 0) {
	// 	this.volumeGain = volumeGain;
	// 	for (const soundHandleID of Object.keys(this.voices)) {
	// 		const audioSource = this.voices[soundHandleID];
	// 		audioSource.setVolume(volumeGain, timeToTransitionInMilliseconds);
	// 	}
	// }
	// getNumAudioSources() {
	// 	return this.numVoices;
	// }
	// getNumActiveVoices() {
	// 	let count = 0;

	// 	for (const soundHandleID of Object.keys(this.voices)) {
	// 		const audioSource = this.voices[soundHandleID];
	// 		if (audioSource.isPlaying()) count++;
	// 	}

	// 	return count;
	// }
}
