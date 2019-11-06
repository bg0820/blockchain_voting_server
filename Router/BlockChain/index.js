const router = require('express').Router();
const controller = require('./controller');
/*
router.post('/user/apply', controller.userApply);

router.get('/info', controller.getUserInfo);*/

router.get('/', controller.blockChain);
//router.get('/mine', controller.mine);
router.get('/amount', controller.amount);
router.get('/block', controller.block);
router.get('/transaction', controller.transaction);

module.exports = router;
