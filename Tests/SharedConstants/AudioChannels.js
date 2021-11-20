const enumCategories = {
	"Audio Channels": {
		AUDIO_CHANNEL_SFX: "SFX",
		AUDIO_CHANNEL_MUSIC: "Music",
		AUDIO_CHANNEL_AMBIENCE: "Ambience",
	},
};

describe("Shared enumeration constants", () => {
	for (const namespace in enumCategories) {
		const testCases = enumCategories[namespace];

		describe(namespace, () => {
			for (const enumKey in testCases) {
				const expectedValue = testCases[enumKey];

				it("should export Enum key " + enumKey + " as " + expectedValue, () => {
					assertEquals(Enum[enumKey], expectedValue);
				});
			}
		});
	}
});
