const router = require('express').Router();
const controller = require('./controller');
/*
router.post('/user/apply', controller.userApply);

router.get('/info', controller.getUserInfo);*/


router.get('/otp', controller.authOtp);
router.get('/phone', controller.sendPhone);
router.get('/phone/auth', controller.authPhone);
router.get('/phone/resend', controller.reSend);

module.exports = router;
