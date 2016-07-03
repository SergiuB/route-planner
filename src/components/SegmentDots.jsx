import React from 'react';
import { grey500 } from 'material-ui/styles/colors';
import FontIcon from 'material-ui/FontIcon';

export default function SegmentDots(props) {
  const { segmentIdx, segmentDistance, segmentElevation } = props;
  const getDataEl = (icon, text) => (
    <div className="segment-dots-data" >
      <FontIcon
        className="segment-dots-data-icon material-icons"
        color={grey500}
        style={{ fontSize: 10 }}
      >
        {icon}
      </FontIcon>
      <span className="segment-dots-data-val">{text}</span>
    </div>
  );

  return (
    <div className="segment-dots" style={{ top: 30 + 48 * segmentIdx, borderRightColor: grey500 }}>
      {getDataEl('trending_flat', `${segmentDistance}km`)}
      {getDataEl('trending_up', `${segmentElevation}m`)}
    </div>
  );
}

SegmentDots.propTypes = {
  segmentIdx: React.PropTypes.number,
  segmentDistance: React.PropTypes.number,
  segmentElevation: React.PropTypes.number,
};
