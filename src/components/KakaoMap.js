/*global kakao*/
import React, {Component} from 'react';

class KakaoMap extends Component {
    constructor (props) {
        //props(속성) 과 state(자료) 관계
        super(props); //부모클래스-Component의 props속성을 사용하겠다고 선언, 이후 부터 this 키워드 사용가능
        //부모클래스 props속성의 state값 초기화
        this.state = {
          keyword: '천안시', //검색어 상태 입력예
          pageNo: 1,
          totalCount: 0,
        } //json 1차원 데이터 객체 sub: 'Google 지도를 제대로 로드할 수 없습니다.',
        this.onSearch = this.onSearch.bind(this);
        this.onChange = this.onChange.bind(this);
        this.getData = this.getData.bind(this);

        this.removeAllChildNods = this.removeAllChildNods.bind(this);
        this.repeatPage = this.repeatPage.bind(this);
        this.onPage = this.onPage.bind(this);
    };
    repeatPage(totalCount) {
        var pagingNo = Math.ceil(this.state.totalCount/10);
        var arr = [];
        for(var i=1; i<=pagingNo; i++) {
            arr.push(
                <option key={i} value={i}>{i}</option>
            );
        }
        return arr;
    }
    onPage = (e) => { //페이지 선택 이벤트 함수
        this.setState({[e.target.id]: e.target.value});//화면처리
        this.state.pageNo =  e.target.value;//js처리
        var mapContainer = document.getElementById('map');
        this.removeAllChildNods(mapContainer);//기존 카카오맵 겍체 지우기
        this.getData();
    };
    removeAllChildNods(el) { //기존 지도 지우기
        while (el.hasChildNodes()) {
          	el.removeChild (el.lastChild);
        }//기술참조:https://apis.map.kakao.com/web/sample/keywordList/
    }
    onSearch() { // 검색 버튼 이벤트 함수
        var mapContainer = document.getElementById('map');
        this.removeAllChildNods(mapContainer);//기존 카카오맵 겍체 지우기
        this.state.pageNo = 1;//js처리
        this.getData();
    }
    onChange(e) { // 검색어 수정 이벤트 함수
        this.setState({[e.target.id]: e.target.value});//화면처리-재랜더링
        this.state.keyword = e.target.value;//js처리
    }
    getData() { // 지도 데이터 처리 + 출력
    var url = 'https://server-basic-fekuw.run.goorm.io/openapi/getdata?keyword='+this.state.keyword+'&pageNo='+this.state.pageNo;;
    fetch (url, {method:'get'})
        .then (response => response.json()) //응답데이터를 json 형태로 변환
        .then (contents => { //json으로 변환된 응답데이터인 contents 를 가지고 구현하는 내용
            //this.state.totalCount = contents['response']['body']['totalCount']['_text'];//js처리
            this.setState({totalCount:  contents['response']['body']['totalCount']['_text']});//화면처리
            var positions = [];//배열 선언
            var jsonData;
            jsonData=contents['response']['body']['items'];
            console.log(jsonData);
            jsonData['item'].forEach((element) => {//람다식 사용 function(element) {}
                positions.push(
                  {
                    content: "<div>"+element["csNm"]['_text']+"</div>",//충전소 이름
                    latlng: new kakao.maps.LatLng(element["lat"]['_text'], element["longi"]['_text']) // 위도(latitude), 경도longitude)
                  }
                );
            });
            var index = parseInt(positions.length/2);//배열은 인덱스순서 값을 필수로 가지고, 여기서는 반환 값의 개수로 구한다.
            console.log(jsonData["item"][index]["lat"]['_text']);
            //console.log(jsonData);
            var mapContainer = document.getElementById('map'), // 지도를 표시할 div  
                mapOption = { 
                    center: new kakao.maps.LatLng(jsonData["item"][index]["lat"]['_text'], jsonData["item"][index]["longi"]['_text']),
                    //center: new kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
                    level: 10 // 지도의 확대 레벨
                };

            var map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다
            for (var i = 0; i < positions.length; i ++) {
                // 마커를 생성합니다
                var marker = new kakao.maps.Marker({
                    map: map, // 마커를 표시할 지도
                    position: positions[i].latlng // 마커의 위치
                });

                // 마커에 표시할 인포윈도우를 생성합니다 
                var infowindow = new kakao.maps.InfoWindow({
                    content: positions[i].content // 인포윈도우에 표시할 내용
                });

                // 마커에 mouseover 이벤트와 mouseout 이벤트를 등록합니다
                // 이벤트 리스너로는 클로저를 만들어 등록합니다 
                // for문에서 클로저를 만들어 주지 않으면 마지막 마커에만 이벤트가 등록됩니다
                kakao.maps.event.addListener(marker, 'mouseover', makeOverListener(map, marker, infowindow));
                kakao.maps.event.addListener(marker, 'mouseout', makeOutListener(infowindow));
            }
            // 인포윈도우를 표시하는 클로저를 만드는 함수입니다 
            function makeOverListener(map, marker, infowindow) {
                return function() {
                    infowindow.open(map, marker);
                };
            }

            // 인포윈도우를 닫는 클로저를 만드는 함수입니다 
            function makeOutListener(infowindow) {
                return function() {
                    infowindow.close();
                };
            }
        })
        .catch ((err) => console.log ('에러: ' + err + '때문에 접속할 수 없습니다.'));
    }
    componentDidMount () { // 생명주기 중 초기 화면 렌더링 후 실행함수
    	this.getData();
    }
    
    render() {
        //props-state의 값이 바뀌면 html을 그리는 함수 render 자동으로 재 실행됨
        //console.clear (); //콘솔 지저분한것 때문에... 디버그시 주석해제 필요.
        console.log ('render()안에서 this는 App.js콤포넌트 모듈 자신을 가리킨다.', this);
        //constructor (props) 부모클래스의 초기화한 값을 아래 태그의 속성(props)에 this값으로 전달한다.
        return (
            <div style={{textalign:"center"}}>
                <input type="text" id="keyword" onChange={this.onChange} value={this.state.keyword} />
                <input type="button" onClick={this.onSearch} value="검색" />
                <select id="pageNo" onChange={this.onPage} value={this.state.pageNo}>
                	{this.repeatPage(this.state.totalCount)}
                </select>
                <div id="map" style={{width:"100%",height:"350px"}}></div>
            </div>
        );
    }
}

export default KakaoMap;