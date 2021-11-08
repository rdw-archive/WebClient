var format = require("util").format;

// Wrapper for the BabylonJS WebGL engine (because we want streamlined APIs)
const C_WebGL = {
	fogModes: {
		[Enum.FOG_MODE_NONE]: BABYLON.Scene.FOGMODE_NONE,
		[Enum.FOG_MODE_LINEAR]: BABYLON.Scene.FOGMODE_LINEAR,
		[Enum.FOG_MODE_EXPONENTIAL]: BABYLON.Scene.FOGMODE_EXP,
		[Enum.FOG_MODE_EXPONENTIAL_DENSE]: BABYLON.Scene.FOGMODE_EXP2,
	},
};

C_WebGL.createCanvasRenderer = function (canvas, options) {
	const renderer = new BABYLON.Engine(canvas._obj, options);
	window.addEventListener("resize", function () {
		renderer.resize();
	});
	return renderer;
};
C_WebGL.setMaxDrawLayers = function (numDrawLayers) {};
C_WebGL.createScene = function (renderer, sceneOptions) {
	return new BABYLON.Scene(renderer, sceneOptions);
};
C_WebGL.createOrbitalCamera = function (name, scene, canvas) {
	const startAlpha = 0;
	// const startAlpha = C_Camera.getRadiansFromDegrees(RENDERER_CAMERA_START_ALPHA)
	const startBeta = Math.PI / 4; // deg? rad? name accordingly
	const startDistanceInWorldUnits = 25; // radius?
	const targetVector3D = new BABYLON.Vector3(0, 0, 0);

	const camera = new BABYLON.ArcRotateCamera(
		name,
		startAlpha,
		startBeta,
		startDistanceInWorldUnits,
		targetVector3D,
		scene
	);
	camera.attachControl(canvas._obj);
	return camera;
};

C_WebGL.updateFog = function () {
	const scene = C_Rendering.getActiveScene();
	const fogDensity = RENDERER_FOG_DENSITY;
	const fogStart = RENDERER_FOG_NEAR_LIMIT;
	const fogEnd = RENDERER_FOG_FAR_LIMIT;
	const fogColor = RENDERER_FOG_COLOR; // tbd apply alpha manually since WebGL doesn't like it?

	if (!C_Settings.getValue("enableFogEffect")) {
		scene.fogMode = this.fogModes[Enum.FOG_MODE_NONE];
		return;
	}

	DEBUG(
		format(
			"Updated fog parameters to mode = %s, density = %.2f, near = %.2f, far = %.2f, rgb = (%d, %d, %d)",
			RENDERER_FOG_MODE,
			fogDensity,
			fogStart,
			fogEnd,
			fogColor.red,
			fogColor.green,
			fogColor.blue
		)
	);

	scene.fogMode = this.fogModes[RENDERER_FOG_MODE];
	scene.fogStart = RENDERER_FOG_NEAR_LIMIT;
	scene.fogEnd = RENDERER_FOG_FAR_LIMIT;
	scene.fogDensity = RENDERER_FOG_DENSITY;

	scene.fogColor = new BABYLON.Color3(fogColor.red / 255, fogColor.green / 255, fogColor.blue / 255); // alpha?
};

C_WebGL.getRgbColorFromHex = function (hexString) {
	return BABYLON.Color3.FromHexString(hexString);
};

C_WebGL.getRgbaColorFromHex = function (hexString) {
	return BABYLON.Color4.FromHexString(hexString);
};

