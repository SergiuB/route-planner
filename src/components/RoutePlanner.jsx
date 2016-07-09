import React, { Component } from 'react';
import LinearProgress from 'material-ui/LinearProgress';
import uuid from 'node-uuid';
import _ from 'lodash';
import debounce from 'es6-promise-debounce';

import Map from './Map';
import MarkerLocation from './MarkerLocation';
import SegmentDots from './SegmentDots';

import { getDirections } from '../api/directions';
import { geocodeLocation } from '../api/googleMap';

export default class RoutePlanner extends Component {

  constructor(props) {
    super(props);
    this.state = {
      markers: [],
      segments: [],
      showProgressBar: false,
    };
    this.handleMapClick = this.executeWithProgress(this.handleMapClick);
    this.removeMarker = this.executeWithProgress(this.removeMarker);
    this.handleMarkerDragEnd = this.executeWithProgress(this.handleMarkerDragEnd);

    this.getPath = this.getPath.bind(this);
  }

  executeWithProgress(fn) {
    return async (...params) => {
      this.setState({ showProgressBar: true });
      try {
        await fn.apply(this, params);
      } finally {
        this.setState({ showProgressBar: false });
      }
    }
  }

  async getPath(markers) {
    const points = markers.map(
      ({ location }) => [location.lat, location.lng]
    );
    const segmentPaths = await this.props.api.getDirections(points);
    const segments = segmentPaths.map((path, idx) => ({
      startMarkerId: markers[idx].id,
      endMarkerId: markers[idx+1].id,
      path
    }));
    this.setState({ segments });
  }

  updateOrAddMarker({ id, location, address }) {
    const { markers } = this.state;
    const newMarkers = markers.slice();
    const existingMarker = _.find(newMarkers, { id });
    existingMarker
      ? Object.assign(existingMarker, { location, address })
      : newMarkers.push({ id, location, address });
    this.setState({ markers: newMarkers});
  }

  async markerChange({ id, location }) {
    try {
      const address = await this.props.api.geocodeLocation({ lat: location.lat, lng: location.lng });
      this.updateOrAddMarker({ id, location, address });
    }
    catch (error) {
      this.updateOrAddMarker({ id, location });
    };
    return this.getPath(this.state.markers);
  }

  handleMapClick(location) {
    const id = uuid.v4();
    return this.markerChange({ id, location });
  }

  removeMarker(id) {
    const { markers } = this.state;
    const newMarkers = _.reject(markers, { id });
    this.setState({ markers: newMarkers});
    return this.getPath(newMarkers);
  }

  handleMarkerDragEnd(id, location) {
    return this.markerChange({ id, location });
  }

  render() {
    const { markers, segments, showProgressBar } = this.state;
    return (
      <div className="row">
        <div className="col-lg-6">
          <Map
            markers={markers}
            path={_.reduce(
                            segments,
                            (path, segment) => _.concat(path, segment.path),
                            []
                       )}
            onMapClick={this.handleMapClick}
            onMarkerDblClick={this.removeMarker}
            onMarkerDragEnd={this.handleMarkerDragEnd}
          />
        {showProgressBar && <LinearProgress mode="indeterminate" />}
        </div>
        <div className="col-lg-3">
          <div className="segment-list">
            {_.times(markers.length - 1).map(idx => (
              <SegmentDots segmentIdx={idx} segmentDistance={100} segmentElevation={500} />
            ))}
          </div>
          <div className="marker-list">
            {markers.map(({ id, location, address }) => (
              <MarkerLocation
                id={id}
                key={id}
                location={location}
                address={address}
                onRemove={this.removeMarker}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }
}

RoutePlanner.propTypes = {
  api: React.PropTypes.object,
};

RoutePlanner.defaultProps = {
  api: {
    getDirections,
    geocodeLocation,
  },
};
