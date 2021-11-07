var format = require("util").format;

// Danger: Here be dragons (In need of refactoring)
const C_Debug = {};

C_Debug.dump = function (element, showTableOverview = false) {
	console.log(element);
	if (!showTableOverview) return;

	console.table(element);
};

C_Debug.drawLine = function (
	sourceVector3D,
	destinationVector3D,
	color = Color.RED
) {
	const points = [sourceVector3D, destinationVector3D];
	const properties = {
		points: points,
		color: color,
	};
	const lineSystem = C_WebGL.createLines(
		"DebugLineSystem" + WebClient.getNextAvailableGUID(),
		properties
	);
	return lineSystem;
};

C_Debug.drawSphere = function (
	positionVector3D = Vector3D.ORIGIN,
	radiusInWorldUnits = 1,
	color = Color.RED
) {
	const properties = {
		position: positionVector3D,
		radius: radiusInWorldUnits,
		color: color,
	};
	const sphere = C_WebGL.createSphere(
		"DebugSphere" + WebClient.getNextAvailableGUID(),
		properties
	);
	return sphere;
};

C_Debug.createTextPlane = function (text, parentNode) {
	textPlane = C_WebGL.makeTextPlane(text);
	textPlane.parent = parentNode;
	return textPlane;
};

C_Debug.createWorldAxesVisualization = function (sizeInWorldUnits = 100) {
	if (this.worldAxesVisualizationMesh) return;

	const propertiesX = {
		points: [
			// Axis
			Vector3D.ORIGIN,
			new Vector3D(sizeInWorldUnits, 0, 0),
			// "Arrow head"
			new Vector3D(sizeInWorldUnits * 0.95, 0.05 * sizeInWorldUnits, 0),
			new Vector3D(sizeInWorldUnits, 0, 0),
			new Vector3D(sizeInWorldUnits * 0.95, -0.05 * sizeInWorldUnits, 0),
		],
		color: Color.RED,
	};
	const propertiesY = {
		points: [
			// Axis
			Vector3D.ORIGIN,
			new Vector3D(0, sizeInWorldUnits, 0),
			// "Arrow head"
			new Vector3D(sizeInWorldUnits * -0.05, 0.95 * sizeInWorldUnits, 0),
			new Vector3D(0, sizeInWorldUnits, 0),
			new Vector3D(sizeInWorldUnits * 0.05, 0.95 * sizeInWorldUnits, 0),
		],
		color: Color.GREEN,
	};
	const propertiesZ = {
		points: [
			// Axis
			Vector3D.ORIGIN,
			new Vector3D(0, 0, sizeInWorldUnits),
			// "Arrow head"
			new Vector3D(0, sizeInWorldUnits * -0.05, 0.95 * sizeInWorldUnits),
			new Vector3D(0, 0, sizeInWorldUnits),
			new Vector3D(0, sizeInWorldUnits * 0.05, 0.95 * sizeInWorldUnits),
		],
		color: Color.BLUE,
	};

	const axisX = C_WebGL.createLines(
		"WorldAxesVisualization_LinesX",
		propertiesX
	);
	const axisY = C_WebGL.createLines(
		"WorldAxesVisualization_LinesY",
		propertiesY
	);
	const axisZ = C_WebGL.createLines(
		"WorldAxesVisualization_LinesZ",
		propertiesZ
	);

	// Setting the position here isn't ideal; I'd want the WebGL APIs to be decoupled. For now I'll leave it since text planes aren't used directly anywhere
	const labelTextX = C_WebGL.makeTextPlane("X", "red", sizeInWorldUnits / 10);
	labelTextX.position.x = 0.9 * sizeInWorldUnits;
	labelTextX.position.y = -0.05 * sizeInWorldUnits;
	labelTextX.position.z = 0;

	const labelTextY = C_WebGL.makeTextPlane("Y", "green", sizeInWorldUnits / 10);
	labelTextY.position.x = 0;
	labelTextY.position.y = 0.9 * sizeInWorldUnits;
	labelTextY.position.z = -0.05 * sizeInWorldUnits;

	const labelTextZ = C_WebGL.makeTextPlane("Z", "blue", sizeInWorldUnits / 10);
	labelTextZ.position.x = 0;
	labelTextZ.position.y = 0.05 * sizeInWorldUnits;
	labelTextZ.position.z = 0.9 * sizeInWorldUnits;

	const xAxis = { lines: axisX, text: labelTextX };
	const yAxis = { lines: axisY, text: labelTextY };
	const zAxis = { lines: axisZ, text: labelTextZ };

	DEBUG("Created world axes visualization");
	this.worldAxesVisualizationMesh = {
		xAxis: xAxis,
		yAxis: yAxis,
		zAxis: zAxis,
		// This also doesn't belong here, but unless similar APIs for text planes/lines are needed elsewhere there's no point in creating them (YAGNI)
		show() {
			xAxis.lines.isVisible = true;
			yAxis.lines.isVisible = true;
			zAxis.lines.isVisible = true;

			xAxis.text.isVisible = true;
			yAxis.text.isVisible = true;
			zAxis.text.isVisible = true;
		},
		hide() {
			xAxis.lines.isVisible = false;
			yAxis.lines.isVisible = false;
			zAxis.lines.isVisible = false;

			xAxis.text.isVisible = false;
			yAxis.text.isVisible = false;
			zAxis.text.isVisible = false;
		},
	};
};

