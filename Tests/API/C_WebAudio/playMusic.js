describe("playMusic", () => {
	// beforeEach(() => C_WebAudio.getTrackInfo(Enum.AUDIO_CHANNEL_MUSIC).purgeAllVoices());
	afterEach(() => C_WebAudio.getTrackInfo(Enum.AUDIO_CHANNEL_MUSIC).purgeAllVoices());

	// We have to wait for the audio engine to load files from disk and start playback... This test is sketchy :(
	const ANTICIPATED_IO_DELAY = 150; // Not sure if this works on the CI runner, will have to see...

	const path = require("path");
	const testSoundFilePath = path.join(WEBCLIENT_FIXTURES_DIR, "WebAudio", "dumbo.ogg");
	const anotherSoundFilePath = path.join(WEBCLIENT_FIXTURES_DIR, "WebAudio", "dumbo2.ogg");

	it("should be exported as part of the API surface", () => {
		assertEquals(typeof C_WebAudio.playMusic, "function");
	});

	it("should be able to play music if a valid file path was passed", () => {
		const musicTrack = C_WebAudio.getTrackInfo(Enum.AUDIO_CHANNEL_MUSIC);

		const validFilePath = testSoundFilePath;
		assertEquals(musicTrack.getNumAudioSources(), 0);
		const soundHandleID = C_WebAudio.playMusic(validFilePath);
		assertEquals(musicTrack.getNumAudioSources(), 1);
		const audioSource = musicTrack.getAudioSource(soundHandleID);
		assertEquals(audioSource.getFilePath(), validFilePath);

		C_WebAudio.stopMusic();
		musicTrack.purgeAllVoices(); // The WebAudio API doesn't do this since the track is still fading out
		// setTimeout(() => {
		assertEquals(0, musicTrack.getNumActiveVoices());
		assertEquals(0, musicTrack.getNumAudioSources());
		// done();
		// }, 2*C_WebAudio.musicFadeoutTimeInMilliseconds);
	});

	const expectedErrorMessage = "Usage: C_WebAudio.playMusic(String filePath)";
	const typeError = new TypeError(expectedErrorMessage);
	it("should throw a TypeError if no file path was passed", () => {
		const musicTrack = C_WebAudio.getTrackInfo(Enum.AUDIO_CHANNEL_MUSIC); // TODO getMusicTrack, getAmbienceTrack, getEffectsTrack shortcuts
		assertEquals(0, musicTrack.getNumAudioSources());
		assertThrows(() => C_WebAudio.playMusic(), typeError);
		assertEquals(0, musicTrack.getNumAudioSources());
	});

	it("should throw a TypeError if the file path is not a String", () => {
		// TODO: DRY, move to fixtures
		const invalidValues = [
			42,
			[42],
			{ 42: 42 },
			() => {
				let there = "peace";
			},
			C_WebAudio,
		];

		invalidValues.forEach((invalidValue) => {
			const musicTrack = C_WebAudio.getTrackInfo(Enum.AUDIO_CHANNEL_MUSIC); // TODO getMusicTrack, getAmbienceTrack, getEffectsTrack shortcuts
			assertEquals(0, musicTrack.getNumAudioSources());
			assertThrows(() => C_WebAudio.playMusic(invalidValue), typeError);
			assertEquals(0, musicTrack.getNumAudioSources());
		});
	});

	it("should stop playing the previous music", function () {
		const musicTrack = C_WebAudio.getTrackInfo(Enum.AUDIO_CHANNEL_MUSIC);
		assertEquals(0, musicTrack.getNumAudioSources());
		const soundHandleID = C_WebAudio.playMusic(testSoundFilePath);
		assertEquals(1, musicTrack.getNumAudioSources());
		const audioSource = musicTrack.getAudioSource(soundHandleID);

		// This will actually play the sounds even in CLI mode as it's still running Chromium
		// Since that's rather annoying, let's mute the sound temporarily
		// const originalVolume = C_WebAudio.getMusicVolume();
		// C_WebAudio.setMusicVolume(0);

		// setTimeout(() => {
		// 	assertTrue(audioSource.isPlaying());

		// 	// It doesn't really matter that both audio sources play back the same file, as they're two independent streams

		// 	assertEquals(musicTrack.getNumAudioSources(), 1);
		// 	const newHandle = C_WebAudio.playMusic(anotherSoundFilePath);
		// 	assertEquals(musicTrack.getNumAudioSources(), 1);
		// 	const newAudioSource = musicTrack.getAudioSource(newHandle);

		// 	// Technically, playback might not have started yet, but we assume it will shortly
		// 	setTimeout(() => {
		// 		assertFalse(audioSource.isPlaying());
		// 		assertTrue(newAudioSource.isPlaying());

		// 		C_WebAudio.stopMusic();
		// 		assertEquals(0, musicTrack.getNumAudioSources());
		// 		C_WebAudio.setMusicVolume(originalVolume);

		// 		done();
		// 	}, ANTICIPATED_IO_DELAY);
		// }, ANTICIPATED_IO_DELAY);
	});

	// This might be important during scene transitions, if the same track applies to both
	it("should do nothing if the same music source is requested while it's still playing", function () {
		const musicTrack = C_WebAudio.getTrackInfo(Enum.AUDIO_CHANNEL_MUSIC);
		assertEquals(0, musicTrack.getNumAudioSources());
		const handle = C_WebAudio.playMusic(testSoundFilePath);
		assertEquals(1, musicTrack.getNumAudioSources());

		// setTimeout(() => {
		// 	const handle2 = C_WebAudio.playMusic(testSoundFilePath);
		// 	assertEquals(1, musicTrack.getNumAudioSources());
		// 	const handle3 = C_WebAudio.playMusic(testSoundFilePath);
		// 	assertEquals(1, musicTrack.getNumAudioSources());
		// 	const handle4 = C_WebAudio.playMusic(testSoundFilePath);
		// 	assertEquals(1, musicTrack.getNumAudioSources());

		// 	// It should just return the currently playing music, without creating new audio sources
		// 	assertEquals(handle, handle2);
		// 	assertEquals(handle, handle3);
		// 	assertEquals(handle, handle4);

		// 	// Make sure it's still playing, though...
		// 	const audioSource = musicTrack.getAudioSource(handle);
		// 	assertTrue(audioSource.isPlaying());
		// 	assertEquals(1, musicTrack.getNumAudioSources());
		// 	C_WebAudio.stopMusic();
		// 	assertEquals(0, musicTrack.getNumAudioSources());
		// 	done();
		// }, ANTICIPATED_IO_DELAY);
	});
});
