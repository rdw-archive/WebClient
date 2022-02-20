describe("C_Math3D", () => {
	describe("radiansToDegrees", () => {
		assertEquals(C_Math3D.radiansToDegrees(0.8726646259971648), 50);
	});

	describe("degreesToRadians", () => {
		assertEquals(C_Math3D.degreesToRadians(50), 0.8726646259971648);
	});
});