C_WebGL.createMesh = function (name, properties) {
	const mesh = new BABYLON.Mesh(name);

	const material = new BABYLON.StandardMaterial(name + "Material");
	material.backFaceCulling = false;

	// tbd
	material.twoSidedLighting = true;
	material.sideOrientation = BABYLON.Mesh.DOUBLESIDE;

	// const scene = C_Rendering.getActiveScene();
	// todo setting to override all textures with debug ones, add to addon DebugTools?
	// material.diffuseTexture = new BABYLON.Texture(WEBCLIENT_ADDONS_DIR + "/DebugMenu/DebugTexture256_old.png");

	// tbd setting to apply debug textures to everything
	if (properties.textureFilePath) {
		material.diffuseTexture = new BABYLON.Texture(properties.textureFilePath);
		material.diffuseTexture.noMipmap = true;
		material.diffuseTexture.updateSamplingMode(BABYLON.Texture.TRILINEAR_SAMPLINGMODE);
		material.diffuseTexture.wrapU = BABYLON.Texture.CLAMP_ADDRESSMODE;
		material.diffuseTexture.wrapV = BABYLON.Texture.CLAMP_ADDRESSMODE;
	}

	const vertexData = new BABYLON.VertexData();

	if (properties.lightmapTextureFilePath) {
		material.lightmapTexture = new BABYLON.Texture(properties.lightmapTextureFilePath);
		material.lightmapTexture.coordinatesIndex = 1; // use 2nd UVs = lightmap UVs (one set of UVs per texture)?
		vertexData.uvs2 = properties.lightmapUVs;
	}
	if (properties.ambientTextureFilePath) {
		material.ambientTexture = new BABYLON.Texture(properties.ambientTextureFilePath);
		material.ambientTexture.coordinatesIndex = 1; // use 2nd UVs = lightmap UVs (one set of UVs per texture)?
		vertexData.uvs2 = properties.lightmapUVs; // dry
		// shadowmapTexture.coordinatesIndex = 1 // use 2nd UVs = lightmap UVs (one set of UVs per texture)?
	}

	material.wireframe = properties.wireframe || false;
	mesh.showBoundingBox = properties.showBoundingBox || false;
	mesh.checkCollisions = properties.checkCollisions || false;
	mesh.billboardMode = (properties.billboardMode && BABYLON.Mesh.BILLBOARDMODE_ALL) || BABYLON.Mesh.BILLBOARDMODE_NONE;

	mesh.material = material;

	vertexData.positions = properties.vertices;
	vertexData.indices = properties.connections;
	vertexData.normals = properties.smoothNormals; // There's no reason to use flat normals, is there?
	vertexData.colors = properties.vertexColors;
	vertexData.uvs = properties.textureCoordinates;
	vertexData.applyToMesh(mesh);

	return mesh;
};

C_WebGL.createDirectionalLight = function (name, properties) {
	const specularColor = new BABYLON.Color3(
		properties.specularColor.red,
		properties.specularColor.green,
		properties.specularColor.blue
	);
	const diffuseColor = new BABYLON.Color3(
		properties.diffuseColor.red,
		properties.diffuseColor.green,
		properties.diffuseColor.blue
	);

	const direction = new BABYLON.Vector3(properties.direction.x, properties.direction.y, properties.direction.z);

	const directionalLight = new BABYLON.DirectionalLight(name, direction);
	directionalLight.specular = specularColor;
	directionalLight.diffuse = diffuseColor;
	directionalLight.intensity = properties.intensity;

	return directionalLight;
};

C_WebGL.createSphere = function (name, properties) {
	const positionVector3D = properties.position;
	const radiusInWorldUnits = properties.radiusl;
	const color = properties.color;

	const options = {
		diameterX: radiusInWorldUnits * 2,
		diameterY: radiusInWorldUnits * 2,
		diameterZ: radiusInWorldUnits * 2,
	};

	const sphere = BABYLON.MeshBuilder.CreateSphere(name, options);
	sphere.position.x = positionVector3D.x;
	sphere.position.y = positionVector3D.y;
	sphere.position.z = positionVector3D.z;

	sphere.material = new BABYLON.StandardMaterial(name + "Material");
	sphere.material.diffuseColor = new BABYLON.Color4(
		color.red / 255,
		color.green / 255,
		color.blue / 255,
		color.alpha / 255
	);

	return sphere;
};

