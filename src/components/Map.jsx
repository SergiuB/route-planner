import React from 'react';
import { createGoogleMapInstance } from '../api/googleMap';

export default class Map extends React.Component {

  constructor(props) {
    super(props);
    this.markers = [];
  }

  componentDidMount() {
    const { center, zoom, markerList, onMapClick, mapBackendFactory } = this.props;
    this.mapBackend = mapBackendFactory(this.mapEl, {
      center,
      zoom,
      listeners: {
        click: e => onMapClick(e.latLng),
      },
    });

    const markersWithListeners = this.appendListeners(markerList);
    this.mapBackend.createMarkers(markersWithListeners);
  }

  componentWillReceiveProps(nextProps) {
    const { markerList, pathPoints } = nextProps;
    const markersWithListeners = this.appendListeners(markerList);
    const path = pathPoints.map(([lat, lng]) => ({ lat, lng }));
    this.mapBackend.createMarkers(markersWithListeners);
    this.mapBackend.createPolyline(path);
  }

  componentWillUnmount() {
    this.mapBackend.clearMarkers();
    this.mapBackend.removePolyline();
  }

  appendListeners(markerList) {
    const { onMarkerDblClick, onMarkerDragEnd } = this.props;
    return markerList.map(
      markerData => Object.assign({}, markerData, {
        listeners: {
          dblclick: () => onMarkerDblClick(markerData.id),
          dragend: (e) => onMarkerDragEnd(markerData.id, e.latLng),
        },
      }));
  }

  render() {
    return (
      <div className="map" ref={mapEl => { this.mapEl = mapEl; }}></div>
    );
  }
}

Map.propTypes = {
  center: React.PropTypes.object,
  zoom: React.PropTypes.number,
  onMapClick: React.PropTypes.func,
  onMarkerDblClick: React.PropTypes.func,
  onMarkerDragEnd: React.PropTypes.func,
  markerList: React.PropTypes.array,
  pathPoints: React.PropTypes.array,
  mapBackendFactory: React.PropTypes.func,
};

Map.defaultProps = {
  center: { lat: -34.397, lng: 150.644 },
  zoom: 8,
  onMapClick: () => {},
  onMarkerDblClick: () => {},
  onMarkerDragEnd: () => {},
  mapBackendFactory: createGoogleMapInstance,
};
