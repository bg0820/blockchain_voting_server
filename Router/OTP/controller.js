const axios = require('axios');

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