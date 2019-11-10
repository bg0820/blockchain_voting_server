const mapper = require('../../DB/mapperController');
const wallet = require('../../Model/Wallet');
const BlockChain = require('../../Model/BlockChain');


exports.voteDetail = function(req, res) {
	const {voteIdx} = req.query;

	mapper.vote.voteDetail(voteIdx).then(function(result) {
		res.send({result: 'success', msg: '', data: result});
	}).catch(function(error) {
		if(error === -1) {
			res.send({result: 'failed', msg: 'voteIdx 가 존재하지 않습니다.'});
		} else {
			res.send({result: 'error', error: error});
		}
	});
}

exports.voteList = function(req, res) {
	BlockChain.createNewBlock();

	mapper.vote.voteList().then(function(result) {
		res.send({result: 'success', msg: '', rows: result});
	}).catch(function(error) {
		res.send({result: 'error', error: error});
	});
}

exports.voteEndList = function(req, res) {
	mapper.vote.voteEndList().then(function(result) {
		res.send({result: 'success', msg: '', rows: result});
	}).catch(function(error) {
		res.send({result: 'error', error: error});
	});
}


exports.createVote = function(req, res) {
	const {name, voteType, startDate, endDate} = req.body;

	let _startDate = new Date(startDate);
	let _endDate = new Date(endDate);


	mapper.vote.voteCreate(name, Number(voteType), _startDate, _endDate).then(function(result) {
		console.log(result);

		return Promise.all([result.insertId, mapper.vote.getVoteUsers()]);
	}).then(function(result) {
		let voteIdx = result[0];
		let voteUserResult = result[1];

		for(var i = 0 ; i < voteUserResult.length; i++) {
			BlockChain.createNewTransaction(1, 'f985d60a2d9b5f135e8c5255483cb594917b4124787f4d3c2694e8ef51ff8f17',voteUserResult[i].walletAddress, voteIdx, 'ADD');
		}


		BlockChain.createNewBlock();

		res.send({result: 'success', msg: '', voteIdx: voteIdx});
	}).catch(function(error) {
		res.send({result: 'error', error: error});
	});
}

exports.createCandidateGroup = function(req, res) {
	const {voteIdx, num, name, commit} = req.body;

	let walletAddress = wallet.createCandidateWallet(voteIdx, num, name);

	mapper.vote.candidateGroupCreate(Number(voteIdx), Number(num), name, commit, walletAddress).then(function(result) {
		console.log(result);
		
		res.send({result: 'success', msg: '', candidateGroupIdx: result.insertId, walletAddress: walletAddress});
	}).catch(function(error) {
		res.send({result: 'error', error: error});
	});
}

exports.createCandidate = function(req, res) {
	const {candidateGroupIdx, id, name, departmentName, profileImg, career, position} = req.body;

	mapper.vote.candidateCreate(Number(candidateGroupIdx), id, name, departmentName, profileImg, career, Number(position)).then(function(result) {
		console.log(result);
		res.send({result: 'success', msg: '', candidateIdx: result.insertId});
	}).catch(function(error) {
		res.send({result: 'error', error: error});
	});
}


exports.imgUpload = function(req, res) {
	var validate = [
		"image/jpeg", 
		"image/gif",
		"image/tiff",
		"image/bmp",
		"image/png"
	];

	console.log(req.file);
	if(	validate.includes(req.file.mimetype)) {
		res.send({result: 'success', msg: '', url: 'http://onyou.pro:3001/img/' + req.file.filename});

	} else {
		//TODO: 파일 삭제해야함 
		res.send({result: 'failed', msg: '이 파일을 사용할 수 없습니다.'});

		fs.unlink(req.file.path, function(err){
			if( err ) 
				throw err;
		});
		
	}
}