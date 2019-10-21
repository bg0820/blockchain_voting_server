const mapper = require('../../DB/mapperController.js');
const axios = require('axios');
const wallet = require('../../Model/Wallet');
const jwt      = require('jsonwebtoken');
const jConfig = require('../../serverConfig.json');


function makeKey() {
	var text = "";
    var possible = "0123456789";

    for( var i=0; i < 6; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

exports.sendPhone = function(req, res) {
	const {phone, keys} = req.query;

	if(!phone || !keys)
	{
		res.send({ result: 'failed', msg: '입력되지 않은 항목이 있습니다.'});
		return false;
	}

	if(keys !== 'tjdrhdghl1234') {
		res.send({ result: 'failed', msg: ''});
		return false;
	}

	if(phone.length != 11) {
		res.send({ result: 'failed', msg: '핸드폰 번호가 유효하지 않습니다.'});
		return false;
	}
	
	let key = makeKey();

	let opts = {
		"body": "[SKHVOTE]본인확인 인증번호[" + key + "]입니다. \"타인 노출 금지\"",
		"sendNo": "01092919215",
		"recipientList":[
		   {
			  "recipientNo": phone,
			  "countryCode": "82",
			  "internationalRecipientNo": "82" + phone.substring(1, phone.length)
		   }
		]
	};

	axios({
		method: 'POST',
		url: 'https://api-sms.cloud.toast.com/sms/v2.2/appKeys/pGyIXRgcnQpHsLcf/sender/sms',
		data: opts
	}).then(function(result) {
		return mapper.auth.enrollPhoneNumber(phone, key);
	}).then(function(result) {
		res.send({result: 'success' , data: result.data});
	}).catch(function(error) {
		res.send({ result: 'error', msg: '', error: JSON.stringify(error)});
	});

	
}

exports.authOtp = function(req, res) {
	const {otp} = req.query;

	if(!otp)
	{
		res.send({ result: 'failed', msg: '입력되지 않은 항목이 있습니다.'});
		return false;
	}

	if(otp.length != 10) {
		res.send({ result: 'failed', msg: 'OTP코드가 유효하지 않습니다.'});
		return false;
	}
	
	const _pin =  otp.substring(0, 4);
	const _otp = otp.substring(4, 10);

	axios({
		method: 'GET',
		url: 'http://forest.skhu.ac.kr/Gate/OPEN/OTP/ForestOTPAuth.aspx',
		params: {
			P1: _pin,
			P2: _otp
		}
	}).then(function(result) {
		let data = result.data;

		if(data.STS === 'Y') {
			res.send({ result: 'success', msg: ''});
		} else {
			res.send({ result: 'failed', msg: '유효하지 않은 OTP 입니다.'});
		}
	}).catch(function(error) {
		res.send({ result: 'error', msg: '', error: JSON.stringify(error)});
	})
}

exports.authPhone = function(req, res) {
	const {id, phone, phoneIMEI,  key} = req.query;

	if(!id || !phone || !phoneIMEI || !key)
	{
		res.send({ result: 'failed', msg: '입력되지 않은 항목이 있습니다.'});
		return false;
	}

	let walletAddr = wallet.createWallet(id, phoneIMEI, 0);

	mapper.auth.authPhone(id, phone, key, phoneIMEI, walletAddr).then(function(result) {
		console.log(result);

		var payload = {
			idx: result.insertId,
			id: id,
			phone: phone,
			phoneIMEI: phoneIMEI,
			walletAddr: walletAddr
		};
		var secretKey = jConfig.secret;
		var options = {
			algorithm : 'HS256',
			issuer: id,
			subject: 'accountInfo'
		};
	
		let jwtToken = jwt.sign(payload, secretKey, options);

		res.send({ result: 'success', msg: '', token: jwtToken, walletAddr: walletAddr});
	}).catch(function(error) {
		console.log(error);
		if(error == -1) 
			res.send({ result: 'failed', msg: '일치하지 않습니다.'});
		else
			res.send({ result: 'error', msg: '', error: JSON.stringify(error)});
	})
}

exports.reSend = function(req, res) {
	const {phone} = req.query;

	let key = makeKey();

	if(!phone) {
		res.send({ result: 'failed', msg: '입력되지 않은 항목이 있습니다.'});
		return false;
	}

	mapper.auth.reSend(phone, key).then(function(result) {
		let opts = {
			"body": "[SKHVOTE]본인확인 인증번호[" + key + "]입니다. \"타인 노출 금지\"",
			"sendNo": "01092919215",
			"recipientList":[
			   {
				  "recipientNo": phone,
				  "countryCode": "82",
				  "internationalRecipientNo": "82" + phone.substring(1, phone.length)
			   }
			]
		};

		return axios({
			method: 'POST',
			url: 'https://api-sms.cloud.toast.com/sms/v2.2/appKeys/pGyIXRgcnQpHsLcf/sender/sms',
			data: opts});
	}).then(function(result) {
		res.send({ result: 'success', msg: ''});
	}).catch(function(error) {
		res.send({ result: 'error', msg: '', error: JSON.stringify(error)});
	})
}