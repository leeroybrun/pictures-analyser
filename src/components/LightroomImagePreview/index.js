/**
*
* LightroomImagePreview
*
*/

import React, { Component } from "react";

import PropTypes from "prop-types";

import './styles.css';

class LightroomImagePreview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imgWidth: null,
      imgHeight: null
    };
  }

  getImageSize(url) {
    return new Promise((resolve, reject) => {
      var img = new Image();
      
      img.onload = () => {
        return resolve({ height: img.height, width: img.width });
      }
      
      img.onerror = () => {
        return reject(new Error('Cannot load image : '+ url));
      }
      
      img.src = url;
    });
  }

  async 

  async componentDidMount() {
    const imgSrc = this.props.imgSrc;
    if(imgSrc === null) {
      return null;
    }

    let size = await this.getImageSize(imgSrc);

    this.setState({
      imgWidth: size.width,
      imgHeight: size.height
    });
  }

  async componentWillReceiveProps(nextProps) {
    const imgSrc = this.props.imgSrc;
    if(imgSrc === null || imgSrc === nextProps.imgSrc) {
      return null;
    }

    let size = await this.getImageSize(nextProps.imgSrc);

    this.setState({
      imgWidth: size.width,
      imgHeight: size.height
    });
  }

  render() {
    const { exampleValue } = this.state; // eslint-disable-line
    const { imgSrc, metadata } = this.props; // eslint-disable-line

    if(imgSrc === null) {
      return null;
    }

    const maxSize = { width: 600, height: 400 };
    let width = this.state.imgWidth;
    let height = this.state.imgHeight;
    let ratio = 0;

    // Check if the current width is larger than the max
    if(width > maxSize.width){
      ratio = maxSize.width / width;   // get ratio for scaling image
      height = height * ratio;    // Reset height to match scaled image
      width = width * ratio;    // Reset width to match scaled image
    }

    // Check if current height is larger than max
    if(height > maxSize.height){
      ratio = maxSize.height / height; // get ratio for scaling image
      width = width * ratio;    // Reset width to match scaled image
      height = height * ratio;    // Reset height to match scaled image
    }

    return <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
    >
    <image width={width} height={height} xlinkHref={imgSrc}/>
  </svg>;
  }
}

LightroomImagePreview.propTypes = {
  imgSrc: PropTypes.any,
  metadata: PropTypes.object
};
LightroomImagePreview.defaultProps = {
  imgSrc: null,
  metadata: {}
};

export default LightroomImagePreview;
