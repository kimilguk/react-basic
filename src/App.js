import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {//콤포넌트 생성자 : 콤포넌트 실행시 자동 실행(초기화)
    
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }
}

export default App;
