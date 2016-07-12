import React from 'react';
import { createGoogleMapInstance } from '../api/googleMap';

export default class Map extends React.Component {

  componentDidMount() {
    const { center, zoom, markers, onMapClick, mapBackendFactory } = this.props;
    this.mapBackend = mapBackendFactory(this.mapEl, {
      center,
      zoom,
      listeners: {
        click: ({ latLng }) => onMapClick([latLng.lat(), latLng.lng()]),
      },
    });

    const markersWithListeners = this.appendListeners(markers);
    this.mapBackend.createMarkers(markersWithListeners);
  }

  componentWillReceiveProps(nextProps) {
    const { markers, path } = nextProps;
    const markersWithListeners = this.appendListeners(markers);
    this.mapBackend.createMarkers(markersWithListeners);
    this.mapBackend.createPolyline(path);
  }

  componentWillUnmount() {
    this.mapBackend.clearMarkers();
    this.mapBackend.removePolyline();
  }

  appendListeners(markers) {
    const { onMarkerDblClick, onMarkerDragEnd } = this.props;
    return markers.map(
      markerData => Object.assign({}, markerData, {
        listeners: {
          dblclick: () => onMarkerDblClick(markerData.id),
          dragend: ({ latLng }) => onMarkerDragEnd(
            markerData.id,
            [latLng.lat(), latLng.lng()]
          ),
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
  markers: React.PropTypes.array,
  path: React.PropTypes.array,
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