C_WebGL.createAmbientLight = function (name, properties) {
	const specularColor = new BABYLON.Color3(
		properties.specularColor.red,
		properties.specularColor.green,
		properties.specularColor.blue
	);
	const diffuseColor = new BABYLON.Color3(
		properties.diffuseColor.red,
		properties.diffuseColor.green,
		properties.diffuseColor.blue
	);

	const direction = new BABYLON.Vector3(properties.direction.x, properties.direction.y, properties.direction.z);

	const ambientLight = new BABYLON.HemisphericLight(name, direction);
	ambientLight.specular = specularColor;
	ambientLight.diffuse = diffuseColor;
	ambientLight.intensity = properties.intensity;

	return ambientLight;
};

// todo setting to disable water plane

C_WebGL.createWaterPlane = function (mapU, mapV, waterLevel) {
	// waterMaterial.bumpTexture =
	// 	C_GraphicsLibrary:CreateTexture(WEBCLIENT_ASSETS_DIR .. "/Textures/" .. "waterbump.png", scene) //Set the bump texture
	const scene = C_Rendering.renderer.activeScene;
	// const ground = BABYLON.Mesh.CreateGround("water_material", 512, 512, 32, scene, false);
	// const waterMaterial = new BABYLON.WaterMaterial("water_material", scene, new BABYLON.Vector2(1024, 1024));
	// ground.material = waterMaterial;
	// waterMaterial.windForce = -5; //Represents the wind force applied on the waterMaterial surface
	// waterMaterial.waveHeight = 0.5; //Represents the height of the waves
	// waterMaterial.bumpHeight = 0.1; //According to the bump map, represents the pertubation of reflection and refraction
	// waterMaterial.windDirection = new BABYLON.Vector2(1.0, 1.0); //The wind direction on the waterMaterial surface (on width and height)
	// waterMaterial.waterColor = new BABYLON.Color3(0.1, 0.1, 0.6); //Represents the waterMaterial color mixed with the reflected and refracted world
	// waterMaterial.colorBlendFactor = 0; //Factor to determine how the waterMaterial color is blended with the reflected and refracted world
	// waterMaterial.waveLength = 0.1; //The lenght of waves. With smaller values, more waves are generated
	// waterMaterial.addToRenderList(ground); //not initialized yet

	var waterPlane = BABYLON.Mesh.CreateGround("waterPlane", mapU, mapV, 32, scene);
	waterPlane.position.x = mapU / 2;
	waterPlane.position.z = mapV / 2;
	waterPlane.visibility = 0.5;
	waterPlane.visibility = 1;
	waterPlane.position.y = waterLevel - 2.5; // offset by wave height times windt strength to avoid glitches?

	// var waterMaterial = new BABYLON.WaterMaterial("water_material", scene);
	// waterMaterial.bumpTexture = new BABYLON.Texture(WEBCLIENT_ADDONS_DIR + "/RagnarokFileFormats/waterbump.png", scene); // Set the bump texture

	// ground.material = waterMaterial;

	// // Water properties
	// waterMaterial.windForce = -5;
	// waterMaterial.waveHeight = 0.5;
	// waterMaterial.windDirection = new BABYLON.Vector2(1, 1);
	// waterMaterial.waterColor = new BABYLON.Color3(80 / 255, 155 / 255, 165 / 255);
	// waterMaterial.colorBlendFactor = 0.3;
	// waterMaterial.bumpHeight = 0.1;
	// waterMaterial.waveLength = 0.1;

	// // Skybox
	// // var skybox = BABYLON.Mesh.CreateBox("skyBox", 1000.0, scene);
	// // var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
	// // skyboxMaterial.backFaceCulling = false;
	// // skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("textures/TropicalSunnyDay", scene);
	// // skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
	// // skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
	// // skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
	// // skyboxMaterial.disableLighting = true;
	// // skybox.material = skyboxMaterial;

	// // Add skybox and ground to the reflection and refraction
	// // waterMaterial.addToRenderList(skybox);

	// var waterPlane = BABYLON.Mesh.CreateGround("waterPlane", 512, 512, 32, scene, false);

	var waterMaterial = new BABYLON.WaterMaterial("waterMaterial", scene);
	// waterMaterial.bumpTexture = new BABYLON.Texture("textures/waterbump.png", scene);
	// waterMaterial.bumpTexture = new BABYLON.Texture(WEBCLIENT_ADDONS_DIR + "/RagnarokFileFormats/waterbump.png", scene); // Set the bump texture
	waterMaterial.bumpTexture = new BABYLON.Texture(WEBCLIENT_ASSETS_DIR + "/texture/effect/¿öÅÍ/water000.jpg", scene); // Set the bump texture

	// Water properties
	waterMaterial.windForce = -5;
	waterMaterial.waveHeight = 0.5;
	waterMaterial.windDirection = new BABYLON.Vector2(1, 1);
	waterMaterial.waterColor = new BABYLON.Color3(80 / 255, 155 / 255, 165 / 255);
	// waterMaterial.waterColor = new BABYLON.Color3(0.1, 0.1, 0.6);
	waterMaterial.colorBlendFactor = 0.75;
	waterMaterial.colorBlendFactor = 0.3;
	waterMaterial.bumpHeight = 0.1;
	waterMaterial.waveLength = 0.3;

	// Add skybox and ground to the reflection and refraction
	//waterMaterial.addToRenderList(skybox);
	// waterMaterial.addToRenderList(ground);

	// Assign the waterMaterial material
	waterPlane.material = waterMaterial;

	// Skybox
	var skybox = BABYLON.Mesh.CreateBox("skyBox", 1000.0, scene);
	var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
	skyboxMaterial.backFaceCulling = false;
	skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture(
		WEBCLIENT_ADDONS_DIR + "/RagnarokFileFormats/TropicalSunnyDay",
		scene
	);
	skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
	skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
	skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
	skyboxMaterial.disableLighting = true;
	skybox.material = skyboxMaterial;

	for (const meshID in C_Rendering.meshes) {
		const mesh = C_Rendering.meshes[meshID];
		waterMaterial.addToRenderList(skybox);
		waterMaterial.addToRenderList(mesh);
	}

	return waterPlane;
};

