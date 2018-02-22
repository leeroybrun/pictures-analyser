/**
*
* LightroomAdjustments
*
*/

import React, { Component } from "react";

import PropTypes from "prop-types";

import './styles.css';

import lightroomCCPanels from './lightroomCCPanels.json'
import lightroomClassicPanels from './lightroomClassicPanels.json'
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
    const { metadata } = this.props; // eslint-disable-line
    return (
      <div className="lightroom-adjustments">
        {lightroomClassicPanels.map((panel) =>
          <LightroomAdjustmentsPanel title={panel.title}>
            {panel.groups.map((group) =>
              <LightroomAdjustmentsGroup title={group.title}>
                {group.items.map((itemKey) => {
                  const item = itemKey in adjustments ? adjustments[itemKey] : null;

                  if(item === null) {
                    return null;
                  }

                  const itemValue = itemKey in metadata ? parseFloat(metadata[itemKey]) : null;

                  return (<LightroomAdjustmentSlider value={itemValue} minVal={item.minVal} maxVal={item.maxVal} label={item.label} bgClassName={'sliderBg'+ capitalizeFirstLetter(item.bgClassName)} />);
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
  metadata: PropTypes.object
};
LightroomAdjustments.defaultProps = {
  metadata: {}
};

export default LightroomAdjustments;
