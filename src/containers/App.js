import React, { Component } from 'react';
import logo from '../common/images/logo.svg';
import PhotoWall from './photoWall/photoWall'
import '../common/css/App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        {/*<header className="App-header">*/}
          {/*<img src={logo} className="App-logo" alt="logo" />*/}
          {/*<h1 className="App-title">Welcome to React</h1>*/}
        {/*</header>*/}
        <PhotoWall/>
      </div>
    );
  }
}

export default App;
