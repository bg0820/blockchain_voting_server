var port = process.argv[2];

// main Require
const express = require('express');
const app = express();
const http = require('http').Server(app);

const bodyParser = require('body-parser');
const cors = require('cors');

// User Require
const jConfig = require('./serverConfig.json');

const BlockChain = require('./Model/BlockChain');

//console.log(blockChain.proofOfWork(previousBlockHash, currentBlockData));


const database = require('./DB/index.js');
// DB 연결
database.init();

// CORS 설정 cross 문제 해결 ajax
app.use(cors({
	origin: '*',
	optionsSuccessStatus: 200,
}));

// Body-parser
// 클라이언트 POST request data의 body를 json 객체로 파싱해줌
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


http.listen(port, function(){
    console.log('listening on http://' + jConfig.host + ':' + port);
});

app.use('/blockchain', require('./Router/BlockChain'));
app.use('/wallet', require('./Router/Wallet'));
app.use('/auth', require('./Router/Auth'));
app.use('/user', require('./Router/User'));
app.use('/', require('./Router/Main'));


// css, js, img 정적파일
app.use('/img', express.static('Image'));
app.use('/page', express.static('public'));