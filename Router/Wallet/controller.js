const wallet = require('../../Model/Wallet');

exports.createWallet = function(req, res) {
	const {key} = req.query;

	res.send(wallet.createWallet(key, 0));
}

exports.checkWalletAmount = function(req, res) {
	const {walletAddress} = req.query;

	let error = wallet.checkAmount(walletAddress);

	if(error >= 0) {
		res.send({msg: error + '개 남음'});
	} else {
		res.send({msg: '잘못된 지갑 주소'});
	}
}