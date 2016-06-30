import React from 'react';
import fontawesome from 'fontawesome-markers';

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

const polylineStyle = {
  geodesic: true,
  strokeColor: 'red',
  strokeOpacity: 1.0,
  strokeWeight: 2,
};

export default class GoogleMap extends React.Component {

  constructor(props) {
    super(props);
    this.markers = [];
  }

  componentDidMount() {
    const { center, zoom, markerLocations, onMapClick } = this.props;
    this.map = new google.maps.Map(this.mapEl, { center, zoom });
    this.map.addListener('click', e => onMapClick && onMapClick(e.latLng));
    this.createMarkers(markerLocations);
  }

  componentWillReceiveProps(nextProps) {
    const { markerLocations, pathPoints } = nextProps;
    this.clearMarkers();
    this.createMarkers(markerLocations);
    this.removePolyline();
    this.createPolyline(pathPoints);
  }

  componentWillUnmount() {
    this.clearMarkers();
    this.removePolyline();
  }

  createPolyline(points) {
    const path = points.map(([lat, lng]) => ({ lat, lng }));
    this.polyline = new google.maps.Polyline(Object.assign({ path }, polylineStyle));
    this.polyline.setMap(this.map);
  }

  removePolyline() {
    if (this.polyline) {
      this.polyline.setMap(null);
      this.polyline = undefined;
    }
  }

  createMarkers(locations) {
    this.markers = locations.map(this.createMarker.bind(this));
  }

  clearMarkers() {
    for (const marker of this.markers) {
      google.maps.event.clearInstanceListeners(marker);
      marker.setMap(null);
    }
    this.markers = [];
  }

  createMarker(position) {
    const marker = new google.maps.Marker({
      position,
      map: this.map,
      icon: markerIcon,
    });
    const self = this;
    marker.addListener('dblclick', function handler() {
      self.removeMarker(this);
    });
    return marker;
  }

  removeMarker(marker) {
    const { onMarkerDblClick } = this.props;
    if (onMarkerDblClick) {
      onMarkerDblClick(marker.getPosition());
    }
  }
  render() {
    return (
      <div className="map" ref={mapEl => { this.mapEl = mapEl; }}></div>
    );
  }
}

GoogleMap.propTypes = {
  center: React.PropTypes.object,
  zoom: React.PropTypes.number,
  onMapClick: React.PropTypes.func,
  onMarkerDblClick: React.PropTypes.func,
  markerLocations: React.PropTypes.array,
  pathPoints: React.PropTypes.array,
};

GoogleMap.defaultProps = {
  center: { lat: -34.397, lng: 150.644 },
  zoom: 8,
};
