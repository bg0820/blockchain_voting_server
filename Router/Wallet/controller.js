const wallet = require('../../Model/Wallet');
const BlockChain = require('../../Model/BlockChain');



exports.createWallet = function(req, res) {
	const {key} = req.query;

	let address = wallet.createWallet(key, key, 0);

	res.send(address);
}

exports.checkWalletAmount = function(req, res) {
	const {walletAddress} = req.query;

	let amount =  BlockChain.getAmount(walletAddress);
	res.send({msg: amount + '개 남음'});
}