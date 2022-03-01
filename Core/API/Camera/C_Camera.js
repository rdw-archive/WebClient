const C_Camera = {
	activeCamera: null,
	orbitalCamera: new BABYLON.ArcRotateCamera("OrbitalCamera", 0, 0, 10, BABYLON.Vector3.Zero()),
};

C_Camera.isPointVisible = function (worldX, worldY, worldZ, epsilon = 0.05) {
	// Accessing properties designated as private is bad, but there's no proper BJS API we could use instead...
	const frustumPlanes = this.activeCamera._scene.frustumPlanes;
	const point = new BABYLON.Vector3(worldX, worldY, worldZ);

	for (let i = 0; i < 6; i++) {
		if (frustumPlanes[i].dotCoordinate(point) < 0 - epsilon) {
			return false;
		}
	}
	return true;
};

// @deprecated (should be removed after the postprocessing code in the WebGL API has been refactored)
C_Camera.getActiveCamera = function () {
	return this.activeCamera;
};

C_Camera.disableActiveCamera = function () {
	this.activeCamera.detachControl();
	this.activeCamera = null;
};

C_Camera.enableOrbitalCamera = function () {
	this.activeCamera = this.orbitalCamera;
	this.orbitalCamera.attachControl(window["WorldFrame"]._obj);
};

C_Camera.isOrbitalCamera = function () {
	return this.activeCamera === this.orbitalCamera;
};

C_Camera.setHorizontalRotationLimits = function (minAngleInDegrees, maxAngleInDegrees) {
	this.orbitalCamera.lowerAlphaLimit = C_Math3D.degreesToRadians(minAngleInDegrees);
	this.orbitalCamera.upperAlphaLimit = C_Math3D.degreesToRadians(maxAngleInDegrees);
};

C_Camera.setVerticalRotationLimits = function (minAngleInDegrees, maxAngleInDegrees) {
	this.orbitalCamera.lowerBetaLimit = C_Math3D.degreesToRadians(minAngleInDegrees);
	this.orbitalCamera.upperBetaLimit = C_Math3D.degreesToRadians(maxAngleInDegrees);
};

C_Camera.setOrbitalDistanceLimits = function (minDistanceInWorldUnits, maxDistanceInWorldUnits) {
	this.orbitalCamera.lowerRadiusLimit = minDistanceInWorldUnits;
	this.orbitalCamera.upperRadiusLimit = maxDistanceInWorldUnits;
};

C_Camera.setFixedPointOfView = function (
	horizontalAngleInDegrees,
	verticalAngleInDegrees,
	orbitalDistanceInWorldUnits
) {
	this.setHorizontalRotationLimits(horizontalAngleInDegrees, horizontalAngleInDegrees);
	this.setVerticalRotationLimits(verticalAngleInDegrees, verticalAngleInDegrees);
	this.setOrbitalDistanceLimits(orbitalDistanceInWorldUnits, orbitalDistanceInWorldUnits);

	this.setHorizontalRotationAngle(horizontalAngleInDegrees);
	this.setVerticalRotationAngle(verticalAngleInDegrees);
	this.setOrbitDistance(orbitalDistanceInWorldUnits);
};

C_Camera.isFixedPointOfView = function () {
	return (
		this.orbitalCamera.lowerAlphaLimit === this.orbitalCamera.upperAlphaLimit &&
		this.orbitalCamera.lowerBetaLimit === this.orbitalCamera.upperBetaLimit &&
		this.orbitalCamera.lowerRadiusLimit === this.orbitalCamera.lowerRadiusLimit
	);
};

C_Camera.setWorldPosition = function (worldX, worldY, worldZ) {
	this.activeCamera.globalPosition.x = worldX;
	this.activeCamera.globalPosition.y = worldY;
	this.activeCamera.globalPosition.z = worldZ;
};

C_Camera.getWorldPosition = function () {
	return new Vector3D(
		this.activeCamera.globalPosition.x,
		this.activeCamera.globalPosition.y,
		this.activeCamera.globalPosition.z
	);
};

C_Camera.setTargetWorldPosition = function (worldX, worldY, worldZ) {
	this.activeCamera.target.x = worldX;
	this.activeCamera.target.y = worldY;
	this.activeCamera.target.z = worldZ;
};

C_Camera.getTargetWorldPosition = function () {
	return new Vector3D(this.activeCamera.target.x, this.activeCamera.target.y, this.activeCamera.target.z);
};

C_Camera.setHorizontalRotationAngle = function (angleInDegrees) {
	this.orbitalCamera.alpha = C_Math3D.degreesToRadians(angleInDegrees);
};

C_Camera.getHorizontalRotationAngle = function () {
	return C_Math3D.radiansToDegrees(this.orbitalCamera.alpha);
};

C_Camera.setVerticalRotationAngle = function (angleInDegrees) {
	this.orbitalCamera.beta = C_Math3D.degreesToRadians(angleInDegrees);
};

C_Camera.getVerticalRotationAngle = function () {
	return C_Math3D.radiansToDegrees(this.orbitalCamera.beta);
};

C_Camera.setOrbitDistance = function (orbitRadiusInWorldUnits) {
	this.orbitalCamera.radius = orbitRadiusInWorldUnits;
};

C_Camera.getOrbitDistance = function () {
	return this.orbitalCamera.radius;
};
