const sha256 = require('sha256');

class Block {
	constructor(index, data, prevBlockHash, transaction) {
		this.version =  1.0;
		this.index = index;
		this.prevBlockHash = prevBlockHash;
		this.timeStamp = Number(new Date().getTime());
		this.data = data;
		this.transaction = transaction;
		this.hash = this.calcHash();
	}

	calcHash() {
		const dataAsString =  this.index + this.prevBlockHash + this.timeStamp +  JSON.stringify(this.data);
		const hash = sha256(dataAsString);

		return hash;
	}
}

module.exports = Block;