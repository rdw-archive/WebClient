class Renderer {
	constructor(renderCanvas) {
		this.deltaTime = 0;

		const renderingOptions = {
			antialias: C_Settings.getValue("useAntialiasing"),
			alpha: C_Settings.getValue("enableAlphaChannel"),
			doNotHandleContextLost: false, // required to handle "WebGL context lost", which can happen if the app is minimized
		};

		const sceneOptions = {
			useClonedMeshMap: C_Settings.getValue("optimizeSceneLookupOperations"),
			useGeometryUniqueIdsMap: C_Settings.getValue("optimizeSceneLookupOperations"),
			useMaterialMeshMap: C_Settings.getValue("optimizeSceneLookupOperations"),
			virtual: false, // Not an overlay, just a regular scene. Multiple (virtual scenes aren't supported yet, but will be later)
		};

		this.canvas = renderCanvas;
		this._obj = C_WebGL.createCanvasRenderer(renderCanvas, renderingOptions);

		this._obj.onContextLostObservable = function () {
			NOTICE("WebGL context lost; attempting to restore it"); // BJS does this automatically, if the option is set
		};
		this._obj.onContextRestoredObservable = function () {
			NOTICE("WebGL context successfully restored");
		};

		// WebGL settings
		C_WebGL.setMaxDrawLayers(C_Settings.getValue("numSpriteDrawLayers"));

		// Engine settings
		this.nextFpsUpdateCountdown = C_Settings.getValue("fpsUpdateIntervalInFrames");

		this.createRenderScene(sceneOptions);
	}
	// Update FPS counter (doing this too often might reduce performance?).
	// This is called on every frame, so beware of making it too slow.
	updateFpsCounter() {
		if (this.nextFpsUpdateCountdown === 0) {
			if (!C_Settings.getValue("showFPS")) return; // Skipping all calculations to improve performance
			this.fps = this._obj.getFps();
			C_EventSystem.triggerEvent("FPS_COUNTER_UPDATE", this.fps);
			this.nextFpsUpdateCountdown = C_Settings.getValue("fpsUpdateIntervalInFrames");
		}

		this.nextFpsUpdateCountdown = this.nextFpsUpdateCountdown - 1;
	}
	// Render the contents of the currently active Scene for one more frame.
	renderNextFrame() {
		if (!this.activeScene) return; // No need to do anything until a scene is actually loaded

		this.activeScene.render();
		// // this:UpdateActors()
		// // this:UpdateGeometry()
		// // this:UpdateOverlays()
		this.updateFpsCounter();
		this.deltaTime = this._obj.getDeltaTime();
	}
	//Continually render the game state based on the current scene data.
	//  @param onNextFrameReadyCallback The function to call when the next frame can be drawn
	startRendering(onNextFrameReadyCallback) {
		this._obj.runRenderLoop(onNextFrameReadyCallback);
	}
	//- Creates a new scene, including only the most basic building blocks (scene, camera, light).
	// This is only needed if the game world (or some other 3D stuff) should be rendered.
	createRenderScene(sceneOptions) {
		this.activeScene = C_WebGL.createScene(this._obj, sceneOptions);

		C_WebGL.registerPointerEvents(this.activeScene);

		// scene:registerBeforeRender(C_Rendering.SynchronizeSpritePositions)
		// end;
	}
}
