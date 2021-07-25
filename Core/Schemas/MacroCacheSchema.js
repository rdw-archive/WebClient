const MacroCacheSchema = JOI.object({
	name: JOI.string().required(),
	icon: JOI.string().required(),
	text: JOI.string().required(),
});
