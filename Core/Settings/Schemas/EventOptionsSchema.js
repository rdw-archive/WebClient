const EventOptionsSchema = JOI.object({
	activeEventTriggers: JOI.object().required().pattern(/\w+/, JOI.boolean()),
});
