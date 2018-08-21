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

    width = Math.round(width);
    height = Math.round(height);

    function renderCircularGradient(metadata) {
      if(!metadata.CorrectionMasks) {
        return null;
      }

      const mask = metadata.CorrectionMasks[0];

      const top = parseFloat(mask.Top) * height;
      const left = parseFloat(mask.Left) * width;
      const bottom = parseFloat(mask.Bottom) * height;  // Bottom side of elispe from the top
      const right = parseFloat(mask.Right) * width;     // Right side of elispe from the left

      const maskWidth = right - left;
      const maskHeight = bottom - top;

      const rx = maskWidth / 2;
      const ry = maskHeight / 2;

      const cx = left + rx;
      const cy = top + ry;

      return <ellipse cx={cx} cy={cy} rx={rx} ry={ry} style={{fill:'yellow', stroke: 'purple', strokeWidth: 2 }} />
    }

    function renderGradient(metadata) {
      if(!metadata.CorrectionMasks) {
        return null;
      }

      const mask = metadata.CorrectionMasks[0];

      const zeroX = parseFloat(mask.ZeroX) * width;
      const zeroY = parseFloat(mask.ZeroY) * height;
      const fullX = parseFloat(mask.FullX) * width;  
      const fullY = parseFloat(mask.FullY) * height;

      //const m = (fullY - zeroY) / (fullX - zeroX);
      const mPerpendicular = (-1) * ((fullX - zeroX) / (fullY - zeroY)); // negative reciprocal of m (slope of line between full and zero)

      // y - y1 = m(x - x1)
      // y = m(x - x1) + y1
      // x = ((y - y1) / m) + x1
      const fullX1 = 0;
      const fullY1 = mPerpendicular * (fullX1 - fullX) + fullY;

      const fullY2 = 0;
      const fullX2 = ((fullY2 - fullY) / mPerpendicular) + fullX;
      
      const zeroX1 = 0;
      const zeroY1 = mPerpendicular * (zeroX1 - zeroX) + zeroY;

      const zeroY2 = 0;
      const zeroX2 = ((zeroY2 - zeroY) / mPerpendicular) + zeroX;

      return <g>
        <line x1={fullX1} y1={fullY1} x2={fullX2} y2={fullY2} style={{ stroke: 'purple', strokeWidth: 2 }} />
        <line x1={zeroX1} y1={zeroY1} x2={zeroX2} y2={zeroY2} style={{ stroke: 'purple', strokeWidth: 2 }} />
        <polygon points={`${fullX1},${fullY1} ${fullX2},${fullY2} ${zeroX2},${zeroY2} ${zeroX1},${zeroY1}`} fill="url(#redGradient)" />
      </g>;
    }

    function renderDabsCorrectionMask(metadata) {
      console.log('metadata',metadata);
      if(!metadata.Dabs) {
        return null;
      }

      let radius = parseFloat(metadata.Radius) * ((width+height)/2); // Not sure what % is Radius, so we take the average of width and height

      const dabPointRegex = /d ([+-]?([0-9]*[.])?[0-9]+) ([+-]?([0-9]*[.])?[0-9]+)/g;
      const dabRadiusRegex = /r ([+-]?([0-9]*[.])?[0-9]+)/g;

      const dabPoints = [];

      for(let i = 0; i < metadata.Dabs.length; i++) {
        const dab = metadata.Dabs[i];

        const dabType = dab.substring(0, 2);

        // Radius (r RADIUS)
        if(dabType === 'r ') {
          const m = dabRadiusRegex.exec(dab);

          if(m && m.length >= 2) {
            radius = parseFloat(m[1]) * ((width+height)/2);
          }
        
        // Point (d POS_X POS_Y)
        } else if(dabType === 'd ') {
          const m = dabPointRegex.exec(dab);
          let dabXPercent = null;
          let dabYPercent = null;

          if(m && m.length >= 4) {
            dabXPercent = parseFloat(m[1]);
            dabYPercent = parseFloat(m[3]);
          }

          if(dabXPercent !== null && dabYPercent !== null) {
            dabPoints.push({
              x: dabXPercent * width,
              y: dabYPercent * height,
              radius: radius
            });
          }
        }
      }

      return <g>
        {dabPoints.map((p) => p !== null ? <circle cx={p.x} cy={p.y} r={p.radius} style={{fill:'yellow', stroke: 'purple', strokeWidth: 2 }} /> : null)}
      </g>;
    }

    return <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
    >
    <defs>
      <linearGradient id="redGradient" x1="0%" y1="50%" x2="100%" y2="50%">
        <stop offset="0%" style={{ stopColor: 'rgb(255,0,0)', stopOpacity: 0 }} />
        <stop offset="100%" style={{ stopColor: 'rgb(255,0,0)', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <image width={width} height={height} xlinkHref={imgSrc}/>
    {metadata.CircularGradientBasedCorrections ? metadata.CircularGradientBasedCorrections.map((gradientCorr) => renderCircularGradient(gradientCorr)) : null}
    {metadata.GradientBasedCorrections ? metadata.GradientBasedCorrections.map((gradientCorr) => renderGradient(gradientCorr)) : null}
    {metadata.PaintBasedCorrections ? metadata.PaintBasedCorrections.map((paintCorr) => paintCorr.CorrectionMasks.map(mask => renderDabsCorrectionMask(mask))) : null}
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
