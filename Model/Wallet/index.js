
const sha256 = require('sha256');

function makeKey() {
	var text = "";
    var possible = "abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    for( var i = 0; i < 20; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function createWallet(stduentNumber, imei) {
	let walletAddress = sha256('soalasft2tKey' + stduentNumber + imei);

	let pwKey = makeKey();
	let result = {
		address: walletAddress,
		pwKey: pwKey,
	};
	return result;
}

function createCandidateWallet(voteIdx, num, name) {
	let walletAddress = sha256(voteIdx + num + name);

	return walletAddress;
}

module.exports.createWallet = createWallet;
module.exports.createCandidateWallet = createCandidateWallet;