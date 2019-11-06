const router = require('express').Router();
const controller = require('./controller');
const multer = require('multer'); // express에 multer모듈 적용 (for 파일업로드)

const jwt      = require('jsonwebtoken');
const jConfig = require('../../serverConfig.json');

let storage = multer.diskStorage({
	destination: function (req, file, cb) {
	  	cb(null, 'Image/');
	},
	filename: function (req, file, cb) {
	  	cb(null, Date.now() + '_' + file.originalname);
	}
});  
let upload = multer({ storage: storage });

// 미들웨어 헤더 검사
router.use(function(req, res, next){
	let permitList = ['/vote/report'];
	if(permitList.includes(req._parsedUrl.pathname)) {
		next();
		return;
	}

    let token = req.headers['authorization'];

    if(!token) {
		res.send({result: 'failed', msg: '토큰을 입력해주세요.'});
        return;
    }

    if(token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
    }

	jwt.verify(token, jConfig.secret, function(err, decoded) {
		if(err) 
			res.send({result: 'failed', msg: '유효하지 않은 토큰 입니다.'});
		else {
			req.decode = decoded;
			next();
		}
	});
});

//router.get('/vote/create', controller.createVote);

router.get('/vote/report', controller.report);

router.post('/vote', controller.vote);

module.exports = router;
