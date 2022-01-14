// Utilites for working with binary files in JavaScript. Yes, I find the idea appalling, too...
class BinaryReader {
	constructor(binaryData) {
		this.offset = 0;
		this.buffer = binaryData;
		this.view = new DataView(binaryData);
	}

	// Retrieves an unsigned integer (8 bytes), starting at the current offset of the buffer.
	getUint8() {
		let data = this.view.getUint8(this.offset);
		this.offset = this.offset + 1;
		return data;
	}

	// Retrieves a string of the given length (in bytes), starting at the current offset of the buffer.
	getString(numBytes) {
		let string = "";
		for (let index = 0; index < numBytes; index++) {
			let byte = this.view.getUint8(this.offset);
			this.offset = this.offset + 1;
			let character = String.fromCharCode(byte);
			if (byte === 92) character = "/"; // backslash...
			string = string + character;
		}
		string = string.split("\0").shift(); // null-terminated string => discard the garbage data
		return string;
	}

	// Retrieves an unsigned integer (32 bytes), starting at the current offset of the buffer. Little endian is assumed, because laziness prevails.
	getUint32() {
		let isLittleEndian = true;
		let data = this.view.getUint32(this.offset, isLittleEndian);
		this.offset = this.offset + 4;
		return data;
	}

	// Retrieves a signed integer (32 bytes), starting at the current offset of the buffer. Little endian is assumed, because laziness prevails.
	getInt32() {
		let isLittleEndian = true;
		let data = this.view.getInt32(this.offset, isLittleEndian);
		this.offset = this.offset + 4;
		return data;
	}

	forward(numBytes) {
		this.offset = this.offset + numBytes;
	}

	rewind(numBytes) {
		this.offset = this.offset - numBytes;
	}

	seek(offset) {
		this.offset = offset;
	}

	reset() {
		this.offset = 0;
	}

	// Retrieves an unsigned integer (16 bytes), starting at the current offset of the buffer. Little endian is assumed, because laziness prevails.
	getUint16() {
		let isLittleEndian = true;
		let data = this.view.getUint16(this.offset, isLittleEndian);
		this.offset = this.offset + 2;
		return data;
	}

	// Retrieves a signed integer (16 bytes), starting at the current offset of the buffer. Little endian is assumed, because laziness prevails.
	getInt16() {
		let isLittleEndian = true;
		let data = this.view.getInt16(this.offset, isLittleEndian);
		this.offset = this.offset + 2;
		return data;
	}

	// Retrieves a single-precision float (32 bytes), starting at the current offset of the buffer. Little endian is assumed, because laziness prevails.
	getFloat32() {
		let isLittleEndian = true;
		let data = this.view.getFloat32(this.offset, isLittleEndian);
		this.offset = this.offset + 4;
		return data;
	}

	// Retrieves a signed integer (byte), starting at the current offset of the buffer. Little endian is assumed, because laziness prevails.
	getInt8() {
		let data = this.view.getInt8(this.offset);
		this.offset = this.offset + 1;
		return data;
	}

	hasReachedEOF() {
		// This will help detect unexpected failure states (or missed data that wasn't accounted for somehow)
		return this.offset === this.buffer.byteLength;
	}
}
