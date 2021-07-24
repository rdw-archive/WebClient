const NetworkingOptionsSchema = JOI.object({
	worldServerURL: JOI.string().uri().required(),
	messageTokenSeparatorString: JOI.string().length(1).required(),
	packMessages: JOI.boolean().required(),
});
