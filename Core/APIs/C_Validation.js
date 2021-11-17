var format = require("util").format;

// @deprecated Validators should be global builtins, since APIs are intended to provide high-level engine functionality
const C_Validation = {
	// TODO: Move to a proper schema file
	addonMetadata: {
		supportedFields: {
			// Mandatory fields
			authors: true,
			version: true,
			interfaceVersion: true,
			title: true,
			description: true,
			files: true,
			// Optional fields
			repositoryURL: false,
			releaseJSON: false,
		},
	},
	validateAddonMetadata(contentsJSON) {
		// Required fields must exist
		const supportedFields = this.addonMetadata.supportedFields;
		for (const fieldName in supportedFields) {
			const isRequiredField = supportedFields[fieldName];
			if (isRequiredField && !contentsJSON[fieldName]) return false;
		}

		// All fields must be supported
		for (const fieldName in contentsJSON) {
			const isFieldSupported = supportedFields[fieldName] !== undefined;
			if (!isFieldSupported) return false;
		}

		return true;
	},
	validateUsingSchema(objectToValidate, schemaToValidateAgainst) {
		if (!objectToValidate || !schemaToValidateAgainst) return false; // Always invalid

		const validationResult = schemaToValidateAgainst.validate(objectToValidate);
		const wasValidationSuccessful = !validationResult.error;
		if (!wasValidationSuccessful) WARNING(format("Validation failed: %s", validationResult.error.message));

		return wasValidationSuccessful;
	},
};
