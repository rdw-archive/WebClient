describe("AudioSource", () => {
	const previousGlobalVolume = C_WebAudio.getGlobalVolume(); // Backup, to restore afterwards
	before(() => {
		C_WebAudio.setGlobalVolume(0);
	}); // No need to play actual audio during these tests

	after(() => {
		C_WebAudio.setGlobalVolume(previousGlobalVolume);
	});

	const testSoundFilePath = path.join(WEBCLIENT_FIXTURES_DIR, "WebAudio", "dumbo.ogg");
	const instance = new AudioSource(testSoundFilePath);

	it("should be exported into the global environment", () => {
		assertEquals(typeof AudioSource.constructor, "function");
	});

	const exportedApiSurface = [
		"getPlaybackRate",
		"setPlaybackRate",
		"fadeIn",
		"fadeOut",
		"pause",
		"resume",
		"getVolume",
		"setVolume",
		"isPlaying",
		"startPlaying",
		"stopPlaying",
		"getFilePath",
		"destroy",
		"getUniqueID",
		"getCurrentTime",
	];

	exportedApiSurface.forEach((namedExport) => {
		it("should export function " + namedExport, () => {
			assertEquals(typeof instance[namedExport], "function");
		});
	});

	describe("getFilePath", () => {
		it("should return the resource URL that was used to create the audio source", () => {
			assertEquals(instance.getFilePath(), testSoundFilePath);
		});

		it("should always return an absolute path", () => {
			const path = require("path");
			assertTrue(path.isAbsolute(instance.getFilePath()));
		});
	});

	describe("isPlaying", () => {
		const instance = new AudioSource(testSoundFilePath);
		it("should return false before playback has started", () => {
			assertFalse(instance.isPlaying());
		});

		// it("should return true after playback has started", (done) => {
		// 	const someAudioSource = new AudioSource(testSoundFilePath);
		// 	someAudioSource.startPlaying();
		// 	setTimeout(() => {
		// 		assertTrue(someAudioSource.isPlaying());
		// 		done();
		// 	}, 250); // Give BJS some time to update the sound (for some reason it takes forever here...?)
		// });

		// it("should return false while playback is paused", (done) => {
		// 	instance.pause();
		// 	setTimeout(() => {
		// 		assertFalse(instance.isPlaying());
		// 		done();
		// 	}, 50); // Give BJS some time to update the sound
		// });

		// it("should return true after playback has resumed", (done) => {
		// 	instance.resume();
		// 	setTimeout(() => {
		// 		assertTrue(instance.isPlaying());
		// 		done();
		// 	}, 50); // Give BJS some time to update the sound
		// });

		// it("should return false after playback was stopped", (done) => {
		// 	instance.stopPlaying();
		// 	setTimeout(() => {
		// 		assertFalse(instance.isPlaying());
		// 		done();
		// 	}, 50); // Give BJS some time to update the sound
		// });
	});
	describe("getVolume", () => {
		it("should return the updated volume gain after it has been changed", () => {
			// Setup
			const previousVolume = instance.getVolume();

			instance.setVolume(0.123);
			assertEquals(instance.getVolume(), 0.123);

			// Teardown
			instance.setVolume(previousVolume);
		});
	});

	describe("setVolume", () => {
		it("should be able to adjust the volume if a valid volume gain was passed", () => {});

		const errorMessage = "Usage: AudioSource.setVolume(Number volumeGain, Number transitionTimeInMilliseconds)";
		const typeError = new TypeError(errorMessage);
		it("should throw a TypeError if the volume gain was of an invalid type", () => {
			assertThrows(() => instance.setVolume(null), typeError);
			assertThrows(() => instance.setVolume("hi"), typeError);
			assertThrows(() => instance.setVolume(() => console.log("test")), typeError);
			assertThrows(() => instance.setVolume({}), typeError);
			assertThrows(() => instance.setVolume([]), typeError);
		});

		it("should throw a RangeError if the volume gain is negative", () => {
			const rangeError = new RangeError(AudioSource.ERROR_NEGATIVE_VOLUME_GAIN);
			assertThrows(() => instance.setVolume(-1), rangeError);
		});

		it("should throw a TypeError if the transition time was of an invalid type", () => {
			assertThrows(() => instance.setVolume(1, null), typeError);
			assertThrows(() => instance.setVolume(1, "hi"), typeError);
			assertThrows(() => instance.setVolume(1, () => console.log("test")), typeError);
			assertThrows(() => instance.setVolume(1, {}), typeError);
			assertThrows(() => instance.setVolume(1, []), typeError);
		});

		it("should throw a RangeError if the transition time is negative", () => {
			const rangeError = new RangeError(AudioSource.ERROR_NEGATIVE_TRANSITION_TIME);
			assertThrows(() => instance.setVolume(1, -1), rangeError);
		});
	});

	describe("getCurrentTime", () => {
		const anotherInstance = new AudioSource(testSoundFilePath);

		it("should start at zero when the audio source was initialized", () => {
			assertEquals(anotherInstance.getCurrentTime(), 0);
		});

		// it("should advance when the audio source has started playing", (done) => {
		// 	anotherInstance.startPlaying();
		// 	setTimeout(() => {
		// 		// Due to how unreliable JavaScript timers are, we can't be more precise here
		// 		assertTrue(anotherInstance.getCurrentTime() > 0);
		// 		anotherInstance.stopPlaying();
		// 		done();
		// 	}, 50); // Give BJS some time to update the sound
		// });

		// it("should advance when the audio source has been resumed after pausing it", (done) => {
		// 	// This also covers pause and resume, respectively, at least as far as possible
		// 	let previousTime = anotherInstance.getCurrentTime();
		// 	anotherInstance.startPlaying();
		// 	setTimeout(() => {
		// 		// Due to how unreliable JavaScript timers are, we can't be more precise here
		// 		assertTrue(anotherInstance.getCurrentTime() > previousTime);
		// 		previousTime = anotherInstance.getCurrentTime();
		// 		anotherInstance.pause();
		// 	}, 50);

		// 	setTimeout(() => {
		// 		// It should not have advanced here
		// 		assertEquals(anotherInstance.getCurrentTime(), previousTime);
		// 		previousTime = anotherInstance.getCurrentTime();
		// 		anotherInstance.resume();
		// 	}, 100);

		// 	setTimeout(() => {
		// 		// It should have advanced here once again
		// 		assertTrue(anotherInstance.getCurrentTime() > previousTime);
		// 		anotherInstance.stopPlaying();
		// 		done();
		// 	}, 150);
		// });
	});

	describe("setPlaybackRate", () => {
		// Also covers getPlaybackRate, coincidentally
		it("should be able to adjust the playback rate", () => {
			instance.setPlaybackRate(0.15);
			const newPlaybackRate = instance.getPlaybackRate();
			assertEquals(newPlaybackRate, 0.15);
		});

		const rangeError = new RangeError(AudioSource.ERROR_INVALID_PLAYBACK_RATE);
		it("should throw a RangeError if the playback rate is negative", () => {
			assertThrows(() => instance.setPlaybackRate(-1), rangeError);
		});

		it("should throw a RangeError if the playback rate is zero", () => {
			assertThrows(() => instance.setPlaybackRate(0), rangeError);
		});

		const typeError = new TypeError("Usage: AudioSource.setPlaybackRate(Number newPlaybackRate)");
		it("should throw a TypeError if the playback rate is not a String", () => {
			assertThrows(() => instance.setPlaybackRate(null), typeError);
			assertThrows(() => instance.setPlaybackRate(undefined), typeError);
			assertThrows(() => instance.setPlaybackRate("Hi"), typeError);
			assertThrows(() => instance.setPlaybackRate([]), typeError);
			assertThrows(() => instance.setPlaybackRate({}), typeError);
			assertThrows(() => instance.setPlaybackRate(() => console.log("test")), typeError);
			assertThrows(() => instance.setPlaybackRate(NaN), typeError);
		});
	});

	describe("fadeIn", () => {
		// it("should fade the volume to the desired level over time", (done) => {
		// 	// This test can't be reversed, as BJS adjusts the volume setting instantly but doesn't expose the transitional values...
		// 	const volumeGain = 0.25;
		// 	const fadeInTimeInMilliseconds = 50;
		// 	instance.setVolume(0);
		// 	instance.fadeIn(volumeGain, fadeInTimeInMilliseconds);
		// 	setTimeout(() => {
		// 		assertEquals(instance.getVolume(), volumeGain);
		// 		done();
		// 	}, fadeInTimeInMilliseconds);
		// });

		it("should apply volume changes instantly if the fade time is zero", () => {
			// This, too, is unreliable because the volume change is always saved instantly by BJS...
			const volumeGain = 0.35;
			const fadeInTimeInMilliseconds = 0;
			instance.fadeIn(volumeGain, fadeInTimeInMilliseconds);
			assertEquals(instance.getVolume(), volumeGain);
		});

		const typeError = new TypeError(
			"Usage: AudioSource.fadeIn(Number volumeGain, Number transitionTimeInMilliseconds)"
		);
		it("should throw a TypeError if either of the parameters isn't a Number or undefined", () => {
			assertThrows(() => instance.fadeIn(null), typeError);
			assertThrows(() => instance.fadeIn(1, null), typeError);
			assertThrows(() => instance.fadeIn("hi", 1), typeError);
			assertThrows(() => instance.fadeIn(1, "hi"), typeError);
			assertThrows(() => instance.fadeIn(() => console.log("test"), 1), typeError);
			assertThrows(() => instance.fadeIn(1, () => console.log("test")), typeError);
			assertThrows(() => instance.fadeIn({}, 1), typeError);
			assertThrows(() => instance.fadeIn(1, {}), typeError);
			assertThrows(() => instance.fadeIn([], 1), typeError);
			assertThrows(() => instance.fadeIn(1, []), typeError);
		});

		it("should throw a RangeError if the volume level is negative", () => {
			const rangeError = new RangeError(AudioSource.ERROR_NEGATIVE_VOLUME_GAIN);
			assertThrows(() => instance.fadeIn(-1), rangeError);
		});

		it("should throw a RangeError if the fade-in time is negative", () => {
			const rangeError = new RangeError(AudioSource.ERROR_NEGATIVE_TRANSITION_TIME);
			assertThrows(() => instance.fadeIn(1, -42), rangeError);
		});
	});

	describe("fadeOut", () => {
		// it("should fade the volume out over time", (done) => {
		// 	// This test can't be reversed, as BJS adjusts the volume setting instantly but doesn't expose the transitional values...
		// 	const fadeOutTimeInMilliseconds = 50;
		// 	instance.setVolume(0.5);
		// 	instance.fadeOut(fadeOutTimeInMilliseconds);
		// 	setTimeout(() => {
		// 		assertEquals(instance.getVolume(), 0);
		// 		done();
		// 	}, fadeOutTimeInMilliseconds);
		// });

		it("should apply volume changes instantly if the fade time is zero", () => {
			// This, too, is unreliable because the volume change is always saved instantly by BJS...
			const fadeOutTimeInMilliseconds = 0;
			instance.fadeOut(fadeOutTimeInMilliseconds);
			assertEquals(instance.getVolume(), 0);
		});

		const typeError = new TypeError("Usage: AudioSource.fadeOut(Number timeToFadeOutCompletelyInMilliseconds)");
		it("should throw a TypeError if the fade-out time isn't a Number or undefined", () => {
			assertThrows(() => instance.fadeOut(null), typeError);
			assertThrows(() => instance.fadeOut("hi"), typeError);
			assertThrows(() => instance.fadeOut(() => console.log("test")), typeError);
			assertThrows(() => instance.fadeOut({}), typeError);
			assertThrows(() => instance.fadeOut([]), typeError);
		});

		it("should throw a RangeError if the fade-out time is negative", () => {
			const rangeError = new RangeError(AudioSource.ERROR_NEGATIVE_TRANSITION_TIME);
			assertThrows(() => instance.fadeOut(-42), rangeError);
		});
	});

	describe("getUniqueID", () => {
		it("should return a string identifier", () => {
			// We can't guarantee it will be unique, just that it will be extremely unlikely to not be unique...
			const guid = instance.getUniqueID();
			assertEquals(typeof guid, "string");
		});

		it("should return the same identifier if called repeatedly", () => {
			const guid1 = instance.getUniqueID();
			const guid2 = instance.getUniqueID();
			const guid3 = instance.getUniqueID();

			assertEquals(guid1, guid2);
			assertEquals(guid1, guid3);
		});
	});

	describe("destroy", () => {
		it("should return true when successfully disposing of the audio buffer", () => {
			assertTrue(instance.destroy());
		});

		it("should return false when the audio buffer has already been disposed of", () => {
			assertFalse(instance.destroy());
		});
	});
});
