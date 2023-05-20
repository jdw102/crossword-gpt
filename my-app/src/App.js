import logo from './logo.svg';
import './App.css';
import React from 'react';
import {useState, useEffect} from 'react';
import axios from 'axios';

function App() {
  const testUrl = "http://127.0.0.1:5000/test";
  useEffect(() => {
    console.log("start")
    axios.get(testUrl)
    .then((response) => {
      console.log(response);
    });
    console.log("finish")
}, [testUrl]);

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

export default App;
