describe("Builtins", () => {
	describe("LocalCache", () => {
		it("should be exported into the global environment", () => {
			assertEquals(LocalCache.name, "LocalCache");
		});

		let exportedApiSurface = ["getValue", "setValue", "clear", "evict", "load", "save", "setFilePath"];

		exportedApiSurface.forEach((namedExport) => {
			it("should export function " + namedExport, () => {
				const cache = new LocalCache("");
				assertEquals(typeof cache[namedExport], "function");
			});
		});

		it("should be able to set and retrieve values", () => {
			const cache = new LocalCache("");
			cache.setValue("someKey", 42);
			assertEquals(cache.getValue("someKey"), 42);
		});

		it("should be able to evict specific stored values", () => {
			const cache = new LocalCache("");
			cache.setValue("someKey", 42);
			assertEquals(cache.getValue("someKey"), 42);
			cache.evict("someKey");
			assertUndefined(cache.getValue("someKey"));
		});

		it("should be able to evict all stored values at once", () => {
			const cache = new LocalCache("");

			cache.setValue("key1", 42);
			cache.setValue("key2", 43);

			assertEquals(cache.getValue("key1"), 42);
			assertEquals(cache.getValue("key2"), 43);

			cache.evict();

			assertUndefined(cache.getValue("key1"));
			assertUndefined(cache.getValue("key2"));
		});

		// TBD: This is identical to evict(undefined), so maybe it should be consolidated?
		it("should be able to clear the internal key value store", () => {
			const cache = new LocalCache("");

			cache.setValue("key1", 42);
			cache.setValue("key2", 43);

			assertEquals(cache.getValue("key1"), 42);
			assertEquals(cache.getValue("key2"), 43);

			cache.clear();

			assertUndefined(cache.getValue("key1"));
			assertUndefined(cache.getValue("key2"));
		});

		it("should be able to save the key value store's contents to disk", () => {
			const filePath = "localTestCache_save.json";
			const cache = new LocalCache(filePath);

			cache.setValue("key1", 42);
			cache.setValue("key2", 43);
			assertFalse(C_FileSystem.fileExists(filePath));

			cache.save();
			assertTrue(C_FileSystem.fileExists(filePath));

			const contents = C_FileSystem.readJSON(filePath);
			assertEquals(contents["key1"], cache.getValue("key1"));
			assertEquals(contents["key2"], cache.getValue("key2"));

			// Cleanup
			C_FileSystem.removeFile(filePath);
			assertFalse(C_FileSystem.fileExists(filePath));
		});

		it("should be able to load the key value store's contents from disk", () => {
			const filePath = "localTestCache_load.json";
			const cache = new LocalCache(filePath);

			const expectedCacheContents = {
				keyThatDidNotExistBeforeLoading: 12345,
				shouldHaveDifferentValue: "This is the value that should be present",
			};

			// These value should be overwritten with a different one after loading
			cache.setValue("shouldHaveDifferentValue", 42);
			// This value should be discarded after loading
			cache.setValue("shouldBeUndefinedAfterLoading", 43);
			assertFalse(C_FileSystem.fileExists(filePath));
			C_FileSystem.writeJSON(filePath, expectedCacheContents);

			cache.load();

			assertEquals(cache.getValue("keyThatDidNotExistBeforeLoading"), 12345);
			assertEquals(cache.getValue("shouldHaveDifferentValue"), "This is the value that should be present");
			assertUndefined(cache.getValue("shouldBeUndefinedAfterLoading"));

			// Cleanup
			C_FileSystem.removeFile(filePath);
			assertFalse(C_FileSystem.fileExists(filePath));
		});
	});
});
