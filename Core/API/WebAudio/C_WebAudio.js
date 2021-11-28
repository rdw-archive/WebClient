const C_WebAudio = {
	musicTrack: new AudioTrack(),
	sfxTrack: new AudioTrack(),
	ambienceTrack: new AudioTrack(),
	// This is needed to initialize the engine (before playback can start)
	// Otherwise the first playback is delayed as it also initializes the engine, and global volume is unavailable
	audioContext: BABYLON.Engine.audioEngine.audioContext,
	// Only mp3 and ogg are supported by default, but users (and addons) could add support for other formats
	supportedFormats: {
		// Note: Always use lower case extensions, as the C_Decoder interface will remove any capitalization
		ogg: true,
		mp3: true,
		wav: true,
	},
	isSoundEnabled: true,
	musicTransitionTimeInMilliseconds: 500,
	// Internally, BabylonJS appears to convert negative master gain values to positive ones
	// Since that seems counter-intuitive and weird, we simply disallow it
	ERROR_NEGATIVE_VOLUME_GAIN: "Cannot set negative volume gain; the lowest possible value is zero",
	playMusic(filePath) {
		validateString(filePath, "Usage: C_WebAudio.playMusic(String filePath)");
		if (!this.isSoundEnabled) return;

		this.stopMusic(); // Only one music track can play concurrently or things will sound weird

		const resource = C_Decoding.decodeFile(filePath);
		const soundID = new UniqueID().toString();

		// BJS consumes the buffer, so we must copy it lest the version stored in the resource cache be rendered unusable
		const buffer = resource.toArrayBuffer();
		const currentScene = C_Rendering.getActiveScene();
		const sound = new BABYLON.Sound(soundID, buffer, currentScene);

		// For now, all background music is played automatically (to simplify the loading process) and looping (design decision)
		sound.autoplay = true;
		sound.loop = true;

		this.musicTrack.addSound(sound);

		return sound;
	},
	stopMusic() {
		// For now, all music fadeouts use a fixed transition (design decision; may be revisited in the future)
		this.musicTrack.fadeOutStop(this.musicTransitionTimeInMilliseconds);
	},
	isPlayingMusic() {
		return this.musicTrack.isPlaying();
	},
	getGlobalVolume() {
		return BABYLON.Engine.audioEngine.getGlobalVolume();
	},
	// The persist flag is used to temporarily reduce volume when the "Lower Volume in Background" setting is on
	setGlobalVolume(volumeGain, persist = true) {
		if (volumeGain < 0) throw new RangeError(this.ERROR_NEGATIVE_VOLUME_GAIN);

		if (persist === true) C_Settings.setValue("globalVolume", volumeGain);
		if (!this.isSoundEnabled) return;

		// Defer the actual volume adjustment until sound is unmuted so as to not override the mute status
		// Note: Since BJS doesn't support properly muting a track, we have to simulate it - hence this crutch
		BABYLON.Engine.audioEngine.setGlobalVolume(volumeGain);
	},
	setMusicVolume(volumeGain) {
		if (volumeGain < 0) throw new RangeError(this.ERROR_NEGATIVE_VOLUME_GAIN);

		this.musicTrack.setVolume(volumeGain);
		C_Settings.setValue("musicVolume", volumeGain);
	},
	getMusicVolume() {
		return this.musicTrack.getVolume();
	},
	setEffectsVolume(volumeGain) {
		if (volumeGain < 0) throw new RangeError(this.ERROR_NEGATIVE_VOLUME_GAIN);

		this.sfxTrack.setVolume(volumeGain);
		C_Settings.setValue("sfxVolume", volumeGain);
	},
	getEffectsVolume() {
		return this.sfxTrack.getVolume();
	},
	setAmbienceVolume(volumeGain) {
		if (volumeGain < 0) throw new RangeError(this.ERROR_NEGATIVE_VOLUME_GAIN);

		this.ambienceTrack.setVolume(volumeGain);
		C_Settings.setValue("ambienceVolume", volumeGain);
	},
	getAmbienceVolume() {
		return this.ambienceTrack.getVolume();
	},
	isAudioContextInitialized() {
		// The AudioContext interface is from a TypeScript definition in BJS; it seems we can't access it directly here
		return this.audioContext.constructor.name === "AudioContext";
	},
	isAudioAvailable() {
		return BABYLON.Engine.audioEngine.canUseWebAudio;
	},
	canPlayMP3() {
		return BABYLON.Engine.audioEngine.isMP3supported;
	},
	canPlayOGG() {
		return BABYLON.Engine.audioEngine.isOGGsupported;
	},
	canPlayWAV() {
		// With the current audio backend, this is always true - but I guess making it explicit isn't a terrible idea
		return true;
	},
	getSupportedFileFormats() {
		return this.supportedFormats;
	},
	isSoundDisabled() {
		return this.isSoundEnabled;
	},
	disableSound() {
		C_Settings.setValue("enableSound", false);

		this.setGlobalVolume(0, false);
		this.isSoundEnabled = false;
	},
	enableSound() {
		C_Settings.setValue("enableSound", true);
		this.isSoundEnabled = true;
		this.setGlobalVolume(C_Settings.getValue("globalVolume"));
	},
	useHighQualityStereo(enabledFlag) {
		C_Settings.setValue("useHighQualityStereo", enabledFlag);
		this.musicTrack.useHighQualityStereo(enabledFlag);
		this.sfxTrack.useHighQualityStereo(enabledFlag);
		this.ambienceTrack.useHighQualityStereo(enabledFlag);
	},
	setBackgroundFade(enabledFlag) {
		C_Settings.setValue("fadeSoundInBackground", enabledFlag);
	},
	setBackgroundVolume(volumeGain) {
		if (volumeGain < 0) throw new RangeError(this.ERROR_NEGATIVE_VOLUME_GAIN);

		C_Settings.setValue("backgroundAudioVolume", volumeGain);
	},
	enableMusicTrack() {
		C_Settings.setValue("enableMusic", true);
		this.musicTrack.unmute();
	},
	disableMusicTrack() {
		C_Settings.setValue("enableMusic", false);
		this.musicTrack.mute();
	},
	disableEffectsTrack() {
		C_Settings.setValue("enableSFX", false);
		this.sfxTrack.mute();
	},
	enableEffectsTrack() {
		C_Settings.setValue("enableSFX", true);
		this.sfxTrack.unmute();
	},
	disableAmbienceTrack() {
		C_Settings.setValue("enableAmbientSounds", false);
		this.ambienceTrack.mute();
	},
	enableAmbienceTrack() {
		C_Settings.setValue("enableAmbientSounds", true);
		this.ambienceTrack.unmute();
	},
};
