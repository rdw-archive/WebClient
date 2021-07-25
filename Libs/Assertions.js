function assertTrue(expression) {
	if (expression) return true;

	CRITICAL(format("Failed to assert that %s is true", expression));
}

function assertFalse(expression) {
	if (!expression) return true;

	CRITICAL(format("Failed to assert that %s is false", expression));
}

function assertEquals(value1, value2) {
	if (value1 === value2) return true;

	CRITICAL(format("Failed to assert that %s is %s", value1, value2));
}

function assertNotEquals(value1, value2) {
	if (value1 !== value2) return true;

	CRITICAL(format("Failed to assert that %s is not %s", value1, value2));
}
