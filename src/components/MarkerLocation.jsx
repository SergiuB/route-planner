import React from 'react';

import TextField from 'material-ui/TextField';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import { red500, grey500 } from 'material-ui/styles/colors';

export default function MarkerLocation({ id, location, onRemove }) {
  return (
    <div
      className="marker-location"
      key={id}
    >
      <FontIcon
        className="drag-handle material-icons"
        color={grey500}
      >
        drag_handle
      </FontIcon>
      <TextField
        style={{
          fontSize: 12,
        }}
        id={`tf-${id}`}
        value={location}
        fullWidth
      />
      <IconButton touch onClick={() => onRemove && onRemove(id)}>
        <FontIcon className="material-icons" color={red500}>clear</FontIcon>
      </IconButton>
    </div>
  );
}

MarkerLocation.propTypes = {
  id: React.PropTypes.string,
  location: React.PropTypes.object,
  onRemove: React.PropTypes.func,
};
