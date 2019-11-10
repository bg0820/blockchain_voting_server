const Block = require("../Block");
const wallet = require('../Wallet');
const sha256 = require('sha256');
const mapper = require('../../DB/mapperController');

var fs = require("fs");

class BlockChain {
	constructor() {
		let readData = null;
		try {
			readData = fs.readFileSync('chain.json', 'utf-8');
		} catch(error) {

		}
		if(readData === null) {

			this.chain = [];
			this.transaction = [];
	
			this.currentNodeUrl = '127.0.0.1:3001';
			this.networkNodes = [];
	
	
			let generateImeiKey = 'Savsn90sdvbiu@!@B98cbwea';
			let generateWalletAddress = wallet.createWallet('000000000', generateImeiKey);
	
			console.log('generate imei key : ', generateImeiKey);
			console.log('generate walletAddress : ', generateWalletAddress.address);
	
			//this.createNewTransaction(9999999999999, '0', generateWalletAddress, generateImeiKey, -1);
	
			const newTransaction = {
				amount: 9999999999999,
				sender: '0',
				recipient: generateWalletAddress.address,
				voteIdx: -1
			};
	
			let createBlock = this.createGenesisBlock([newTransaction]);
	
			// 제네시스 블락 생성
			this.chain.push(createBlock);
		} else {
			readData = JSON.parse(readData);
			
			this.chain = [];
			this.transaction = [];
	
			this.currentNodeUrl = '127.0.0.1:3001';
			this.networkNodes = [];
			
			for(var i = 0 ; i < readData.chain.length; i++) {
				let item = readData.chain[i];
				let block = new Block(0, 0, 0, 0);
				block.init(item);

				this.chain.push(block);
			}
			this.transaction = readData.transaction;
	
			this.currentNodeUrl = '127.0.0.1:3001';
			this.networkNodes = readData.networkNodes;

		}

		//this.createNewBlock(98765, '0', '0')
	}

	createGenesisBlock(transaction) {
		return new Block(0, 'GenesisBlock', '0', transaction);
	}

	genesisBlock(index, data, prevBlockHash, transaction) {
		return new Block(index, data, prevBlockHash, transaction);
	}

	createNewBlock(data) {
		if(this.transaction.length > 0) {

			if(!this.isChainValid()) {
				this.chain.pop();
				return null;
			}
	
			const prevBlockHash = this.getLastBlock().hash;
	
			let  newBlock = this.genesisBlock(
				this.chain.length, 
				data, 
				prevBlockHash, 
				this.transaction);
	
			this.transaction = [];
			this.chain.push(newBlock);
	
	
			fs.writeFileSync( "chain.json",  JSON.stringify(this) , "utf8" );
	
			return newBlock;
		}

		return null;
	}

	getLastBlock() {
		// 마지막 블럭 가져옴
		return this.chain[this.chain.length - 1];
	}

	createNewTransaction(amount, sender, recipient, voteIdx, _voteType) {
		// let keyHash = sha256('sdavbui21289' + imei);

		let _voteIdx = Number(voteIdx);

		const newTransaction = {
			amount: Number(amount),
			sender: sender,
			recipient: recipient,
			voteIdx: _voteIdx,
			voteType: _voteType
		};

		let senderAmount = this.getAmount(sender, _voteIdx);
		console.log(sender, senderAmount, _voteIdx);

		if(senderAmount >= amount) {
			this.transaction.push(newTransaction);
			return this.getLastBlock()['index'] + 1
		} else {
			return null;
		}
		
		
		/*let error = wallet.remittance(imei, sender, recipient, amount, voteIdx);

		if(error === 0) {
			this.transaction.push(newTransaction);

			// 마지막 블럭에서 index 번호 가져와서 +1 해준 값 리턴
			return this.getLastBlock()['index'] + 1
		} else {
			return error;
		}*/
	}

