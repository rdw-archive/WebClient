const C_Rendering = {
	fogNearLimitPercent: 100,
	fogMinDistanceInWorldUnits: 15,
	fogMaxDistanceInWorldUnits: 15,
	fogNearLimit: 1,
	fogFarLimit: 1,
	exponentialFogDensity: 15,
	fogMode: Enum.FOG_MODE_LINEAR,
	clearColor: "#7B7BA5",
	defaultClearColor: "#0077FF",
	fogColor: Color.GREY,
	renderer: new Renderer(window["WorldFrame"]),
	scheduledMultiFrameTasks: {},
};

// Creates a new renderer for the WorldFrame canvas and immediately renders the active scene.
// Note: Only one renderer/scene/canvas is currently supported.
C_Rendering.startRenderLoop = function () {
	function onCurrentFrameFinishedRendering() {
		const deltaTime = C_Rendering.renderer.deltaTime;
		C_EventSystem.triggerEvent("RENDER_LOOP_UPDATE", deltaTime);
		C_Rendering.renderer.renderNextFrame();
	}
	this.renderer.startRendering(onCurrentFrameFinishedRendering);
};

C_Rendering.setFogParameters = function (fogParameters) {
	this.fogNearLimitPercent = fogParameters.start * C_Rendering.fogMinDistanceInWorldUnits * 100;
	this.fogFarLimit = fogParameters.end * C_Rendering.fogMaxDistanceInWorldUnits;
	this.exponentialFogDensity = fogParameters.density;
	this.fogColor = fogParameters.color;

	C_WebGL.updateFog();
};

C_Rendering.setFogMode = function (fogMode) {
	this.fogMode = fogMode;
	C_WebGL.updateFog();
};

C_Rendering.setFogState = function (isFogEnabled) {
	C_Settings.setValue(isFogEnabled);

	C_EventSystem.triggerEvent("FOG_MODE_UPDATE");
	DEBUG("Fog is now " + (isFogEnabled ? "ON" : "OFF"));

	C_WebGL.updateFog();
};

C_Rendering.setClearColor = function (color) {
	this.clearColor = color;
	this.renderer.activeScene.clearColor = C_WebGL.getRgbColorFromHex(this.clearColor);
};

// @deprecated (Remove after all dependent callers have been refactored to eliminate optional scene parameters)
C_Rendering.getActiveScene = function () {
	return this.renderer.activeScene;
};

C_Rendering.removeMesh = function (mesh) {
	DEBUG(format("Removing mesh %s", mesh.name));
	mesh.material?.diffuseTexture?.dispose();
	mesh.material?.lightmapTexture?.dispose();
	mesh.material?.ambientTexture?.dispose();
	mesh.material?.dispose();
	mesh.dispose();
};

C_Rendering.getScheduledMultiFrameTask = function (taskID) {
	return this.scheduledMultiFrameTasks[taskID];
};

C_Rendering.scheduleMultiFrameTask = function (taskID = new UniqueID().toString(), taskGeneratorFunction) {
	// Assigning an ID to the task doesn't really do much, but it will make debugging easier when things inevitably go wrong
	const coroutine = new Coroutine(taskID, taskGeneratorFunction);

	const scene = this.getActiveScene();
	scene.onBeforeRenderObservable.runCoroutineAsync(coroutine);

	this.scheduledMultiFrameTasks[taskID] = coroutine;

	return coroutine;
};

C_Rendering.getSceneObjectByName = function (name) {
	const scene = this.renderer.activeScene;

	const mesh = scene.getMeshByName(name);
	if (mesh) return mesh;

	const node = scene.getNodeByName(name);
	if (node) return node;

	const material = scene.getMaterialByName(name);
	if (material) return material;

	const texture = scene.getTextureByName(name);
	if (texture) return texture;

	const lightSource = scene.getLightByName(name);
	if (lightSource) return lightSource;

	return null;
};

C_Rendering.getNumActiveTextures = function () {
	return this.renderer.activeScene.textures.length;
};

C_Rendering.getNumActiveMaterials = function () {
	return this.renderer.activeScene.materials.length;
};

C_Rendering.getNumActiveMeshes = function () {
	return this.renderer.activeScene.meshes.length;
};

C_Rendering.getNumActiveAnimations = function () {
	return this.renderer.activeScene.animations.length;
};
