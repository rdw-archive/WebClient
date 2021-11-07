Enum.RESOURCE_STATE_INITIALIZED = "Initialized"; // created but not used
Enum.RESOURCE_STATE_PENDING = "Pending"; // loading (from disk)
Enum.RESOURCE_STATE_ERROR = "Error"; // loading or processing failed (do we care which?)
Enum.RESOURCE_STATE_DECODING = "Decoding"; // loaded from disk but not yet decoded
Enum.RESOURCE_STATE_READY = "Ready"; // cached (and decoded?)
