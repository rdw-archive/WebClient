var format = require("util").format;

const C_Rendering = {
	meshes: [],
	lightSources: [],
};

C_Rendering.loadScene = function () {};
C_Rendering.unloadScene = function () {};
C_Rendering.switchScene = function () {
	DEBUG("Disposing resources before switching scenes");
	C_Resources.unloadAll("Switching scenes");
	for (const mesh of this.meshes) {
		DEBUG(format("Disposing mesh %s", mesh.name));
		mesh.dispose();
	}
	for (const lightSource of this.lightSources) {
		DEBUG(format("Disposing lightSource %s", lightSource.name));
		lightSource.dispose();
	}
	this.meshes = [];
	this.lightSources = [];

	this.setClearColor(RENDERER_SCENE_BACKGROUND_COLOR); // Reset in case it was changed
};
C_Rendering.isSwitchingScenes = function () {};

// Creates a new renderer for the WorldFrame canvas and immediately renders the active scene.
// Note: Only one renderer/scene/canvas is currently supported.
C_Rendering.startRenderLoop = function () {
	if (this.renderer) {
		NOTICE("Failed to start render loop (renderer already exists and only one scene is currently supported)");
		return;
	}
	const renderCanvas = window["WorldFrame"];
	const renderer = new Renderer(renderCanvas);
	this.renderer = renderer;

	function onCurrentFrameFinishedRendering() {
		const deltaTime = renderer.deltaTime;
		C_EventSystem.triggerEvent("RENDER_LOOP_UPDATE", deltaTime);
		renderer.renderNextFrame();
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

	const defaultLightSource = C_WebGL.createAmbientLight("RevivalEngine_DefaultLightSource", properties);
	// Add to renderer so it's removed if the scene changes
	C_Rendering.addLightSource("RevivalEngine_DefaultLightSource", defaultLightSource);
};

C_Rendering.setFogParameters = function (fogParameters) {
	RENDERER_FOG_NEAR_LIMIT = fogParameters.start * RENDERER_FOG_MIN_DISTANCE;
	RENDERER_FOG_FAR_LIMIT = fogParameters.end * RENDERER_FOG_MAX_DISTANCE;
	RENDERER_FOG_DENSITY = fogParameters.density;
	RENDERER_FOG_COLOR = fogParameters.color;

	C_WebGL.updateFog();
};

C_Rendering.setFogMode = function (fogMode) {
	RENDERER_FOG_MODE = fogMode;
	C_WebGL.updateFog();
};

C_Rendering.setFogState = function (isFogEnabled) {
	RENDERER_ENABLE_FOG = isFogEnabled;

	C_EventSystem.triggerEvent("FOG_MODE_UPDATE");
	DEBUG("Fog is now " + (isFogEnabled ? "ON" : "OFF"));

	C_WebGL.updateFog();
};

C_Rendering.setClearColor = function (color) {
	RENDERER_SCENE_BACKGROUND_COLOR = color;
	this.renderer.activeScene.clearColor = C_WebGL.getRgbColorFromHex(RENDERER_SCENE_BACKGROUND_COLOR);
};

C_Rendering.getActiveScene = function () {
	return this.renderer.activeScene;
};

C_Rendering.getActiveCamera = function () {
	return this.renderer.activeCamera;
};

C_Rendering.addMesh = function (name, mesh) {
	DEBUG(format("Adding mesh %s", name));
	this.meshes.push(mesh);
};

C_Rendering.addLightSource = function (name, lightSource) {
	DEBUG(format("Adding light source %s", name));
	this.lightSources.push(lightSource);
};
