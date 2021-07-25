// Should only contain entries in the format <AddonName>: isEnabled
const AddonCacheSchema = JOI.object().pattern(/\w+/, JOI.boolean());
