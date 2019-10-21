const router = require('express').Router();
const controller = require('./controller');
const multer = require('multer'); // express에 multer모듈 적용 (for 파일업로드)

let storage = multer.diskStorage({
	destination: function (req, file, cb) {
	  	cb(null, 'Image/');
	},
	filename: function (req, file, cb) {
	  	cb(null, Date.now() + '_' + file.originalname);
	}
});  
let upload = multer({ storage: storage });


//router.get('/vote/create', controller.createVote);

router.get('/vote/detail', controller.voteDetail)
router.get('/vote/list', controller.voteList)
router.get('/vote/list/end', controller.voteEndList)

router.post('/vote/create', controller.createVote);
router.post('/candidate/group/create', controller.createCandidateGroup);
router.post('/candidate/create', controller.createCandidate);

router.post('/img/upload', upload.single('imgFile'), controller.imgUpload)

module.exports = router;
