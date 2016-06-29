import React, { Component } from 'react';
import TextField from 'material-ui/TextField';

import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import { red500 } from 'material-ui/styles/colors';

import GoogleMap from './GoogleMap';

export default class RoutePlanner extends Component {

  constructor(props) {
    super(props);
    this.state = {
      markerLocations: [],
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
    const { markerLocations } = this.state;
    return (
      <div className="row">
        <div className="col-lg-6">
          <GoogleMap
            markerLocations={markerLocations}
            onMapClick={this.addMarker}
            onMarkerDblClick={this.removeMarker}
          />
        </div>
        <div className="col-lg-4">
          {markerLocations.map(location => (
            <div className="marker-location" key={location}>
              <TextField
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
      </div>
    );
  }
}
