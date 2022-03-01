const C_Camera = {
	activeCamera: null,
	orbitalCamera: new BABYLON.ArcRotateCamera("OrbitalCamera", 0, 0, 10, BABYLON.Vector3.Zero()),
};

// @deprecated (should be removed after the postprocessing code in the WebGL API has been refactored)
C_Camera.getActiveCamera = function () {
	return this.activeCamera;
};

C_Camera.enableOrbitalCamera = function () {
	this.activeCamera = this.orbitalCamera;
	this.orbitalCamera.attachControl(window["WorldFrame"]._obj);
};

