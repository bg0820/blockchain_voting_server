const mapper = require('../../DB/mapperController');

const BlockChain = require('../../Model/BlockChain');

exports.report = async function(req, res) {
	const {voteIdx} = req.query;

	let _voteIdx = Number(voteIdx);
	// TODO: 투표가 진행중인지 끝났는지 체크

	let result = await BlockChain.report(_voteIdx);

	//console.log(result);
	if(result.result !== null) {
		let candiResult = await mapper.candidate.getCandidateGroupToWalletAddress(result.result);
		
		// let voteIdx
		result.info = candiResult[0];

		let candidateResult = await mapper.candidate.getCandidates(result.info.candidateGroupIdx);

		result.candidate = candidateResult;
	}

	res.send({result: 'success', msg: '', data: result});
}

exports.vote = async function(req, res) {
	const {candidateGroupIdx, voteType } = req.body;
	
	const {walletAddress, pwKey} = req.decode;

	let candidateGroupResult = await mapper.candidate.getCandidateGroupWallet(candidateGroupIdx);

	let transactionResult = BlockChain.createNewTransaction(1, walletAddress, candidateGroupResult[0].walletAddress, candidateGroupResult[0].voteIdx, voteType)
	// 그 주소로 
	// token.pwKey === user(테이블).pwKey 랑 같은지
	// createNewTransaction(1, token.walletAddress, candidateGroup.walletAddress, candidateGroup VoteIdx, voteType)
	
	if(transactionResult !== null) {
		res.send({result: 'success', msg: '', nextBlock: transactionResult});
	} else {
		res.send({result: 'failed', msg: '투표권 없음'});
	}
}
