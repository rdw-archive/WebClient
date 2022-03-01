describe("C_Camera", () => {
	describe("enableOrbitalCamera", () => {
		it("should activate the scene's orbital camera", () => {
			// Setup
			C_Camera.disableActiveCamera();
			assertFalse(C_Camera.isOrbitalCamera());

			C_Camera.enableOrbitalCamera();
			assertTrue(C_Camera.isOrbitalCamera());
		});
	});

	describe("isPointVisible", () => {
		it("should return true if the given point is inside the virtual camera's field of view", () => {
			assertTrue(C_Camera.isPointVisible(0, 0, 0));
		});

		it("should return false if the given point is outside the virtual camera's field of view", () => {
			assertFalse(C_Camera.isPointVisible(100, 0, 100));
		});
	});

	describe("setHorizontalRotationAngle", () => {
		it("should set the orbital camera's vertical rotation to the given angle", () => {
			assertNotEquals(C_Camera.getHorizontalRotationAngle(), 90);

			C_Camera.setHorizontalRotationAngle(90);
			assertEquals(C_Camera.getHorizontalRotationAngle(), 90);
		});
	});

	describe("setVerticalRotationAngle", () => {
		it("should set the orbital camera's vertical rotation to the given angle", () => {
			assertNotEquals(C_Camera.getVerticalRotationAngle(), 90);

			C_Camera.setVerticalRotationAngle(90);
			assertEquals(C_Camera.getVerticalRotationAngle(), 90);
		});
	});

	describe("setOrbitDistance", () => {
		it("should set the orbital camera's orbit distance to the given value", () => {
			assertNotEquals(C_Camera.getOrbitDistance(), 42);

			C_Camera.setOrbitDistance(42);
			assertEquals(C_Camera.getOrbitDistance(), 42);
		});
	});

	describe("setWorldPosition", () => {
		it("should set the orbital camera's location", () => {
			assertNotEquals(C_Camera.getWorldPosition(), new Vector3D(4, 5, 6));
			C_Camera.setWorldPosition(4, 5, 6);
			assertEquals(C_Camera.getWorldPosition(), new Vector3D(4, 5, 6));
		});
	});

	describe("setTargetWorldPosition", () => {
		it("should set the orbital camera target's location", () => {
			assertNotEquals(C_Camera.getTargetWorldPosition(), new Vector3D(1, 2, 3));
			C_Camera.setTargetWorldPosition(1, 2, 3);
			assertEquals(C_Camera.getTargetWorldPosition(), new Vector3D(1, 2, 3));
		});
	});

	describe("setFixedPointOfView", () => {
		it("should set the orbital camera to the given configuration", () => {
			assertNotEquals(C_Camera.getHorizontalRotationAngle(), 25);
			assertNotEquals(C_Camera.getVerticalRotationAngle(), 50);
			assertNotEquals(C_Camera.getOrbitDistance(), 12);

			C_Camera.setFixedPointOfView(25, 50, 12);
			assertEquals(C_Camera.getHorizontalRotationAngle(), 25);
			assertEquals(C_Camera.getVerticalRotationAngle(), 50);
			assertEquals(C_Camera.getOrbitDistance(), 12);
		});

		it("should fixate the orbital camera according to the given configuration", () => {
			assertNotEquals(C_Camera.getHorizontalRotationAngle(), 4);
			assertNotEquals(C_Camera.getVerticalRotationAngle(), 5);
			assertNotEquals(C_Camera.getOrbitDistance(), 6);

			C_Camera.setFixedPointOfView(4, 5, 6);

			assertTrue(C_Camera.isFixedPointOfView());
		});
	});
});
