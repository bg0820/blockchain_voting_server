const hashmap = require('hashmap');
var walletAddress = new hashmap();
var walletPw = new hashmap();
const sha256 = require('sha256');

function makeKey() {
	var text = "";
    var possible = "abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    for( var i = 0; i < 20; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function checkAmount(key) {
	if(!walletAddress.has(key))
		return -1;

	let amount = walletAddress.get(key);
	return amount.amount;
}

function createWallet(key, amount) {
	let randomVal = makeKey();

	let hash = sha256(key + randomVal);
	walletPw.set(hash, key);
	walletAddress.set(hash, {
		amount: amount
	});

	return hash;
}

// 송금
function remittance(key, sender, recip, amount) {
	// sender 지갑 주소 있는지 확인
	if(!walletAddress.has(sender))
		return -2;

	// recip 지갑 주소 있는지 확인
	if(!walletAddress.has(recip))
		return -3;
		
	if(walletPw.get(sender) !== key)
		return -1;


	let senderAmount = walletAddress.get(sender);
	let recipeAmount = walletAddress.get(recip);

	if(!(senderAmount.amount >= amount)) {
		return -4;
	}

	senderAmount.amount = Number(senderAmount.amount) - Number(amount);
	recipeAmount.amount = Number(recipeAmount.amount) + Number(amount);

	walletAddress.set(sender, senderAmount);
	walletAddress.set(recip, recipeAmount);

	return 0;
}

module.exports.createWallet = createWallet;
module.exports.remittance = remittance;
module.exports.checkAmount = checkAmount;