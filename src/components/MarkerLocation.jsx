import React from 'react';

import TextField from 'material-ui/TextField';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import { red500, grey500, yellow500 } from 'material-ui/styles/colors';

const COORD_DECIMAL_PLACES = 5;
const formatCoord = number => number.toFixed(COORD_DECIMAL_PLACES);
const locationToString = ({ lat, lng }) =>
  `${formatCoord(lat)}, ${formatCoord(lng)}`;

export default class MarkerLocation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hovered: false,
    };
  }
  render() {
    const { id, location, address, onRemove } = this.props;
    const { hovered } = this.state;
    const dragHandleEl = (
      <FontIcon
        className="material-icons"
        color={grey500}
        style={{
          fontSize: 18,
          position: 'absolute',
          top: 15,
          left: -20,
        }}
      >
        drag_handle
      </FontIcon>
    );
    return (
      <div
        className="marker-location"
        key={id}
      >
        <div
          className="preamble"
          onMouseEnter={() => this.setState({ hovered: true })}
          onMouseLeave={() => this.setState({ hovered: false })}
        >
          {hovered && dragHandleEl}
          <FontIcon
            className="material-icons"
            color={grey500}
            style={{ fontSize: 18 }}
          >
            radio_button_unchecked
          </FontIcon>
        </div>
        <TextField
          style={{
            fontSize: 12,
          }}
          id={`tf-${id}`}
          value={address || locationToString(location)}
          fullWidth
        />
        <IconButton onClick={() => onRemove(id)}>
          <FontIcon className="material-icons" color={red500}>clear</FontIcon>
        </IconButton>
      </div>
    );
  }
}

MarkerLocation.propTypes = {
  id: React.PropTypes.string.isRequired,
  location: React.PropTypes.array.isRequired,
  address: React.PropTypes.string,
  onRemove: React.PropTypes.func,
};

MarkerLocation.defaultProps = {
  onRemove: () => {},
};
