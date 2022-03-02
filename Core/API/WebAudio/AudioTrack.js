class AudioTrack {
	constructor() {
		this.volume = 1;
		this.isTrackMuted = false;
		this.useHRTF = C_Settings.getValue("useHighQualityStereo");

		this.soundtrack = new BABYLON.SoundTrack();
	}
	getNumSounds() {
		return this.soundtrack.soundCollection.length;
	}
	getUniqueID() {
		return this.soundtrack.id;
	}
	addSound(sound) {
		this.soundtrack.addSound(sound);
		// BJS' internal audio buffer might not have been initialized if this is the first sound to be played
		// In that scenario, it uses the default volume gain of one if we don't tell it to update right away
		this.setVolume(this.volume);

		// We have to apply this again since the setting isn't passed to each source automatically (in BJS)
		if (this.isUsingHighQualityStereo()) this.useHighQualityStereo(true);
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
		if (this.isTrackMuted) return; // We don't want to change the volume until it's unmuted as there is no mute flag in BJS

		this.soundtrack.setVolume(volumeGain);
	}
	getVolume() {
		return this.volume;
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
	isPlaying() {
		let isPlayingSounds = false;
		this.soundtrack.soundCollection.forEach((sound) => {
			if (sound.isPlaying) isPlayingSounds = true;
		});
		return isPlayingSounds;
	}
}
