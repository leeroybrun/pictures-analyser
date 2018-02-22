/**
*
* LightroomAdjustmentSlider
*
*/

import React, { Component } from "react";

import PropTypes from "prop-types";
import cx from 'classnames';

import './styles.css'

class LightroomAdjustmentSlider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      exampleValue: ""
    };
  }

  render() {
    const { exampleValue } = this.state; // eslint-disable-line
    const { label, value, minVal, maxVal, bgClassName } = this.props; // eslint-disable-line

    const activeClass = value !== 0 ? 'active' : null;
    const sideClass = activeClass ? (value < 0 ? 'left' : 'right') : null;

    const bgTransformScale = value / (Math.abs(minVal) + Math.abs(maxVal));
    const bgLeft = 100 * ((0 - minVal) / (maxVal - minVal));
    const trackLeft = 100 * ((value - minVal) / (maxVal - minVal));

    return <div className="custom-slider">
    <div className="custom-slider-label">{label}</div>
        <div className="custom-slider-value">{value}</div>
        <div className={cx('custom-slider-background', bgClassName)}>
            <div className="custom-slider-background-fill" style={{left: bgLeft+'%', transform: 'scale('+ bgTransformScale +', 2)'}}></div>
        </div>
        <div className="custom-slider-track">
            <div className={cx('custom-slider-track-thumb', activeClass, sideClass)} style={{left: trackLeft+'%'}}></div>
        </div>
    </div>;
  }
}

LightroomAdjustmentSlider.propTypes = {
  label: PropTypes.string,
  value: PropTypes.number,
  minVal: PropTypes.number,
  maxVal: PropTypes.number,
  bgClassName: PropTypes.string
};
LightroomAdjustmentSlider.defaultProps = {
  label: 'Slider',
  value: 0,
  minVal: -100,
  maxVal: 100,
  bgClassName: 'sliderBgDarkLight'
};

export default LightroomAdjustmentSlider;
