/**
*
* LightroomAdjustmentsPanel
*
*/

import React, { Component } from "react";

import PropTypes from "prop-types";

import cx from 'classnames';

import './styles.css';

class LightroomAdjustmentsPanel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isExpanded: true
    };

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState(prevState => ({
      isExpanded: !prevState.isExpanded
    }));
  }

  render() {
    const { isExpanded } = this.state; // eslint-disable-line
    const { title, children } = this.props; // eslint-disable-line
    return (
      <div className={cx('expandable', 'panel', isExpanded ? 'expanded' : null)}>
          <div className="header toggleable" onClick={this.toggle}>
              <h1>{title}</h1>
              <svg width="10" height="6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 6">
                  <path d="M9,6c0.3,0,0.5-0.1,0.7-0.3c0.4-0.4,0.4-1,0-1.4l-4-4C5.5,0.1,5.3,0,5,0C4.7,0,4.5,0.1,4.3,0.3l-4,4c-0.4,0.4-0.4,1,0,1.4 C0.5,5.9,0.7,6,1,6c0.3,0,0.5-0.1,0.7-0.3L5,2.4l3.3,3.3C8.5,5.9,8.7,6,9,6z"></path>
              </svg>
          </div>
          <div className="view group">
            {children}
          </div>
      </div>
    );
  }
}

LightroomAdjustmentsPanel.propTypes = {
  title: PropTypes.string
};
LightroomAdjustmentsPanel.defaultProps = {
  title: ""
};

export default LightroomAdjustmentsPanel;
