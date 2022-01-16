var format = require("util").format;

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
	meshes: [],
	lightSources: [],
	renderCanvas: window["WorldFrame"],
	renderer: new Renderer(window["WorldFrame"]),
};

C_Rendering.loadScene = function () {};
C_Rendering.unloadScene = function () {};
C_Rendering.switchScene = function () {
	DEBUG("Disposing resources before switching scenes");
	C_Resources.unloadAll("Switching scenes");
	for (const mesh of this.meshes) {
		DEBUG(format("Disposing mesh %s", mesh.name));
		// TODO Streamline this
		mesh.material.diffuseTexture.dispose();
		mesh.material.lightmapTexture.dispose();
		mesh.material.ambientTexture.dispose();
		mesh.material.dispose();
		mesh.dispose();
	}
	for (const lightSource of this.lightSources) {
		DEBUG(format("Disposing lightSource %s", lightSource.name));
		lightSource.dispose();
	}
	this.meshes = [];
	this.lightSources = [];

	this.setClearColor(this.defaultClearColor); // Reset in case it was changed
};
C_Rendering.isSwitchingScenes = function () {};

// Creates a new renderer for the WorldFrame canvas and immediately renders the active scene.
// Note: Only one renderer/scene/canvas is currently supported.
C_Rendering.startRenderLoop = function () {
	function onCurrentFrameFinishedRendering() {
		const deltaTime = C_Rendering.renderer.deltaTime;
		C_EventSystem.triggerEvent("RENDER_LOOP_UPDATE", deltaTime);
		C_Rendering.renderer.renderNextFrame();
	}
	this.switchScene();
	this.createDefaultLightSource(); // for easier debugging
	this.renderer.startRendering(onCurrentFrameFinishedRendering);
};

C_Rendering.createDefaultLightSource = function () {
	// create default light source (for easier debugging)
	const lightReflectionDirection = {
		x: 0,
		y: 1, // reflections from the ground up to the sky (the other way around is pointless since you can't see under the ground)
		z: 0,
	};

	const specularHighlightsColor = {
		red: 0,
		green: 0,
		blue: 0,
	};

	const diffuseColor = {
		red: 255,
		green: 255,
		blue: 255,
	};

	const properties = {
		direction: lightReflectionDirection,
		specularColor: specularHighlightsColor,
		diffuseColor: diffuseColor,
		intensity: 1, // tbd
	};

	const defaultLightSource = C_WebGL.createAmbientLight("DefaultLightSource", properties);
	// Add to renderer so it's removed if the scene changes
	C_Rendering.addLightSource("DefaultLightSource", defaultLightSource);
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

C_Rendering.getActiveScene = function () {
	return this.renderer.activeScene;
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

C_Rendering.getActiveCamera = function () {
	return this.renderer.activeCamera;
};

C_Rendering.addMesh = function (name, mesh) {
	DEBUG(format("Adding mesh %s", name));
	this.meshes.push(mesh);
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

	return mesh;
};

C_Rendering.removeMesh = function (mesh) {
	DEBUG(format("Removing mesh %s", mesh.name));
	// TODO Streamline this
	mesh.material.diffuseTexture.dispose();
	mesh.material.lightmapTexture.dispose();
	mesh.material.ambientTexture.dispose();
	mesh.material.dispose();
	mesh.dispose();
	// textures, materials? also dispose them...
};

C_Rendering.addLightSource = function (name, lightSource) {
	DEBUG(format("Adding light source %s", name));
	this.lightSources.push(lightSource);
};
