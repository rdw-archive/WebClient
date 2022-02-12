class C_Math3D extends API {
	static ANGLES_PER_RADIAN = 180;
	static degreesToRadians(angleInDegrees) {
		return (angleInDegrees * Math.PI) / C_Math3D.ANGLES_PER_RADIAN;
	}
}

// TODO Proper tests
assertEquals(C_Math3D.degreesToRadians(50), 0.8726646259971648);
