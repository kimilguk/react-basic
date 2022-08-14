import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter, Routes, Route } from "react-router-dom";//npm install react-router-dom
import ClassKakaoMap from './components/ClassKakaoMap';
import FunctionKakaoMap from './components/FunctionKakaoMap';

//ReactDOM.render(<App />, document.getElementById('root'));기존코드를 주석처리 후 아래코드 추가

ReactDOM.render(
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/classkakaomap" element={<ClassKakaoMap />} />
          <Route path="/functionkakaomap" element={<FunctionKakaoMap />} />
        </Routes>
    </BrowserRouter>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();