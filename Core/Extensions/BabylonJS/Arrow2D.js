const RGBA_COLOR_GREEN = {
	red: 0,
	green: 255,
	blue: 0,
	alpha: 255,
};
const DEFAULT_COLOR = RGBA_COLOR_GREEN;
const DEFAULT_ARROW_WIDTH = 0.1;
const DEFAULT_TIP_SIZE = 0.25;

// Represents a flat (2D) arrow in 3D space
class Arrow2D {
	constructor(name, direction, length, scene) {
		// constructor(name, sourcePoint3D, destinationPoint3D, scene) {

		let sourcePoint3D = BABYLON.Vector3.Zero();
		let destinationPoint3D = new BABYLON.Vector3(length, 0, 0); // rotate later into the actual direction
		// destinationPoint3D.normalize();
		// destinationPoint3D.scaleInPlace(length);

		this.direction = direction;
		this.bodyLength = length; // Doesn't account for the tip

		//Array of paths to construct ribbon
		let thickness = DEFAULT_ARROW_WIDTH;
		let tipSize = DEFAULT_TIP_SIZE; // looks best at thickness * 2.5? or thickness * 1 for an implied arrow head only?
		let color = DEFAULT_COLOR;

		this.width = thickness;
		this.tipSize = tipSize;
		this.color = color;
		this.name = name;
		this.scene = scene;

		this.sourcePoint = sourcePoint3D;
		this.destinationPoint = destinationPoint3D;

		this.updateVertices();
		this.setDirection(direction);

		return this;
	}

	dispose() {
		this.mesh.dispose();
	}

	setShown(showFlag) {
		this.mesh.isVisible = showFlag;
	}

	setRenderingGroupID(groupID) {
		this.mesh.renderingGroupId = groupID;
	}

	setPosition(worldX, worldY, worldZ) {
		this.mesh.position.x = worldX;
		this.mesh.position.y = worldY;
		this.mesh.position.z = worldZ;
		// this.mesh.position.y = this.mesh.position.y + 2;
	}

	setDirection(direction) {
		this.direction = direction;

		this.mesh.rotation = new BABYLON.Vector3(0, direction, 0);
		// this.mesh.rotate(new BABYLON.Vector3(0, 1, 0), direction); // always rotate in LOCAL space
	}

	setColor(red, green, blue) {
		this.color.red = red;
		this.color.green = green;
		this.color.blue = blue;
		this.updateVertices(); // todo update vertex colors only, no need to update the ribbon
	}

	setAlpha(alpha) {
		this.mesh.visibility = alpha;
	}

	setWidth(thickness) {
		this.width = thickness;
		this.updateVertices();
	}

	setTipSize(tipSize) {
		this.tipSize = tipSize;
		this.updateVertices();
	}

	setSourcePoint(x, y, z) {
		this.sourcePoint.x = x;
		this.sourcePoint.y = y;
		this.sourcePoint.z = z;
		this.updateVertices();
	}

	setDestinationPoint(x, y, z) {
		this.destinationPoint.x = x;
		this.destinationPoint.y = y;
		this.destinationPoint.z = z;
		this.updateVertices();
	}

	updateVertices() {
		//let arrowBody = destinationPoint3D.subtract(sourcePoint3D); // No longer needed?

		let sourcePoint3D = this.sourcePoint;
		let destinationPoint3D = this.destinationPoint;
		let tipSize = this.tipSize;
		let thickness = this.width;
		let updateInstance = this.mesh; // On construction, this doesn't exist and will be created automatically instead of updating it
		let scene = this.scene;
		let name = this.name;
		let color = this.color;

		let tipDirection = destinationPoint3D.subtract(sourcePoint3D);
		tipDirection.normalize();
		tipDirection.scaleInPlace(tipSize);
		let tip = destinationPoint3D.add(
			new BABYLON.Vector3(tipDirection.x * tipSize, tipDirection.y * tipSize, tipDirection.z * tipSize)
		);
		let arrowTip = tipDirection.add(tip);

		let paths = [
			// Where the arrow originates
			[
				new BABYLON.Vector3(sourcePoint3D.x, sourcePoint3D.y, sourcePoint3D.z - thickness / 2),
				new BABYLON.Vector3(sourcePoint3D.x, sourcePoint3D.y, sourcePoint3D.z + thickness / 2),
			],
			// Where the arrow points to
			[
				new BABYLON.Vector3(destinationPoint3D.x, destinationPoint3D.y, destinationPoint3D.z - thickness / 2),
				new BABYLON.Vector3(destinationPoint3D.x, destinationPoint3D.y, destinationPoint3D.z + thickness / 2),
			],
			// Tip of the arrow
			[
				new BABYLON.Vector3(destinationPoint3D.x, destinationPoint3D.y, destinationPoint3D.z - tipSize / 2),
				new BABYLON.Vector3(destinationPoint3D.x, destinationPoint3D.y, destinationPoint3D.z + tipSize / 2),
			],
			[new BABYLON.Vector3(destinationPoint3D.x, destinationPoint3D.y, destinationPoint3D.z - tipSize / 2), arrowTip],
			[arrowTip, new BABYLON.Vector3(destinationPoint3D.x, destinationPoint3D.y, destinationPoint3D.z + tipSize / 2)],
		];

		let ribbon = BABYLON.MeshBuilder.CreateRibbon(
			name + "Ribbon",
			{
				pathArray: paths,
				sideOrientation: BABYLON.Mesh.DOUBLESIDE,
				updatable: true,
				instance: updateInstance,
			},
			scene
		);

		if (ribbon.material === null) ribbon.material = new BABYLON.StandardMaterial(this.name + "Material", scene);

		// Color the ribbon
		let vertexColors = [];

		for (let pathIndex = 0; pathIndex < paths.length; pathIndex++) {
			let vertices = paths[pathIndex];
			for (let vertexIndex = 0; vertexIndex < vertices.length; vertexIndex++) {
				vertexColors.push(color.red / 255, color.green / 255, color.blue / 255, color.alpha / 255);
			}
		}

		ribbon.setVerticesData(BABYLON.VertexBuffer.ColorKind, vertexColors);
		ribbon.useVertexColors = true; // ON by default?
		// ribbon.hasVertexAlpha = true;
		// console.log(ribbon)

		ribbon.material.emissiveColor = new BABYLON.Color3(color.red / 255, color.green / 255, color.blue / 255);

		// ribbon.rotate(new BABYLON.Vector3(0, 1, 0), 180 / 180 * Math.PI);

		this.mesh = ribbon;
	}
}

BABYLON.Arrow2D = Arrow2D;
