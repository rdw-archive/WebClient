function validateString(objectToTypecheck, errorMessage) {
	// In JavaScript, Strings can be objects or literals. Perhaps they could also be flying dinosaurs?
	const isString = typeof objectToTypecheck === "string" || objectToTypecheck instanceof String;
	if (!isString) throw new TypeError(errorMessage);
}

function validateNumber(objectToTypecheck, errorMessage) {
	const isNumber = typeof objectToTypecheck === "number" || objectToTypecheck instanceof Number;
	// NaN is technically a "number" value, but can't be checked normally, because JavaScript is awesome like that
	const isNaN = objectToTypecheck !== objectToTypecheck; // isNaN() should also work, except for when it doesn't...
	if (!isNumber || isNaN) throw new TypeError(errorMessage);
}
