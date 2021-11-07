function LibInclude_LoadFile(filePath, onLoadedCallback) {
	console.log("Including file " + filePath);
	let script = document.createElement("script");
	script.onload = function () {
		console.log("[LibInclude] File " + filePath + " is now available");

		if (onLoadedCallback instanceof Function) {
			onLoadedCallback();
		}
	};

	script.src = filePath;
	script.async = false;
	document.head.appendChild(script);
}

function LibInclude_LoadBatch(files, onLoadCallback) {
	let batchSize = files.length;
	console.log("[LibInclude] Including batch of " + batchSize + " files");

	let numLoadedFiles = 0;
	let onFileLoaded = function () {
		numLoadedFiles++;
		console.log("[LibInclude] Loaded " + numLoadedFiles + " out of " + batchSize + " files");
		if (numLoadedFiles === batchSize) {
			onLoadCallback();
		}
	};

	for (let index = 0; index < batchSize; index++) {
		let filePath = files[index];
		LibInclude_LoadFile(filePath, onFileLoaded);
	}
}
