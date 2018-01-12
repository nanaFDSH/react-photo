import React, { Component } from 'react';
import PhotoWall from './photoWall/photoWall'
import '../common/css/App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <PhotoWall/>
      </div>
    );
  }
}

export default App;
