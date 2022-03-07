describe("Vector3D", () => {
	describe("constructor", () => {
		it("should return an instance of Vector3D", () => {
			const vector = new Vector3D();
			assertTrue(vector instanceof Vector3D);
		});

		it("should initialize the vector with the given coordinates", () => {
			const vector = new Vector3D(1, 2, 3);
			assertEquals(vector.x, 1);
			assertEquals(vector.y, 2);
			assertEquals(vector.z, 3);
		});

		it("should initialize the coordinates with zero if none were given", () => {
			const vector = new Vector3D();
			assertEquals(vector.x, 0);
			assertEquals(vector.y, 0);
			assertEquals(vector.z, 0);
		});

		it("should expose the dimension of the vector as a static property", () => {
			assertEquals(Vector3D.length, 3);
		});
	});

	describe("clone", () => {
		it("should return a vector with the same coordinates", () => {
			const vectorA = new Vector3D(2, 3, 4);
			const vectorB = vectorA.clone();
			assertEquals(vectorA, vectorB);
		});

		it("should return a separate instance that can be modified independently", () => {
			const vectorA = new Vector3D(2, 3, 4);
			const vectorB = vectorA.clone();
			vectorA.x = 42;
			assertEquals(vectorB.x, 2);
		});
	});

	describe("add", () => {
		it("should add multiple vectors and summarize their coordinates", () => {
			const vectorA = new Vector3D(1, 2, 3);
			const vectorB = new Vector3D(3, 2, 1);
			const vectorC = new Vector3D(2, 2, 2);

			const result = Vector3D.add(vectorA, vectorB, vectorC);
			const expectedResult = new Vector3D(6, 6, 6);
			assertEquals(result, expectedResult);
		});
	});

	describe("ORIGIN", () => {
		it("should expose the zero vector as a static property", () => {
			// Whether or not this is really useful might be debatable, but it's already used in the code...
			assertEquals(Vector3D.ORIGIN, new Vector3D(0, 0, 0));
		});
	});

	describe("normalizeInPlace", () => {
		it("should normalize the vector to unit length", () => {
			const vector = new Vector3D(3, 1, 2);
			vector.normalizeInPlace();
			const normalizedVector = new Vector3D(0.8017837257372732, 0.2672612419124244, 0.5345224838248488);
			assertEquals(vector, normalizedVector);
		});
	});
});
