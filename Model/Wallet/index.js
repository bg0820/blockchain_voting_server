const hashmap = require('hashmap');
var walletAddressHt = new hashmap();
var walletPwHt = new hashmap();
const sha256 = require('sha256');

function makeKey() {
	var text = "";
    var possible = "abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    for( var i = 0; i < 20; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function checkAmount(walletAddr) {
	if(!walletAddressHt.has(walletAddr))
		return -1;

	let amount = walletAddressHt.get(walletAddr);

	return amount.amount;
}

function createCandidateWallet(voteIdx, num, name) {
	let pw = sha256(voteIdx + 'as124dg2' + name);
	let walletAddress = sha256(voteIdx + num + name);

	walletPwHt.set(walletAddress, pw);
	walletAddressHt.set(walletAddress, {
		voteIdx: voteIdx,
		amount: 0
	});

	return walletAddress;
}

function createWallet(stduentNumber, imei, amount) {
	let pw = sha256(imei + 'asd23');
	let walletAddress = sha256(stduentNumber + imei);

	walletPwHt.set(walletAddress, pw);
	walletAddressHt.set(walletAddress, {
		amount: Number(amount)
	});

	return walletAddress;
}

// 송금
function remittance(imei, sender, recip, amount, voteIdx) {
	let pw = sha256(imei + 'asd23');

	// sender 지갑 주소 있는지 확인
	if(!walletAddressHt.has(sender))
		return -2;

	// recip 지갑 주소 있는지 확인
	if(!walletAddressHt.has(recip))
		return -3;
		
	if(walletPwHt.get(sender) !== pw)
		return -1;


	let senderAmount = walletAddressHt.get(sender);
	let recipeAmount = walletAddressHt.get(recip);

	if(!(senderAmount.amount >= amount)) {
		return -4;
	}

	if(recipeAmount.voteIdx !== undefined) {
		if(recipeAmount.voteIdx !== voteIdx) {
			return -5;
		}
	}

	senderAmount.amount = Number(senderAmount.amount) - Number(amount);
	recipeAmount.amount = Number(recipeAmount.amount) + Number(amount);

	walletAddressHt.set(sender, senderAmount);
	walletAddressHt.set(recip, recipeAmount);

	return 0;
}

module.exports.createCandidateWallet = createCandidateWallet;
module.exports.createWallet = createWallet;
module.exports.remittance = remittance;
module.exports.checkAmount = checkAmount;