// function C_Rendering:CreateWaterPlane()

// local scene = self:GetScene()
// local ground = C_GraphicsLibrary:CreateGround("ground", 512, 512, 32, scene)

//waterMaterial.windForce = 45 //Represents the wind force applied on the waterMaterial surface
//waterMaterial.waveHeight = 1.3 //Represents the height of the waves
//waterMaterial.bumpHeight = 0.3 //According to the bump map, represents the pertubation of reflection and refraction
//waterMaterial.colorBlendFactor = 2.0 //Factor to determine how the waterMaterial color is blended with the reflected and refracted world

//var waterPlane = BABYLON.Mesh.CreateGround("waterPlane", 512, 512, 32, scene, false);
//var waterMaterial = new BABYLON.WaterMaterial("waterMaterial", scene, new BABYLON.Vector2(1024, 1024));
//waterMaterial.backFaceCulling = true;
//waterMaterial.bumpTexture = new BABYLON.Texture("textures/waterbump.png", scene);
//waterMaterial.windForce = -5;
//waterMaterial.waveHeight = 0.5;
//waterMaterial.bumpHeight = 0.1;
//waterMaterial.waveLength = 0.1;
//waterMaterial.colorBlendFactor = 0;
//waterMaterial.addToRenderList(skybox);
//waterMaterial:addToRenderList(GroundMesh.obj); //not initialized yet
//waterPlane.material = waterMaterial;
//TODO Remove waterMaterial on scene change (no need to cache it)
// 	self.waterPlane = ground //TODO Use wrapper (Mesh obj)
// 	self.waterMaterial = waterMaterial
// end

