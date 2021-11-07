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