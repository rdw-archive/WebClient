class BinaryWriter {
	constructor(binaryData) {
		this.offset = 0;
		this.buffer = binaryData;
		this.view = new DataView(binaryData);
	}

	// Retrieves an unsigned integer (8 bytes), starting at the current offset of the buffer.
	setUint8(value) {
		let data = this.view.setUint8(this.offset, value);
		this.offset = this.offset + 1;
		return data;
	}

	// Retrieves a string of the given length (in bytes), starting at the current offset of the buffer.
	setString(text) {
		for (let index = 0; index < text.length; index += 1) {
			this.view.setUint8(this.offset, text.charCodeAt(index));
			this.offset = this.offset + 1;
		}
	}

	// Retrieves an unsigned integer (32 bytes), starting at the current offset of the buffer. Little endian is assumed, because laziness prevails.
	setUint32(value) {
		let isLittleEndian = true;
		let data = this.view.setUint32(this.offset, value, isLittleEndian);
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
	setFloat32(value) {
		let isLittleEndian = true;
		let data = this.view.setFloat32(this.offset, value, isLittleEndian);
		this.offset = this.offset + 4;
		return data;
	}

	// Retrieves a signed integer (byte), starting at the current offset of the buffer. Little endian is assumed, because laziness prevails.
	getInt8() {
		let data = this.view.getInt8(this.offset);
		this.offset = this.offset + 1;
		return data;
	}
}
