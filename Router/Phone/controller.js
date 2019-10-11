const axios = require('axios');

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
		res.send(result.data)
	}).catch(function(error) {
		res.send({ result: 'error', msg: '', error: JSON.stringify(error)});
	})
}