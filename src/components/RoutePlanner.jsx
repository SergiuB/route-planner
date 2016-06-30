import React, { Component } from 'react';
import TextField from 'material-ui/TextField';

import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import { red500 } from 'material-ui/styles/colors';
import qs from 'qs';

import GoogleMap from './GoogleMap';

export default class RoutePlanner extends Component {

  constructor(props) {
    super(props);
    this.state = {
      markerLocations: [],
      pathPoints: [],
    };
    this.addMarker = this.addMarker.bind(this);
    this.removeMarker = this.removeMarker.bind(this);
  }

  addMarker(location) {
    const { markerLocations } = this.state;
    const newMarkerLocations = [location, ...markerLocations];
    this.setState({ markerLocations: newMarkerLocations });
  }

  removeMarker(location) {
    const { markerLocations } = this.state;
    const newMarkerLocations = markerLocations.filter(ml => !ml.equals(location));
    this.setState({ markerLocations: newMarkerLocations });
  }

  render() {
    const { markerLocations, pathPoints } = this.state;
    return (
      <div className="row">
        <div className="col-lg-6">
          <GoogleMap
            markerLocations={markerLocations}
            pathPoints={pathPoints}
            onMapClick={this.addMarker}
            onMarkerDblClick={this.removeMarker}
          />
        </div>
        <div className="col-lg-3">
          {markerLocations.map(location => (
            <div className="marker-location" key={location}>
              <TextField
                style={{
                  fontSize: 12,
                }}
                id={`tf-${location}`}
                value={location}
                fullWidth
              />
              <IconButton touch onClick={() => this.removeMarker(location)}>
                <FontIcon className="material-icons" color={red500}>clear</FontIcon>
              </IconButton>
            </div>
          ))}
        </div>
        <div className="col-lg-1">
          <FlatButton
            label="Directions"
            primary
            onClick={() => {
              const query = qs.stringify(markerLocations.map((item) => [item.lat(), item.lng()]));
              fetch(`/api/directions?${query}`, {
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                },
              }).then((response) => response.json())
                .then((pathPoints) => this.setState({ pathPoints }));
            }}
          />
        </div>
      </div>
    );
  }
}