// function C_Rendering:AddWaterReflection(mesh)
// 	if not RENDERER_SHOW_WATER_PLANE then
// 		return
// 	end

// 	self.waterPlane.material:addToRenderList(mesh.obj)
// end

C_WebGL.takeScreenshot = function () {
	const size = { height: 1080, width: 1900 };
	// todo async to avoid blocking
	BABYLON.Tools.CreateScreenshot(C_Rendering.renderer, C_Rendering.renderer.activeCamera, size);
};

// wip
C_WebGL.registerPointerEvents = function (scene) {
	scene.onPointerObservable.add((pointerInfo) => {
		// wip
		switch (pointerInfo.type) {
			case BABYLON.PointerEventTypes.POINTERDOWN:
				C_EventSystem.triggerEvent("POINTER_DOWN");
				break;
			case BABYLON.PointerEventTypes.POINTERUP:
				C_EventSystem.triggerEvent("POINTER_UP");
				break;
			case BABYLON.PointerEventTypes.POINTERMOVE:
				C_EventSystem.triggerEvent("POINTER_MOVE");
				break;
			case BABYLON.PointerEventTypes.POINTERWHEEL:
				C_EventSystem.triggerEvent("POINTER_WHEEL");
				break;
			case BABYLON.PointerEventTypes.POINTERPICK:
				C_EventSystem.triggerEvent("POINTER_PICK");
				break;
			case BABYLON.PointerEventTypes.POINTERTAP:
				C_EventSystem.triggerEvent("POINTER_TAP");
				break;
			case BABYLON.PointerEventTypes.POINTERDOUBLETAP:
				C_EventSystem.triggerEvent("POINTER_DOUBLETAP");
				break;
		}
	});

	scene.onPointerDown = function (event, pickResult) {
		// console.log(event);
		if (pickResult.hit && event.button === 0) {
			// LEFT_MOUSE_BUTTON (1 = mid, 2 = right, rest optional/depends on mouse?)
			DEBUG("Picked mesh " + pickResult.pickedMesh.name);
			// console.log(pickResult.pickedMesh);
			C_EventSystem.triggerEvent("MESH_PICKED", pickResult.pickedMesh); // tbd is this too much spam?
			// C_Rendering.renderer.activeCamera.useFramingBehavior = true;
			// C_Rendering.renderer.activeCamera.setTarget(pickResult.pickedMesh);
		}
		// else {
		// 	DEBUG("No pick result");
		// }
	};

	const processKeyboardEvent = function (keyboardEvent) {
		if (keyboardEvent.repeat) return; // No need to spam multiple events if a button is held

		const isAltKeyPressed = keyboardEvent.altKey;
		const isCtrlKeyPressed = keyboardEvent.ctrlKey;
		const isShiftKeyPressed = keyboardEvent.shiftKey;
		const isMetaKeyPressed = keyboardEvent.metaKey;
		const clickCount = keyboardEvent.detail; // those names...
		// These two aren't deprecated?
		const keyStringValue = keyboardEvent.key;
		const keyCode = keyboardEvent.code;
		if (keyCode === Enum.KEY_CODE_TAB) {
			keyboardEvent.preventDefault();
			// return;
		}
		switch (keyboardEvent.type) {
			case "keydown":
				// console.log("KEY DOWN: ", keyboardEvent.key);
				C_EventSystem.triggerEvent("KEY_DOWN", keyboardEvent.key, keyStringValue);
				// DEBUG(isShiftKeyPressed);
				if (C_Settings.getValue("keybindingActivationMode") === Enum.KEYBINDS_ACTIVATE_ON_KEY_DOWN) C_Keybindings.executeBinding(keyCode);
				break;
			case "keyup":
				// C_EventSystem.triggerEvent("KEY_UP", keyboardEvent.key);
				C_EventSystem.triggerEvent("KEY_UP", keyboardEvent.key, keyboardEvent.code, keyCode);
				// C_EventSystem.triggerEvent("KEY_UP", keyboardEvent.keyCode);
				if (C_Settings.getValue("keybindingActivationMode") === Enum.KEYBINDS_ACTIVATE_ON_KEY_UP) C_Keybindings.executeBinding(keyCode);
				break;
		}
	};

	window.onkeydown = processKeyboardEvent;
	window.onkeyup = processKeyboardEvent;
};

