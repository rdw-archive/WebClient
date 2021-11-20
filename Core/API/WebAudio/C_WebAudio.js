// supported formats: mp3, ogg? (query chrome/electron)

const C_WebAudio = {
	tracks: {
		[Enum.AUDIO_CHANNEL_SFX]: new AudioTrack(),
		[Enum.AUDIO_CHANNEL_MUSIC]: new AudioTrack(),
		[Enum.AUDIO_CHANNEL_AMBIENCE]: new AudioTrack(),
	},
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
	musicFadeoutTimeInMilliseconds: 500,
	// Internally, BabylonJS appears to convert negative master gain values to positive ones
	// Since that seems counter-intuitive and weird, we simply disallow it
	ERROR_NEGATIVE_VOLUME_GAIN: "Cannot set negative volume gain; the lowest possible value is zero",
	ERROR_INVALID_TRACK_ID: "No such audio track exists",
	isSoundEnabled: true,
	playMusic(filePath) {
		validateString(filePath, "Usage: C_WebAudio.playMusic(String filePath)");

		if (!this.isSoundEnabled) return;

		const musicTrack = this.tracks[Enum.AUDIO_CHANNEL_MUSIC];
		this.stopMusic(); // Only one music track can play concurrently (effectively two voices that transition)

		const audioSource = new AudioSource(filePath);
		audioSource.playWhenReady(true);

		const soundHandleID = musicTrack.addAudioSource(audioSource);

		audioSource.setLooping(true);
		audioSource.setVolume(0);
		audioSource.startPlaying();
		audioSource.fadeIn(C_Settings.getValue("musicVolume"), this.musicTransitionTimeInMilliseconds);

		return soundHandleID;
	},
	playSound(filePath, trackID = Enum.AUDIO_CHANNEL_SFX, isLooping = false, volume = 1) {
		validateString(filePath, "Usage: playSound(String filePath [, String trackID, Boolean allowDuplicate])");

		if (!this.isSoundEnabled) return;

		const track = this.tracks[trackID];

		const audioSource = new AudioSource(filePath, { loop: isLooping, autoplay: !this.isSoundEnabled, volume: volume });
		if (isLooping) audioSource.setLooping(true);
		const soundHandleID = track.addAudioSource(audioSource);

		return soundHandleID;
	},
	stopMusic() {
		const musicTrack = this.tracks[Enum.AUDIO_CHANNEL_MUSIC];
		musicTrack.fadeOutStop(this.musicTransitionTimeInMilliseconds);
	},
	playEffectSound(filePath) {
		return this.playSound(filePath, Enum.AUDIO_CHANNEL_SFX, false, C_Settings.getValue("sfxVolume")); // SFX should never loop
	},
	playAmbientSound(filePath) {
		return this.playSound(filePath, Enum.AUDIO_CHANNEL_AMBIENCE, true, C_Settings.getValue("ambienceVolume")); // Ambient sounds should always loop
	},
	stopSound(soundHandleID, trackID = Enum.AUDIO_CHANNEL_SFX) {
		const track = this.tracks[trackID];
		track.removeAudioSource(soundHandleID);
	},
	stopAmbientSound(soundHandleID) {
		this.stopSound(soundHandleID, Enum.AUDIO_CHANNEL_AMBIENCE);
	},
	stopEffectSound(soundHandleID) {
		this.stopSound(soundHandleID, Enum.AUDIO_CHANNEL_SFX);
	},
	getTrackInfo(trackID) {
		validateString(trackID, "Usage: getTrackInfo(String trackID)");

		if (this.tracks[trackID] === undefined) throw new RangeError(this.ERROR_INVALID_TRACK_ID + ": " + trackID);

		return this.tracks[trackID];
	},
	createTrack(trackID) {
		validateString(trackID, "Usage: createTrack(String trackID)");

		const channel = this.tracks[trackID] || new AudioTrack(trackID);
		this.tracks[trackID] = channel;

		return channel;
	},
	getGlobalVolume() {
		return BABYLON.Engine.audioEngine.getGlobalVolume();
	},
	setGlobalVolume(volumeGain, persist = true) {
		if (volumeGain < 0) throw new RangeError(this.ERROR_NEGATIVE_VOLUME_GAIN);
		BABYLON.Engine.audioEngine.setGlobalVolume(volumeGain);

		if (!persist) return; // No need to save it since it's temporary
		C_Settings.setValue("globalVolume", volumeGain);
	},
	setTrackVolume(trackID, volumeGain, timeToTransitionInMilliseconds = 0) {
		if (volumeGain < 0) throw new RangeError(this.ERROR_NEGATIVE_VOLUME_GAIN);

		validateString(trackID, "Usage: setTrackVolume(String trackID, Number volumeGain)");
		validateNumber(volumeGain, "Usage: setTrackVolume(String trackID, Number volumeGain)");
		if (this.tracks[trackID] === undefined) throw new RangeError(this.ERROR_INVALID_TRACK_ID + ": " + trackID);

		this.tracks[trackID].setVolume(volumeGain, timeToTransitionInMilliseconds);
	},
	getTrackVolume(trackID) {
		validateString(trackID, "Usage: getTrackVolume(String trackID)");
		if (this.tracks[trackID] === undefined) throw new RangeError(this.ERROR_INVALID_TRACK_ID + ": " + trackID);
		return this.tracks[trackID].getVolume();
	},
	setMusicVolume(volumeGain, timeToTransitionInMilliseconds = 0) {
		// TODO Ensure 0 - 1 scale
		this.setTrackVolume(Enum.AUDIO_CHANNEL_MUSIC, volumeGain, timeToTransitionInMilliseconds); // fade
		C_Settings.setValue("musicVolume", volumeGain);
	},
	getMusicVolume() {
		return this.getTrackVolume(Enum.AUDIO_CHANNEL_MUSIC);
	},
	setEffectsVolume(volumeGain, timeToTransitionInMilliseconds = 0) {
		// TODO Ensure 0 - 1 scale
		this.setTrackVolume(Enum.AUDIO_CHANNEL_SFX, volumeGain, timeToTransitionInMilliseconds);
		C_Settings.setValue("sfxVolume", volumeGain);
	},
	getEffectsVolume() {
		return this.getTrackVolume(Enum.AUDIO_CHANNEL_SFX);
	},
	setAmbienceVolume(volumeGain, timeToTransitionInMilliseconds = 0) {
		// TODO Ensure 0 - 1 scale
		this.setTrackVolume(Enum.AUDIO_CHANNEL_AMBIENCE, volumeGain, timeToTransitionInMilliseconds);
		C_Settings.setValue("ambienceVolume", volumeGain);
	},
	getAmbienceVolume() {
		return this.getTrackVolume(Enum.AUDIO_CHANNEL_AMBIENCE);
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
		// With the current audio backend, this is always true - but I guess making it explicit is not a terrible idea
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

		this.setGlobalVolume(0);
		this.isSoundEnabled = false;
	},
	enableSound() {
		C_Settings.setValue("enableSound", true);
		this.setGlobalVolume(C_Settings.getValue("globalVolume"));
		this.isSoundEnabled = true;
	},
	// We can't apply these after the fact, since it's set at creation time for each audio source
	enableHighQualityStereo() {
		C_Settings.setValue("useHighQualityStereo", true);
		// TODO enable in each track
	},
	disableHighQualityStereo() {
		C_Settings.setValue("useHighQualityStereo", false);
		// TODO disable for each track
	},
	disableBackgroundFade() {
		C_Settings.setValue("fadeSoundInBackground", false);
		// TODO ViewportContainer stuff here?
	},
	enableBackgroundFade() {
		C_Settings.setValue("fadeSoundInBackground", true);
		// TODO ViewportContainer stuff here?
	},
	setBackgroundVolume(newVolumeGain) {
		// TODO ensure it's between 0 and 1
		C_Settings.setValue("backgroundAudioVolume", newVolumeGain);
	},
	enableMusicTrack() {
		C_Settings.setValue("enableMusic", true);
		// this.tracks[Enum.AUDIO_CHANNEL_MUSIC].fadeInStart();
		this.tracks[Enum.AUDIO_CHANNEL_MUSIC].setVolume(C_Settings.getValue("musicVolume"));
	},
	disableMusicTrack() {
		C_Settings.setValue("enableMusic", false);
		const musicTrack = this.tracks[Enum.AUDIO_CHANNEL_MUSIC];
		musicTrack.setVolume(0);
		// musicTrack.fadeOutStop();
		// musicTrack.purgeAllVoices();
	},
	disableEffectsTrack() {
		C_Settings.setValue("enableSFX", false);
		this.tracks[Enum.AUDIO_CHANNEL_SFX].setVolume(0);
	},
	enableEffectsTrack() {
		C_Settings.setValue("enableSFX", true);
		this.tracks[Enum.AUDIO_CHANNEL_SFX].setVolume(C_Settings.getValue("sfxVolume"));
	},
	disableAmbienceTrack() {
		C_Settings.setValue("enableAmbientSounds", false);
		this.tracks[Enum.AUDIO_CHANNEL_AMBIENCE].setVolume(0);
	},
	enableAmbienceTrack() {
		C_Settings.setValue("enableAmbientSounds", true);
		this.tracks[Enum.AUDIO_CHANNEL_AMBIENCE].setVolume(C_Settings.getValue("ambienceVolume"));
	},
	updateAudioChannels() {
		this.tracks[Enum.AUDIO_CHANNEL_MUSIC].setVolume(C_Settings.getValue("musicVolume"));
		this.tracks[Enum.AUDIO_CHANNEL_SFX].setVolume(C_Settings.getValue("sfxVolume"));
		this.tracks[Enum.AUDIO_CHANNEL_AMBIENCE].setVolume(C_Settings.getValue("ambienceVolume"));

		if (!C_Settings.getValue("enableSound")) this.disableSound();
		if (!C_Settings.getValue("enableMusic")) this.disableMusicTrack();
		if (!C_Settings.getValue("enableSFX")) this.disableEffectsTrack();
		if (!C_Settings.getValue("enableAmbientSounds")) this.disableAmbienceTrack();
	},
};

C_WebAudio.updateAudioChannels();
