const router = require('express').Router();
const controller = require('./controller');
/*
router.post('/user/apply', controller.userApply);

router.get('/info', controller.getUserInfo);*/

router.get('/', controller.authOtp);

module.exports = router;
