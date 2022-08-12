var express = require('express');
var app = express();

app.listen(4000, () => {
    console.log('노드js서버 시작: ', 4000);
});

app.use('/api', function(req, res) {
    //res.end("샘플출력");
    res.json({jsonData:'jsonData'});
});
var cors = require('cors');//리액트와 노드js간 데이터 통신에 보안 처리모듈 사용 npm install cors
app.use(cors(
    {
	  origin: ["https://react-basic-fekuw.run.goorm.io","https://server-basic-fekuw.run.goorm.io/"], //도메인 대신에 * 로 하면 모든 도메인에서 허용된다. 보안상 도메인을 지정하는것이 안전하다.
	  methods: ["GET", "POST"]
	}
));
/*
CORS란?
HTTP header에 추가적인 정보를 추가하여 현재 웹페이지가 웹페이지를 받은 서버(자기 자신)뿐만 아니라
다른 서버에서 요청한 정보도 허용할 수 있도록 해주는 것이다
*/
/* GET API page. */
app.use('/openapi/getdata', function(req, res) {
    console.log('/openapi/getdata 호출됨.');
	keyword = req.query.keyword || '천안시';//리액트js 에서 보낸 검색어를 지정한다.
    pageNo = req.query.pageNo || '1';//리액트js 에서 보낸 페이지번호를 지정한다.
	console.log(keyword);
	var request = require('request');//npm install request
	var convert = require('xml-js');//npm install xml-js
    //var parser = require('fast-xml-parser'); //이 모듈을 사용하지 않는다. npm uninstall fast-xml-parser
	var url = 'http://openapi.kepco.co.kr/service/EvInfoServiceV2/getEvSearchList';
	var queryParams = '?' + encodeURIComponent('serviceKey') + '=PLJPmKeBFGOkoxgAoLJgT962Uh0QPWijxPNQ%2Bl%2B4o24r9R%2BqbclT0Fc9xSamDrGiMYAF4CrpJLaDOsKZ%2FDoN%2Bw%3D%3D'; /* Service Key*/
	queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent(pageNo); /* */
	queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('10'); /* */
	queryParams += '&' + encodeURIComponent('addr') + '=' + encodeURIComponent(keyword); /* 천안시 고정값 대신 keyword */
    console.log(queryParams);
	request({
		url: url + queryParams,
		method: 'GET'
	}, function (error, response, body) {
		console.log('Status', response.statusCode);
		console.log('Headers', JSON.stringify(response.headers));
		console.log('Reponse received', body);
		/*
		convert에서 xml2json이라는 함수를 이용해 xml -> json으로 데이터를 파싱했고, 
		그에 따른 파라미터로 현재 xml 데이터 형식인 body변수를, compact(데이터 간소화 여부), spaces(들여쓰기 포인트)를 이용하여 파싱
		*/
		var xmlToJson = convert.xml2json(body, {compact: true, spaces: 4});
        res.end(xmlToJson);
	});
});
var path = require('path');
app.use(express.static(path.join(__dirname, 'build')));
app.get('*', function (req, res) { // / 루트 또는 /kakaomap 처럼 계속 추가 하기는 무리, 그래서 * 사용
  res.sendFile(path.join(__dirname, '/build/index.html'));
});