/**
*
* LightroomAdjustmentsGroup
*
*/

import React, { Component } from "react";

import PropTypes from "prop-types";

import './styles.css';

class LightroomAdjustmentsGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      exampleValue: ""
    };
  }

  render() {
    const { exampleValue } = this.state; // eslint-disable-line
    const { title, children } = this.props; // eslint-disable-line
    return <div className="adjustents-group">
      <div className="adjustents-group-title">{title}</div>
      <div className="adjustents-group-view">
        {children}
      </div>
    </div>;
  }
}

LightroomAdjustmentsGroup.propTypes = {
  title: PropTypes.string
};
LightroomAdjustmentsGroup.defaultProps = {
  title: ""
};

export default LightroomAdjustmentsGroup;
