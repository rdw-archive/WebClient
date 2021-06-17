const C_Camera = {
	setAlphaDeg(horizontalAngleInDegrees) {
		const camera = C_Rendering.getActiveCamera();
		camera.alpha = horizontalAngleInDegrees * Math.PI / 180;
	},
	setBetaDeg(verticalAngleInDegrees) {
		const camera = C_Rendering.getActiveCamera();
		// todo Camera class?
		camera.beta = verticalAngleInDegrees * Math.PI / 180;
	},
	setTargetUnit(unitID) {
		const camera = C_Rendering.getActiveCamera();
		// nyi
		const unit = C_Unit.getUnitInfo(unitID);
		// if not unit then return end
		// set target to unit.worldPosition
	},
	setTargetWorldCoordinates(worldX, worldY, worldZ) {
		const camera = C_Rendering.getActiveCamera();

	},
	setTargetMapCoordinates(mapU, mapV) {
		const camera = C_Rendering.getActiveCamera();
		const terrainAltitude = C_Navigation.getTerrainAltitude(mapU, mapV);
		camera.setTarget(new BABYLON.Vector3(mapU + 0.5, terrainAltitude, mapV + 0.5)); // to nashmap?

	},
	setDistanceToTarget(distanceInWorldUnits) {
		const camera = C_Rendering.getActiveCamera();
		camera.radius = distanceInWorldUnits;
	},
	setMovementSpeed(speed) {
		// tbd what unit does it use?
		const camera = C_Rendering.getActiveCamera();
		camera.speed = speed;
	}
	// start stop follow, easing vs discrete
	// set position vs set target?
	// set to screen offset (setTargetScreenCoordinates)
	// set keybind for default actions (zoom, rotate, reset)
	// enable default actions (zoom, roate, reset)
	// restore default settings
	// lock in / stop movement
	// panning sensibility, disable, ... what is panning, anyway?
	// wheel precision?
	// inertia
	// panning
	// near/far plane distance
	// auto rotation (start, stop)
};
