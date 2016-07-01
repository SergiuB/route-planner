import React, { Component } from 'react';
import TextField from 'material-ui/TextField';

import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import LinearProgress from 'material-ui/LinearProgress';
import { red500, grey500 } from 'material-ui/styles/colors';
import uuid from 'node-uuid';
import _ from 'lodash';

import GoogleMap from './GoogleMap';
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
          <GoogleMap
            markerList={_.values(markerList)}
            pathPoints={pathPoints}
            onMapClick={this.addMarker}
            onMarkerDblClick={this.removeMarker}
          />
        {showProgressBar && <LinearProgress mode="indeterminate" />}
        </div>
        <div className="col-lg-3">
          {_.values(markerList).map(({ id, location }) => (
            <div
              className="marker-location"
              key={id}
            >
              <FontIcon
                className="drag-handle material-icons"
                color={grey500}
              >
                drag_handle
              </FontIcon>
              <TextField
                style={{
                  fontSize: 12,
                }}
                id={`tf-${id}`}
                value={location}
                fullWidth
              />
              <IconButton touch onClick={() => this.removeMarker(id)}>
                <FontIcon className="material-icons" color={red500}>clear</FontIcon>
              </IconButton>
            </div>
          ))}
        </div>
        <div className="col-lg-1">
          <FlatButton
            label="Directions"
            primary
            onClick={this.getPath}
          />
        </div>
      </div>
    );
  }
}
