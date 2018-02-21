/**
*
* LightroomAdjustments
*
*/

import React, { Component } from "react";

import PropTypes from "prop-types";

import './styles.css';

import lightroomCCPanels from './lightroomCCPanels.json'
import adjustments from './adjustments.json'

import LightroomAdjustmentsPanel from '../LightroomAdjustmentsPanel';
import LightroomAdjustmentsGroup from '../LightroomAdjustmentsGroup';
import LightroomAdjustmentSlider from '../LightroomAdjustmentSlider';

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

class LightroomAdjustments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      exampleValue: ""
    };
  }

  render() {
    const { exampleValue } = this.state; // eslint-disable-line
    const { exampleProp } = this.props; // eslint-disable-line
    return (
      <div className="lightroom-adjustments">
        {lightroomCCPanels.map((panel) =>
          <LightroomAdjustmentsPanel title={panel.title}>
            {panel.groups.map((group) =>
              <LightroomAdjustmentsGroup title={group.title}>
                {group.items.map((itemKey) => {
                  const item = itemKey in adjustments ? adjustments[itemKey] : null;

                  if(item === null) {
                    return null;
                  }

                  return (<LightroomAdjustmentSlider value={25} minVal={item.minVal} maxVal={item.maxVal} label={item.label} bgClassName={'sliderBg'+ capitalizeFirstLetter(item.bgClassName)} />);
                })}
              </LightroomAdjustmentsGroup>
            )}
          </LightroomAdjustmentsPanel>
        )}
      </div>
    );
  }
}

LightroomAdjustments.propTypes = {
  exampleProp: PropTypes.string
};
LightroomAdjustments.defaultProps = {
  exampleProp: ""
};

export default LightroomAdjustments;
