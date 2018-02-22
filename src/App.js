import React, { Component } from 'react';
import './App.css';

//import jQuery from 'jquery';
import Dropzone from 'react-dropzone'

import testPictureExport from './testPictureExport';
import LightroomAdjustments from './components/LightroomAdjustments';
import LightroomImagePreview from './components/LightroomImagePreview';

//window.$ = window.jQuery = jQuery;
import {findEXIFinJPEG} from './exiftool'

class App extends Component {
  constructor() {
    super()
    this.state = { 
      files: [],
      metadata: {}
    }

    this.onDrop = this.onDrop.bind(this);
  }

  onDrop(files) {
    this.setState({
      files
    });

    const reader = new FileReader();
    reader.onload = () => {
      var exif = findEXIFinJPEG(reader.result);
      console.log(exif);
      this.setState({
        metadata: exif
      });
    };
    reader.onabort = () => console.log('file reading was aborted');
    reader.onerror = () => console.log('file reading has failed');

    reader.readAsBinaryString(files[0]);
  }

  render() {
    this.state.files.length > 0 ? console.log(this.state.files[0].preview) : null;
    return (
      <div className="App">
        <div className="drop-files">
          <Dropzone className="dropzone" accept="image/jpeg, image/png" onDrop={this.onDrop}>
              <p>Drop files here.</p>
          </Dropzone>
        </div>
        <div className="columns-wrapper">
          <div className="left-column">
            {this.state.files.length > 0 ? <LightroomImagePreview imgSrc={this.state.files[0].preview} metadata={this.state.metadata || {}} /> : null}
            <pre className="exif-infos">
              {JSON.stringify(this.state.metadata, null, 2)}
            </pre>
          </div>
          <div className="right-column">
            <LightroomAdjustments metadata={this.state.metadata || {}} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
