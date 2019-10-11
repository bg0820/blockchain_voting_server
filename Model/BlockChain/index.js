const Block = require("../Block");
const wallet = require('../Wallet');

class BlockChain {
	constructor() {
		this.chain = [];
		this.transaction = [];

		let createBlock = this.createGenesisBlock();
		console.log('generate key : ', 'adsbvuaeocbc3d92bceb')
		console.log('generate walletAddress : ', wallet.createWallet('adsbvuaeocbc3d92bceb', 99999999999));
		// 제네시스 블락 생성
		this.chain.push(createBlock);
		//this.createNewBlock(98765, '0', '0')
	}

	createGenesisBlock() {
		return new Block(0, 'GenesisBlock', '0');
	}

	createNewBlock(data) {
		if(!this.isChainValid()) {
			this.chain.pop();
			return null;
		}

		const prevBlockHash = this.getLastBlock().hash;

		let  newBlock = new Block(
			this.chain.length, 
			data, 
			prevBlockHash, 
			this.transaction);

		this.transaction = [];
		this.chain.push(newBlock);

		return newBlock;
	}

	getLastBlock() {
		// 마지막 블럭 가져옴
		return this.chain[this.chain.length - 1];
	}

	createNewTransaction(amount, sender, recipient, senderKey) {
		const newTransaction = {
			amount: amount,
			sender: sender,
			recipient: recipient
		};

		let error = wallet.remittance(senderKey, sender, recipient, amount);

		if(error === 0) {
			this.transaction.push(newTransaction);

			// 마지막 블럭에서 index 번호 가져와서 +1 해준 값 리턴
			return this.getLastBlock()['index'] + 1
		} else {
			return error;
		}
	}

	isChainValid() {
		let genesisBlock = this.chain[0];

		if(genesisBlock.hash !== genesisBlock.calcHash()) {
			return false;
		}

		// 제네시스 블럭 제외하고 현재 검증되지 않은 블럭 제외
		for(var i = 1; i < this.chain.length - 1; i++) {
			let prevBlock = this.chain[i - 1];
			let currentBlock = this.chain[i];

			// 현재 블록 해쉬와 계산된 해쉬값이 다른경우
			if(currentBlock.hash !== currentBlock.calcHash()) {
				return false;
			}

			// 현재 기록되어있는 이전 해쉬와 실제 이전 해쉬 값이 다를경우
			if(currentBlock.prevBlockHash !== prevBlock.hash) {
				return false;
			}
		}
		
		return true;
	}

	/*
	hashBlock(prevBlockHash, currentBlockData, nonce) {
		const dataAsString =  this.chain.length + prevBlockHash + nonce.toString() + JSON.stringify(currentBlockData);
		const hash = sha256(dataAsString);

		return hash;
	}*/

	// pow 작업증명 - 체인의 유효성
	/*proofOfWork(prevBlockHash, currentBlockData) {
		let nonce = 0;
		let hash = this.hashBlock(prevBlockHash, currentBlockData, nonce);
		
		// 난이도 첫번째 글자부터 네번째 글자가 0000 일치하는것 찾기
		while(hash.substring(0, 4) != '000') {
			nonce++;
			hash = this.hashBlock(prevBlockHash, currentBlockData, nonce);
		}

		return nonce;
	}*/
	
}


module.exports = BlockChain;