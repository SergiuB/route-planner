import React from 'react';
import ReactDOM from 'react-dom';
import './assets/stylesheets/style';
import 'bootstrap-grid';

let markers = [];

function clearMarkers() {
  markers.forEach(marker => marker.setMap(null));
  markers = [];
}

class GoogleMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      markerLocations: [],
      map: null
    };
  }
  componentDidMount(rootNode) {
    const {center, zoom} = this.props;
    const map = new google.maps.Map(this._mapEl, {center, zoom});
    map.addListener('click', e => {
      const markerLocations = [e.latLng, ...this.state.markerLocations];
      this.setState({ markerLocations });
    });
    this.setState({ map });
  }
  componentDidUpdate() {
    const { markerLocations, map } = this.state;

    clearMarkers();
    markers = markerLocations.map(location => new google.maps.Marker({position: location, map }));
  }
  render() {
    return (
      <div className='map col-lg-6' ref={mapEl => this._mapEl = mapEl}></div>
    );
  }
}

GoogleMap.defaultProps = {
  center: {lat: -34.397, lng: 150.644},
  zoom: 8
};

ReactDOM.render(
  <GoogleMap></GoogleMap>,
  document.getElementById('app')
);
