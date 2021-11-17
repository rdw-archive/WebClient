// This doesn't do any actual decoding; it merely serves to utilize the Resource cache for audio playback
// The audio engine supports no caching mechanism of its own, so we wrap any calls to disk and serve Resources instead
class BuiltinAudioDecoder extends Decoder {
	fileTypes = { mp3: true, ogg: true, wav: true };
	// No need to do any decoding as these audio formats are supported natively
	decode(resource) {
		return resource;
	}
	getSupportedFileTypes() {
		return this.fileTypes;
	}
}
