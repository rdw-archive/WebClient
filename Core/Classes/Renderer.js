class Renderer {
	constructor(renderCanvas) {
		this.deltaTime = 0;

		const renderingOptions = {
			antialias: RENDERER_USE_ANTIALIASING,
			alpha: RENDERER_USE_ALPHA,
			doNotHandleContextLost: false, // required to handle "WebGL context lost", which can happen if the app is minimized
		};

		const sceneOptions = {
			useClonedMeshMap: RENDERER_OPTIMIZE_SCENE_LOOKUP_OPERATIONS,
			useGeometryUniqueIdsMap: RENDERER_OPTIMIZE_SCENE_LOOKUP_OPERATIONS,
			useMaterialMeshMap: RENDERER_OPTIMIZE_SCENE_LOOKUP_OPERATIONS,
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
		C_WebGL.setMaxDrawLayers(RENDERER_NUM_SPRITE_DRAW_LAYERS);

		// Engine settings
		this.nextFpsUpdateCountdown = RENDERER_FPS_UPDATE_INTERVAL_IN_FRAMES;

		this.createRenderScene(sceneOptions);
	}
	// Update FPS counter (doing this too often might reduce performance?).
	// This is called on every frame, so beware of making it too slow.
	updateFpsCounter() {
		if (!RENDERER_SHOW_FPS) return; // Skipping all calculations to improve performance

		if (this.nextFpsUpdateCountdown === 0) {
			this.fps = this._obj.getFps();
			C_EventSystem.triggerEvent("FPS_COUNTER_UPDATE", this.fps);
			this.nextFpsUpdateCountdown = RENDERER_FPS_UPDATE_INTERVAL_IN_FRAMES;
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
		this.activeCamera = C_WebGL.createOrbitalCamera(
			"OrbitalCamera",
			this.activeScene,
			this.canvas
		);

		C_WebGL.registerPointerEvents(this.activeScene);

		// scene:registerBeforeRender(C_Rendering.SynchronizeSpritePositions)
		// end;
	}
}