C_WebGL.enablePostProcessing = function () {
	if (this.pipeline) return;

	const scene = C_Rendering.getActiveScene();
	const camera = C_Rendering.getActiveCamera();
	const pipeline = new BABYLON.DefaultRenderingPipeline("pipeline", true, scene, [camera]);
	this.pipeline = pipeline;
};

// Bloom
C_WebGL.setBloomEffectState = function (isEnabled, properties) {
	const pipeline = this.pipeline;
	if (!pipeline) WARNING("Failed to set bloom effect state (default pipeline does not exist)");

	pipeline.bloomEnabled = isEnabled; // false by default
	if (!properties) {
		this.resetBloomEffectState();
		return;
	}

	pipeline.bloomKernel = properties.kernelSize; // 64 by default
	pipeline.bloomScale = properties.scale; // 0.5 by default
	pipeline.bloomThreshold = properties.threshold; // 0.9 by default
	pipeline.bloomWeight = properties.weight; // 0.15 by default
};

C_WebGL.resetBloomEffectState = function () {
	const pipeline = this.pipeline;
	// Defaults
	pipeline.bloomKernel = 64; // 64 by default
	pipeline.bloomScale = 0.5; // 0.5 by default
	pipeline.bloomThreshold = 0.9; // 0.9 by default
	pipeline.bloomWeight = 0.15; // 0.15 by default
};

C_WebGL.disableBloomEffect = function () {
	this.pipeline.bloomEnabled = false;
};

C_WebGL.enableBloomEffect = function () {
	this.pipeline.bloomEnabled = true;
};

C_WebGL.toggleBloomEffect = function () {
	this.pipeline.bloomEnabled = !this.pipeline.bloomEnabled;
};

// obsolete?
C_WebGL.createBloomEffect = function (kernelSize = 64, scale = 0.5, threshold = 0.9, weight = 0.15) {
	const pipeline = this.pipeline;
	pipeline.bloomKernel = kernelSize;
	pipeline.bloomScale = scale;
	pipeline.bloomThreshold = threshold;
	pipeline.bloomWeight = weight;
};

// FXAA
C_WebGL.setFxaaState = function (isEnabled, numSamples = 1) {
	const pipeline = this.pipeline;
	pipeline.fxaaEnabled = isEnabled; // false by default
	if (pipeline.fxaaEnabled) {
		pipeline.fxaa.samples = numSamples; // 1 by default
		pipeline.fxaa.adaptScaleToCurrentViewport = false; // false by default
	}
};

// MSAA
C_WebGL.setMsaaState = function (isEnabled, numSamples = 4) {
	if (!isEnabled) {
		this.pipelines.samples = 1; // disabled
		DEBUG("MSAA is now OFF");
		return;
	}
	this.pipeline.samples = numSamples;
	DEBUG("MSAA is now ON");
	DEBUG(format("Set MSAA samples to %d", numSamples));
};

// Blur
C_WebGL.setBlurEffectState = function (isEnabled, kernelSize = 4) {
	if (!this.isBlurPostProcessCreated) {
		this.createBlurEffect(kernelSize);
	}

	if (!isEnabled) {
		this.disableBlurEffect();
	} else this.enableBlurEffect();
};

