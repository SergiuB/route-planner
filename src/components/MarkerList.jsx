import React from 'react';
import MarkerLocation from './MarkerLocation';

export default class MarkerList extends React.Component {
  render() {
    const { markers, onMarkerRemove } = this.props;
    return (
      <div className="marker-list">
        {markers.map(({ id, location, address }) => (
          <MarkerLocation
            id={id}
            key={id}
            location={location}
            address={address}
            onRemove={onMarkerRemove}
          />
        ))}
      </div>
    );
  }
}

MarkerList.propTypes = {
  markers: React.PropTypes.array.isRequired,
  onMarkerChangeIndex: React.PropTypes.func,
  onMarkerRemove: React.PropTypes.func,
};

MarkerList.defaultProps = {
  onMarkerChangeIndex: () => {},
  onMarkerRemove: () => {},
};
