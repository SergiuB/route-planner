import React, { Component } from 'react';
import LinearProgress from 'material-ui/LinearProgress';
import uuid from 'node-uuid';
import _ from 'lodash';
import debounce from 'es6-promise-debounce';

import Map from './Map';
import MarkerLocation from './MarkerLocation';
import { getDirections } from '../api/directions';
import { geocodeLocation } from '../api/googleMap';

export default class RoutePlanner extends Component {

  constructor(props) {
    super(props);
    this.state = {
      markers: {},
      pathPoints: [],
      showProgressBar: false,
    };
    this.handleMapClick = this.executeWithProgress(this.handleMapClick);
    this.removeMarker = this.executeWithProgress(this.removeMarker);
    this.handleMarkerDragEnd = this.executeWithProgress(this.handleMarkerDragEnd);

    this.getPath = debounce(this.getPath.bind(this), this.props.debounceTime);
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

  async getPath() {
    const { markers } = this.state;
    const points = _.values(markers).map(
      ({ location }) => [location.lat, location.lng]
    );
    const pathPoints = await this.props.api.getDirections(points);
    this.setState({ pathPoints});
  }

  updateOrAddMarker({ id, location, address }) {
    const { markers } = this.state;
    const newMarkerList = Object.assign({}, markers, { [id]: { id, location, address } });
    this.setState({ markers: newMarkerList});
  }

  async markerChange({ id, location }) {
    try {
      const address = await this.props.api.geocodeLocation({ lat: location.lat, lng: location.lng });
      this.updateOrAddMarker({ id, location, address });
    }
    catch (error) {
      this.updateOrAddMarker({ id, location });
    };
    return this.getPath();
  }

  handleMapClick(location) {
    const id = uuid.v4();
    return this.markerChange({ id, location });
  }

  removeMarker(id) {
    const { markers } = this.state;
    const newMarkerList = _.omit(markers, id);
    this.setState({ markers: newMarkerList});
    return this.getPath();
  }

  handleMarkerDragEnd(id, location) {
    return this.markerChange({ id, location });
  }

  render() {
    const { markers, pathPoints, showProgressBar } = this.state;
    return (
      <div className="row">
        <div className="col-lg-6">
          <Map
            markerList={_.values(markers)}
            pathPoints={pathPoints}
            onMapClick={this.handleMapClick}
            onMarkerDblClick={this.removeMarker}
            onMarkerDragEnd={this.handleMarkerDragEnd}
          />
        {showProgressBar && <LinearProgress mode="indeterminate" />}
        </div>
        <div className="col-lg-3">
          {_.values(markers).map(({ id, location, address }) => (
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
    );
  }
}

RoutePlanner.propTypes = {
  api: React.PropTypes.object,
  debounceTime: React.PropTypes.number,
};

RoutePlanner.defaultProps = {
  api: {
    getDirections,
    geocodeLocation,
  },
  debounceTime: 1000
};