C_WebGL.createBlurEffect = function (kernelSize = 4) {
	if (this.isBlurPostProcessCreated) return;

	const camera = C_Rendering.getActiveCamera();
	this.horizontalBlurPostProcess = new BABYLON.BlurPostProcess(
		"Horizontal blur",
		new BABYLON.Vector2(1.0, 0),
		kernelSize,
		1.0,
		camera
	);
	this.verticalBlurPostProcess = new BABYLON.BlurPostProcess(
		"Vertical blur",
		new BABYLON.Vector2(0, 1.0),
		kernelSize,
		1.0,
		camera
	);

	this.isBlurPostProcessCreated = true;
};

C_WebGL.disableBlurEffect = function () {
	const camera = C_Rendering.getActiveCamera();
	camera.detachPostProcess(this.horizontalBlurPostProcess);
};

C_WebGL.enableBlurEffect = function () {
	const camera = C_Rendering.getActiveCamera();
	camera.attachPostProcess(this.horizontalBlurPostProcess);
};

// Greyscale Filter
C_WebGL.createGreyscaleEffect = function (ratio = 1.0) {
	if (this.greyscalePostProcess) return;

	const camera = C_Rendering.getActiveCamera();
	this.greyscalePostProcess = new BABYLON.BlackAndWhitePostProcess("BlackAndWhitePostProcess", ratio, camera);
};

C_WebGL.disableGreyscaleEffect = function () {
	const camera = C_Rendering.getActiveCamera();
	camera.detachPostProcess(this.greyscalePostProcess);
};

C_WebGL.enableGreyscaleEffect = function () {
	const camera = C_Rendering.getActiveCamera();
	camera.attachPostProcess(this.greyscalePostProcess);
};

// Highlights (Luminosity only = "Darkroom" Effect)
C_WebGL.createHighlightsEffect = function (ratio = 1.0) {
	if (this.highlightsPostProcess) return;

	const camera = C_Rendering.getActiveCamera();
	this.highlightsPostProcess = new BABYLON.HighlightsPostProcess("HighlightsPostProcess", ratio, camera);
};

C_WebGL.disableHighlightsEffect = function () {
	const camera = C_Rendering.getActiveCamera();
	camera.detachPostProcess(this.highlightsPostProcess);
};

C_WebGL.enableHighlightsEffect = function () {
	const camera = C_Rendering.getActiveCamera();
	camera.attachPostProcess(this.highlightsPostProcess);
};

// Grain (TODO)

// Chromatic Aberration (TODO)

C_WebGL.showDebugLayer = function () {
	C_Rendering.renderer.activeScene.debugLayer.show();
};

// I really dislike this API, but not sure if it can be modified to support the same Color (RGBA) values that are used everywhere else...
C_WebGL.makeTextPlane = function (text, color = "red", size = 10) {
	const scene = C_Rendering.getActiveScene();

	const dynamicTexture = new BABYLON.DynamicTexture(
		"DynamicTexture" + WebClient.getNextAvailableGUID(),
		50,
		scene,
		true
	);
	dynamicTexture.hasAlpha = true;
	dynamicTexture.drawText(text, 5, 40, "bold 36px Arial", color, "transparent", true);

	const textPlane = BABYLON.Mesh.CreatePlane("TextPlane" + WebClient.getNextAvailableGUID(), size, scene, true);

	textPlane.material = new BABYLON.StandardMaterial("TextPlaneMaterial" + WebClient.getNextAvailableGUID(), scene);
	textPlane.material.backFaceCulling = false;
	textPlane.material.specularColor = new BABYLON.Color3(0, 0, 0);
	textPlane.material.diffuseTexture = dynamicTexture;

	return textPlane;
};

C_WebGL.createLines = function (name, properties) {
	const scene = C_Rendering.getActiveScene();
	const lineSystem = BABYLON.Mesh.CreateLines(name, properties.points, scene);
	lineSystem.color = new BABYLON.Color3(
		properties.color.red / 255,
		properties.color.green / 255,
		properties.color.blue / 255,
		properties.color.alpha / 255
	);
	return lineSystem;
};
