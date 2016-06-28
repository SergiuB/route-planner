import React from 'react';
import fontawesome from 'fontawesome-markers';

let markers = [];

function clearMarkers() {
  markers.forEach(marker => {
    google.maps.event.clearInstanceListeners(marker);
    marker.setMap(null);
  });
  markers = [];
}

const markerIcon = {
  path: fontawesome.DOT_CIRCLE_O,
  scale: 0.2,
  strokeWeight: 0.2,
  strokeColor: 'black',
  strokeOpacity: 1,
  fillColor: 'red',
  fillOpacity: 1,
  anchor: new google.maps.Point(22, -12),
};

export default class GoogleMap extends React.Component {
  componentDidMount() {
    const { center, zoom, markerLocations, onMarkerAdded } = this.props;
    this.map = new google.maps.Map(this.mapEl, { center, zoom });
    this.map.addListener('click', e => onMarkerAdded && onMarkerAdded(e.latLng));
    this.createMarkers(markerLocations);
  }

  componentWillReceiveProps(nextProps) {
    const { markerLocations } = nextProps;
    this.createMarkers(markerLocations);
  }

  createMarkers(locations) {
    clearMarkers();
    markers = locations.map(this.createMarker.bind(this));
  }

  createMarker(location) {
    const marker = new google.maps.Marker({
      position: location,
      map: this.map,
      icon: markerIcon,
    });
    marker.addListener('dblclick', e => {
      for (const other of markers) {
        if (e.latLng.equals(other.getPosition())) {
          this.removeMarker(other);
          break;
        }
      }
    });
    return marker;
  }

  removeMarker(marker) {
    const { onMarkerRemoved } = this.props;
    if (onMarkerRemoved) {
      onMarkerRemoved(marker.getPosition());
    }
  }
  render() {
    return (
      <div className="map col-lg-6" ref={mapEl => { this.mapEl = mapEl; }}></div>
    );
  }
}

GoogleMap.propTypes = {
  center: React.PropTypes.object,
  zoom: React.PropTypes.number,
  onMarkerAdded: React.PropTypes.func,
  onMarkerRemoved: React.PropTypes.func,
  markerLocations: React.PropTypes.array,
};

GoogleMap.defaultProps = {
  center: { lat: -34.397, lng: 150.644 },
  zoom: 8,
};
