const C_Math3D = {};

C_Math3D.degreesToRadians = function (angleInDegrees) {
	return (angleInDegrees * Math.PI) / 180;
};

C_Math3D.radiansToDegrees = function (angleInRadians) {
	return (angleInRadians * 180) / Math.PI;
};