	// Chain 유효성 검사
	isChainValid() {
		let genesisBlock = this.chain[0];

		if(genesisBlock.hash !== genesisBlock.calcHash()) {
			return false;
		}

		// 제네시스 블럭 제외하고 현재 검증되지 않은 트랜잭션 제외
		for(var i = 1; i < this.chain.length; i++) {
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

	getAmount(walletAddress, voteIdx) {

		// TODO: voteIdx 에 해당하는 지갑주소에 몇개 있는지 체크

		let amount = 0;

		// 제네시스 블럭 포함후 현재 검증되지 않은 트랜잭션 제외
		for(var i = 0; i < this.chain.length; i++) {
			let block = this.chain[i];

			//console.log('block', block);

			let transactions = block.transaction;

			if(transactions === undefined)
				continue;

			for(var j = 0; j < transactions.length; j++) {
				let transaction = transactions[j];
				
				if(transaction.voteIdx === -1) { 
					if(walletAddress === transaction.sender) {
						amount -= transaction.amount; 
					}

					if(walletAddress === transaction.recipient) {
						amount += transaction.amount; 
					}
				} else {
					if(voteIdx === transaction.voteIdx) {
						
						//console.log(transaction);
						if(walletAddress === transaction.sender) {
							amount -= transaction.amount; 
						}
	
						if(walletAddress === transaction.recipient) {
							amount += transaction.amount; 
						}
					}
				}
				
			}
		}

		for(var i = 0 ; i < this.transaction.length; i++) {
			let transaction = this.transaction[i];

			if(voteIdx === transaction.voteIdx) {
				if(walletAddress === transaction.sender) {
					amount -= transaction.amount; 
				}

				if(walletAddress === transaction.recipient) {
					amount += transaction.amount; 
				}
			}
		}

		return amount;
	}


	async report(voteIdx) {
		let totalCnt = 0; // 총 투표자 수 
		let abstenCnt = 0; // 기권 수
		let voteCnt = 0; // 투표 수
		let oppCnt = 0;
		let aggCnt = 0;

		let candidateGroup = [];

		let group = await mapper.candidate.getCandidateGroup(voteIdx);
		for(var i = 0 ;i < group.length; i++) {
			let item = group[i];
			candidateGroup.push({
				walletAddress: item.walletAddress,
				num: item.num,
				name: item.name,
				cnt: 0
			});
		}

		let lastAddr = '';
		
		// 제네시스 블럭 포함후 현재 검증되지 않은 트랜잭션 제외
		for(var i = 0; i < this.chain.length; i++) {
			let block = this.chain[i];

			//console.log('block', block);

			let transactions = block.transaction;

			if(transactions === undefined)
				continue;

			for(var j = 0; j < transactions.length; j++) {
				let transaction = transactions[j];
				
				if(transaction.voteIdx === voteIdx) {
					lastAddr = transaction.recipient;

					if(transaction.voteType === 'ADD') { // 투표권 부여
						totalCnt++;
					} else if(transaction.voteType === 'ABS') { // 기권표
						abstenCnt++;
					} else if(transaction.voteType === 'VOTE') { // 투표
						voteCnt++;

						for(var k = 0 ; k< candidateGroup.length; k++) {
							if(candidateGroup[k].walletAddress === transaction.recipient) {
								candidateGroup[k].cnt = candidateGroup[k].cnt + 1;
							}
						}
					} else if(transaction.voteType ==='OPP') { // 단일 투표일때 반대표
						oppCnt++;
					} else if(transaction.voteType === 'AGG') { // 단일 투표일때 찬성
						aggCnt++;
					}
				}	
			}
		}

		let validVoteCnt =  100.0 - ((abstenCnt / voteCnt) * 100.0);

		// TODO: 찬반 동점일경우 또는 그룹1, 그룹2 투표율 같을떄 해결
		let result = {
			type: 0, // 0 = 단일, 1 = 복수
			totalCnt: totalCnt,
			abstenCnt: abstenCnt,
			voteCnt: voteCnt,
			validVoteCnt: isNaN(validVoteCnt) ? 100 : validVoteCnt, // 개표율
			result: null
		}

		if(group.length === 1) {
			result.oppCnt = oppCnt;
			result.aggCnt = aggCnt;

			if(result.aggCnt > result.oppCnt) {
				result.result =  candidateGroup[0].walletAddress;
			}
		} else {
			result.type = 1;
			result.candidateGroup = candidateGroup;

			let max = 0;

			for(var k = 0 ; k< candidateGroup.length; k++) {
				if(max < result.candidateGroup[k].cnt) {
					max = result.candidateGroup[k].cnt;
					result.result = result.candidateGroup[k].walletAddress;
				}
			}
		}

		return result;
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

var blockChain = new BlockChain();

module.exports = blockChain;