var format = require("util").format;

class AudioTrack {
	static ERROR_INVALID_VOICE_HANDLE = "Invalid voice handle";
	constructor() {
		// this.isPlaying = false;
		// this.volumePercent = null;
		this.voices = {};
		this.volumeGain = 1;
		this.numVoices = 0;

		const currentScene = C_Rendering.getActiveScene();
		this.soundtrack = new BABYLON.SoundTrack(currentScene);
	}
	getAudioSource(soundHandleID) {
		if (soundHandleID === undefined) throw new RangeError(AudioTrack.ERROR_INVALID_VOICE_HANDLE + ": " + soundHandleID);
		return this.voices[soundHandleID];
	}
	addAudioSource(audioSource) {
		const soundHandleID = audioSource.getUniqueID(); // New index at which the source will be inserted
		audioSource.setVolume(this.volumeGain);
		// Volumes need to be synchronized or some sounds will stick out like a sore thumb
		this.voices[soundHandleID] = audioSource;
		this.soundtrack.addSound(audioSource.sound);
		audioSource.sound.onEndedObservable.add(() => {
			DEBUG("Playback for audio source " + audioSource.uniqueID + " has ended");
			this.removeAudioSource(soundHandleID);
		});
		this.numVoices++;
		return soundHandleID;
	}
	removeAudioSource(soundHandleID) {
		// ringbuffer, FIFO - size: music = 1, ambience = 10, sfx = 32, track.hasAudioSource to determine when it's removed? object pool?
		DEBUG(format("Removing audio source %s", soundHandleID));
		if (soundHandleID === undefined) {
			throw new RangeError(AudioTrack.ERROR_INVALID_VOICE_HANDLE + ": " + soundHandleID);
		}
		const audioSource = this.voices[soundHandleID];
		if (audioSource === undefined) return true;

		audioSource.stopPlaying();
		this.soundtrack.removeSound(audioSource.sound);
		audioSource.destroy();

		delete this.voices[soundHandleID];
		this.numVoices--;

		return audioSource;
	}
	purgeInactiveVoices() {
		for (const soundHandleID of Object.keys(this.voices)) {
			const audioSource = this.voices[soundHandleID];
			if (!audioSource.isPlaying()) {
				DEBUG(format("Purging inactive audio source %s (%s)", soundHandleID, audioSource.getFilePath()));
				this.removeAudioSource(soundHandleID);
			}
		}
	}
	purgeAllVoices() {
		for (const soundHandleID of Object.keys(this.voices)) {
			const audioSource = this.voices[soundHandleID];
			DEBUG(format("Purging audio source %s (%s)", soundHandleID, audioSource.getFilePath()));
			this.removeAudioSource(soundHandleID);
		}
	}
	fadeOutStop(fadeoutTimeInMilliseconds = 500) {
		for (const soundHandleID of Object.keys(this.voices)) {
			const audioSource = this.voices[soundHandleID];

			audioSource.fadeOut(fadeoutTimeInMilliseconds);
			audioSource.stopPlaying(fadeoutTimeInMilliseconds);
		}
	}
	fadeInStart(fadeInTimeInMilliseconds = 500) {
		for (const soundHandleID of Object.keys(this.voices)) {
			const audioSource = this.voices[soundHandleID];
			// Can't fade in properly if it starts blasting at a higher volume immediately
			audioSource.setVolume(0);
			audioSource.startPlaying();
			audioSource.fadeIn(this.volumeGain, fadeInTimeInMilliseconds);
			// audioSource.setVolume(this.volumeGain, timeToTransitionInMilliseconds);
		}
	}
	getVolume() {
		return this.volumeGain;
	}
	setVolume(volumeGain, timeToTransitionInMilliseconds = 0) {
		this.volumeGain = volumeGain;
		for (const soundHandleID of Object.keys(this.voices)) {
			const audioSource = this.voices[soundHandleID];
			audioSource.setVolume(volumeGain, timeToTransitionInMilliseconds);
		}
	}
	getNumAudioSources() {
		return this.numVoices;
	}
	getNumActiveVoices() {
		let count = 0;

		for (const soundHandleID of Object.keys(this.voices)) {
			const audioSource = this.voices[soundHandleID];
			if (audioSource.isPlaying()) count++;
		}

		return count;
	}
}
