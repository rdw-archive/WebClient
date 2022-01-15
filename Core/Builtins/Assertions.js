function assertTrue(expression) {
	return NODE.Assert.equal(expression, true);
}

function assertFalse(expression) {
	return NODE.Assert.equal(expression, false);
}

function assertEquals(value1, value2) {
	return NODE.Assert.deepStrictEqual(value1, value2);
}

function assertNotEquals(value1, value2) {
	return NODE.Assert.notDeepStrictEqual(value1, value2);
}

function assertDeepEquals(value1, value2) {
	return NODE.Assert.deepEqual(value1, value2);
}

function assertUndefined(value) {
	return NODE.Assert.equal(value, undefined);
}

function assertNull(value) {
	return NODE.Assert.equal(value, null);
}

function assertTypeOf(value, expectedType) {
	return assertEquals(value.constructor.name, expectedType);
}

function assertThrows(functionToCall, errorPropertiesMap) {
	return NODE.Assert.throws(functionToCall, errorPropertiesMap);
}

function assertApproximatelyEquals(actual, expected) {
	// Number.EPSILON is too small to work here; this should work in most cases, to the same effect
	const tolerantEpsilon = 1e-5;
	return assertTrue(Math.abs(actual - expected) < tolerantEpsilon);
}

function assertNotApproximatelyEquals(actual, expected) {
	// Number.EPSILON is too small to work here; this should work in most cases, to the same effect
	const tolerantEpsilon = 1e-8;
	return assertFalse(Math.abs(actual - expected) < tolerantEpsilon);
}
