describe("Vector2D", () => {
	describe("constructor", () => {
		it("should return an instance of Vector2D", () => {
			const vector = new Vector2D();
			assertTrue(vector instanceof Vector2D);
		});

		it("should initialize the vector with the given coordinates", () => {
			const vector = new Vector2D(1, 2);
			assertEquals(vector.u, 1);
			assertEquals(vector.v, 2);
		});

		it("should initialize the coordinates with zero if none were given", () => {
			const vector = new Vector2D();
			assertEquals(vector.u, 0);
			assertEquals(vector.v, 0);
		});

		it("should expose the dimension of the vector as a static property", () => {
			assertEquals(Vector2D.length, 2);
		});
	});

	describe("clone", () => {
		it("should return a vector with the same coordinates", () => {
			const vectorA = new Vector2D(2, 3);
			const vectorB = vectorA.clone();
			assertEquals(vectorA, vectorB);
		});

		it("should return a separate instance that can be modified independently", () => {
			const vectorA = new Vector2D(2, 3);
			const vectorB = vectorA.clone();
			vectorA.u = 42;
			assertEquals(vectorB.u, 2);
		});
	});
});
