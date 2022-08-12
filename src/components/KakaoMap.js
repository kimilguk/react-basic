import React, {Component} from 'react';

class KakaoMap extends Component {
    constructor (props) {
        //props(속성) 과 state(자료) 관계
        super(props); //부모클래스-Component의 props속성을 사용하겠다고 선언, 이후 부터 this 키워드 사용가능
        this.state = {
          mapKeyword: this.props.keyword,
        };
    };
    componentDidUpdate (newProps, newState) {
        if (this.state.mapKeyword === this.props.keyword) {
          //console.log ('render()안에서 this는 KakaoMap.js콤포넌트 자신을 가리킨다.', this);
          return false;
        } else {
          this.setState ({mapKeyword: this.props.keyword});
        }
    }
    render() {
        return (
            <div>
            	하하 {this.props.keyword} 하하 {this.state.mapKeyword}
            </div>
        );
    }
}

export default KakaoMap;