const BlockChain = require('../../Model/BlockChain');


/*
blockChain.createNewBlock(1111,"generator","generator");
blockChain.createNewTransaction(100, 'PACKadffaaf', '0')
blockChain.createNewBlock(2222,"generator2","generator2");
blockChain.createNewTransaction(100, 'PACKadffaaf', '0')
blockChain.createNewTransaction(200, 'PACKadffaaf', '0')
blockChain.createNewTransaction(300, 'PACKadffaaf', '0')
blockChain.createNewBlock(3333,"generator3","generator3");
*/

exports.blockChain = function(req, res) {
	res.send(BlockChain);
}

/*
exports.mine = function(req, res) {
	//마지막 블럭을 가져온다.
	const lastBlock = blockChain.getLastBlock();

	//마지막 블럭의 해쉬 값, 즉 이전 블럭의 해쉬값
	const previousBlockHash = lastBlock['hash'];

	//현재 블락의 데이터 : 미완료된 거래내역 + 블락의 index 값
	const currentBlockData = {
		transactions: blockChain.transaction,
		index: lastBlock['index'] + 1
	};
	
	//이전블락해쉬, 현재블럭 데이터를 proofOfWork에 넣고 맞는 hash값(0000sfaff...)을 찾고 해당 nonce 값을 리턴.
	const nonce = bitcoin.proofOfWork(previousBlockHash, currentBlockData);
	//이전블락해쉬, 현재블럭 데이터, nonce 값을 넣고 현재 블락의 해쉬 값 리턴
	const blockHash = bitcoin.hashBlock(previousBlockHash, currentBlockData,nonce);
	
	//새로운 블락을 생성하려면 nonce,previousBlockHash,blockHash 값이 필요하다.
	const newBlock = bitcoin.createNewBlock(nonce, previousBlockHash, blockHash);
	
	res.send({
		msg: '블럭 생성 완료',
		newBlock: newBlock
	});
}*/

exports.transaction = function(req, res) {
	const {amount, sender, recipient, imei, voteIdx} = req.query;
	const blockIndex = BlockChain.createNewTransaction(amount, sender, recipient, imei, voteIdx);

	console.log(blockIndex);
	if(blockIndex >= 0) {
		res.send({
			msg: blockIndex + " 블럭안으로 들어갈 예정"
		});
	} else {
		if(blockIndex === -1) {
			res.send({
				msg: '전송키 오류'
			});
		} else if(blockIndex === -2) {
			res.send({
				msg: 'sender 오류'
			});
		} else if(blockIndex === -3) {
			res.send({
				msg: 'recip 오류'
			});
		} else if(blockIndex === -4) {
			res.send({
				msg: 'sender 투표권 부족'
			});
		} else if(blockIndex === -5) {
			res.send({
				msg: 'voteIdx 오류'
			});
		}
	}
}

exports.block = function(req, res) {
	const newBlock = BlockChain.createNewBlock()

	res.send({
		msg: BlockChain
	});
}