C_Debug.showWorldAxes = function () {
	if (!this.worldAxesVisualizationMesh) return;
	this.worldAxesVisualizationMesh.show();
};

C_Debug.hideWorldAxes = function () {
	if (!this.worldAxesVisualizationMesh) return;
	this.worldAxesVisualizationMesh.hide();
};

C_Debug.exportJSON = function (fileName, object) {
	DEBUG(format("Exporting JSON to file " + fileName));
	C_FileSystem.writeJSON(WEBCLIENT_EXPORTS_DIR + "/" + fileName, object);
};

C_Debug.drawNavigationMap = function () {
	const navMap = C_Navigation.navigationMap;
	const heightMap = C_Navigation.heightMap;

	if (!navMap || !heightMap) {
		NOTICE(
			"Failed to draw Navigation Map (navigationMap or heightMap not set)"
		);
		return;
	}

	const ground = BABYLON.MeshBuilder.CreateGround("ground", {
		width: 1,
		height: 1,
	});
	ground.renderingGroupID = RENDERER_DEBUG_MESH_RENDERING_GROUP_ID;

	const matrices = [];
	const colors = [];

	const epsilon = 1; // anti z fighting offset; Needs a better algorithm, maybe use actual terrain geometry over navigation map?

	for (let v = 0; v < navMap.height; v++) {
		for (let u = 0; u < navMap.width; u++) {
			const tileID = u + v * navMap.width;
			const matrix = BABYLON.Matrix.Translation(
				u,
				heightMap.getAltitude(tileID) + epsilon,
				v
			);

			matrices.push(matrix);
			if (navMap.tiles[tileID] === false) colors.push(1, 0, 0, 1);
			else colors.push(0, 1, 0, 1);
		}
	}

	ground.thinInstanceAdd(matrices);
	ground.thinInstanceRegisterAttribute("color", 4);
	ground.thinInstanceSetAttributeAt("color", 0, colors);

	C_Rendering.addMesh("NavigationMapVisualizationMesh", ground);
};

C_Debug.visualizeNormals = function (mesh, size, color) {
	if (mesh.normalsVisualization) {
		mesh.normalsVisualization.isVisible = !mesh.normalsVisualization.isVisible;
		return;
	}

	// tbd move to C_WebGL? (maybe later, if it proves to be reusable)
	const normals = mesh.getVerticesData(BABYLON.VertexBuffer.NormalKind);
	const positions = mesh.getVerticesData(BABYLON.VertexBuffer.PositionKind);
	color = color || BABYLON.Color3.FromHexString("#FF0000");
	size = size || 1.5;

	const lines = [];
	for (let i = 0; i < normals.length; i += 3) {
		const v1 = BABYLON.Vector3.FromArray(positions, i);
		const v2 = v1.add(BABYLON.Vector3.FromArray(normals, i).scaleInPlace(size));
		lines.push([v1, v2]);
	}
	const normalLines = BABYLON.MeshBuilder.CreateLineSystem(
		mesh.name + "_NormalLines",
		{ lines: lines }
	);
	normalLines.color = color;

	mesh.normalsVisualization = normalLines;

	function disposeNormalLines() {
		normalLines.dispose();
	}
	mesh.onDisposeObservable.add(disposeNormalLines);

	return normalLines;
};

C_Debug.toggleNormals = function () {
	for (const mesh of C_Rendering.meshes) {
		C_Debug.visualizeNormals(mesh);
	}
};

C_Debug.inspectScene = function () {
	C_WebGL.showDebugLayer();
};
