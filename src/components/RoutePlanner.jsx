import React, { Component } from 'react';
import LinearProgress from 'material-ui/LinearProgress';
import uuid from 'node-uuid';
import _ from 'lodash';

import Map from './Map';
import MarkerLocation from './MarkerLocation';
import * as directionsApi from '../api/directions';

export default class RoutePlanner extends Component {

  constructor(props) {
    super(props);
    this.state = {
      markerList: {},
      pathPoints: [],
      showProgressBar: false,
    };
    this.addMarker = this.addMarker.bind(this);
    this.removeMarker = this.removeMarker.bind(this);
    this.getPath = _.debounce(this.getPath.bind(this), 1000);
  }

  getPath() {
    const { markerList } = this.state;
    const points = _.values(markerList).map(
      ({ location }) => [location.lat(), location.lng()]
    );
    directionsApi.getDirections(points)
      .then((result) => this.setState({ pathPoints: result, showProgressBar: false }));
  }

  addMarker(location) {
    const { markerList } = this.state;
    const id = uuid.v4();
    const newMarkerList = Object.assign({}, markerList, { [id]: { id, location } });
    this.setState({ markerList: newMarkerList, showProgressBar: true });
    this.getPath();
  }

  removeMarker(id) {
    const { markerList } = this.state;
    const newMarkerList = _.omit(markerList, id);
    this.setState({ markerList: newMarkerList, showProgressBar: true });
    this.getPath();
  }

  render() {
    const { markerList, pathPoints, showProgressBar } = this.state;
    return (
      <div className="row">
        <div className="col-lg-6">
          <Map
            markerList={_.values(markerList)}
            pathPoints={pathPoints}
            onMapClick={this.addMarker}
            onMarkerDblClick={this.removeMarker}
          />
        {showProgressBar && <LinearProgress mode="indeterminate" />}
        </div>
        <div className="col-lg-2">
          {_.values(markerList).map(({ id, location }) => (
            <MarkerLocation
              id={id}
              key={id}
              location={location}
              onRemove={this.removeMarker}
            />
          ))}
        </div>
      </div>
    );
  }
}
