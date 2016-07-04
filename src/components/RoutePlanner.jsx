import React, { Component } from 'react';
import LinearProgress from 'material-ui/LinearProgress';
import uuid from 'node-uuid';
import _ from 'lodash';

import Map from './Map';
import MarkerLocation from './MarkerLocation';
import * as directionsApi from '../api/directions';
import { geocodeLocation } from '../api/googleMap';

export default class RoutePlanner extends Component {

  constructor(props) {
    super(props);
    this.state = {
      markerList: {},
      pathPoints: [],
      showProgressBar: false,
    };
    this.handleMapClick = this.handleMapClick.bind(this);
    this.removeMarker = this.removeMarker.bind(this);
    this.handleMarkerDragEnd = this.handleMarkerDragEnd.bind(this);
    this.getPath = _.debounce(this.getPath.bind(this), 1000);
  }

  getPath() {
    const { markerList } = this.state;
    const points = _.values(markerList).map(
      ({ location }) => [location.lat, location.lng]
    );
    directionsApi.getDirections(points)
      .then((result) => this.setState({ pathPoints: result, showProgressBar: false }));
  }

  updateOrAddMarker({ id, location, address }) {
    const { markerList } = this.state;
    const newMarkerList = Object.assign({}, markerList, { [id]: { id, location, address } });
    this.setState({ markerList: newMarkerList, showProgressBar: true });
  }

  markerChange({ id, location }) {
    geocodeLocation({ lat: location.lat, lng: location.lng })
      .then(address => {
        this.updateOrAddMarker({ id, location, address });
      })
      .catch(() => {
        this.updateOrAddMarker({ id, location });
      });
    this.getPath();
  }

  handleMapClick(location) {
    const id = uuid.v4();
    this.markerChange({ id, location });
  }

  removeMarker(id) {
    const { markerList } = this.state;
    const newMarkerList = _.omit(markerList, id);
    this.setState({ markerList: newMarkerList, showProgressBar: true });
    this.getPath();
  }

  handleMarkerDragEnd(id, location) {
    this.markerChange({ id, location });
  }

  render() {
    const { markerList, pathPoints, showProgressBar } = this.state;
    return (
      <div className="row">
        <div className="col-lg-6">
          <Map
            markerList={_.values(markerList)}
            pathPoints={pathPoints}
            onMapClick={this.handleMapClick}
            onMarkerDblClick={this.removeMarker}
            onMarkerDragEnd={this.handleMarkerDragEnd}
          />
        {showProgressBar && <LinearProgress mode="indeterminate" />}
        </div>
        <div className="col-lg-3">
          {_.values(markerList).map(({ id, location, address }) => (
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
