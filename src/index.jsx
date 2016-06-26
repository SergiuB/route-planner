import React from 'react';
import ReactDOM from 'react-dom';
import './assets/stylesheets/style';
import 'bootstrap-grid';
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

class GoogleMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      markerLocations: [],
      map: null,
    };
  }
  componentDidMount() {
    const { center, zoom } = this.props;
    const map = new google.maps.Map(this.mapEl, { center, zoom });
    map.addListener('click', e => {
      const markerLocations = [e.latLng, ...this.state.markerLocations];
      this.setState({ markerLocations });
    });
    map.addListener('dblclick', e => {
      const markerLocations = [e.latLng, ...this.state.markerLocations];
      this.setState({ markerLocations });
    });
    this.map = map;
  }
  componentDidUpdate() {
    const { markerLocations } = this.state;

    clearMarkers();
    markers = markerLocations.map(location => {
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
    });
  }

  removeMarker(marker) {
    const { markerLocations } = this.state;
    const newMarkerLocations = markerLocations.filter(ml => !ml.equals(marker.getPosition()));
    this.setState({ markerLocations: newMarkerLocations });
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
};

GoogleMap.defaultProps = {
  center: { lat: -34.397, lng: 150.644 },
  zoom: 8,
};

ReactDOM.render(
  <GoogleMap />,
  document.getElementById('app')
);
