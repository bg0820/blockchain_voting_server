const router = require('express').Router();
const controller = require('./controller');

router.get('/create', controller.createWallet);
router.get('/check', controller.checkWalletAmount);

module.exports = router;
