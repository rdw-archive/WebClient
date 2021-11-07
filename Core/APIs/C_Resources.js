var format = require("util").format;

// Responsibility: Loading/caching of resources (files) from disk,
const C_Resources = {
	cachedResources: {},
};

C_Resources.getCachedResources = function () {
	return this.cachedResources;
};

C_Resources.unload = function (resourceID, reasonString = "none") {
	DEBUG(format("Unloaded resource %s (reason: %s)", resourceID, reasonString));
	delete this.cachedResources[resourceID];
};

C_Resources.unloadAll = function (reasonString = "none") {
	DEBUG(format("Unloading ALL resources (reason: %s)", reasonString));
	for (const resourceID in this.cachedResources) {
		this.unload(resourceID, reasonString);
	}
};

C_Resources.load = function (resourceID, isCritical = false) {
	if (this.isResourceCached(resourceID)) {
		const resource = this.cachedResources[resourceID];
		resource.touch();

		DEBUG(format("Returning resource %s from cache", resourceID));

		return resource;
	}

	DEBUG(format("Loading resource %s from disk", resourceID));

	const resource = new Resource(resourceID, isCritical);
	const fileContents = C_FileSystem.readFileBinary(resourceID);

	resource.data = fileContents;
	resource.state = RESOURCE_STATE_PENDING;

	DEBUG(format("Resource %s is now in state %s", resourceID, resource.state));

	resource.touch();
	this.cachedResources[resourceID] = resource;

	return resource;
};

C_Resources.loadAsync = function (resourceID, isCritical = false) {
	DEBUG(format("Starting async loading of resource %s", resourceID));

	if (this.isResourceCached(resourceID)) {
		DEBUG(
			format(
				"Requested resource %s will not be loaded (already cached)",
				resourceID
			)
		);
		return;
	}

	let resource = new Resource(resourceID, isCritical);
	this.addResource(resourceID, resource);
};

C_Resources.addResource = function (resourceID, resource) {
	if (this.isResourceCached(resourceID)) {
		WARNING(
			format("Failed to add resource %s (resourceID already taken)", resourceID)
		);
		return;
	}

	resource.touch();
	this.cachedResources[resourceID] = resource;
};

C_Resources.isResourceCached = function (resourceID) {
	return this.cachedResources[resourceID] !== undefined;
};

C_Resources.updateCachedResource = function (resourceID, updatedResource) {
	updatedResource.touch();
	this.cachedResources[resourceID] = updatedResource;
};

C_Resources.getCachedResourcesCount = function () {
	return Object.keys(this.cachedResources).length;
};

C_Resources.getResourceInfo = function (resourceID) {
	return this.cachedResources[resourceID];
};
