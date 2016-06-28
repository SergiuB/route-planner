import React, { Component } from 'react';
import GoogleMap from './GoogleMap';

export default class RoutePlanner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      markerLocations: [],
    };
    this.handleMapClick = this.handleMapClick.bind(this);
    this.handleMarkerDblClick = this.handleMarkerDblClick.bind(this);
  }

  handleMapClick(location) {
    const { markerLocations } = this.state;
    const newMarkerLocations = [location, ...markerLocations];
    this.setState({ markerLocations: newMarkerLocations });
  }

  handleMarkerDblClick(location) {
    const { markerLocations } = this.state;
    const newMarkerLocations = markerLocations.filter(ml => !ml.equals(location));
    this.setState({ markerLocations: newMarkerLocations });
  }

  render() {
    const { markerLocations } = this.state;
    return (
      <div>
        <GoogleMap
          markerLocations={markerLocations}
          onMapClick={this.handleMapClick}
          onMarkerDblClick={this.handleMarkerDblClick}
        />
      </div>
    );
  }
}
