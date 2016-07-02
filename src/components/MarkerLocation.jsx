import React from 'react';

import TextField from 'material-ui/TextField';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import { red500, grey500, yellow500 } from 'material-ui/styles/colors';

const COORD_DECIMAL_PLACES = 5;
const formatCoord = number => number.toFixed(COORD_DECIMAL_PLACES);
const locationToString = location =>
  `${formatCoord(location.lat())}, ${formatCoord(location.lng())}`;

export default class MarkerLocation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hovered: false,
    };
  }
  render() {
    const { id, location, onRemove } = this.props;
    const { hovered } = this.state;
    return (
      <div
        className="marker-location"
        key={id}
        onMouseEnter={() => this.setState({ hovered: true })}
        onMouseLeave={() => this.setState({ hovered: false })}
      >
        <FontIcon
          className="drag-handle material-icons"
          color={hovered ? yellow500 : grey500}
        >
          drag_handle
        </FontIcon>
        <TextField
          style={{
            fontSize: 12,
          }}
          id={`tf-${id}`}
          value={locationToString(location)}
          fullWidth
        />
        <IconButton touch onClick={() => onRemove(id)}>
          <FontIcon className="material-icons" color={red500}>clear</FontIcon>
        </IconButton>
      </div>
    );
  }
}

MarkerLocation.propTypes = {
  id: React.PropTypes.string.isRequired,
  location: React.PropTypes.object.isRequired,
  onRemove: React.PropTypes.func,
};

MarkerLocation.defaultProps = {
  onRemove: () => {},
};
