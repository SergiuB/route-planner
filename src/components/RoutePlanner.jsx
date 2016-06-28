import React, { Component } from 'react'
import GoogleMap from './GoogleMap';

export default class RoutePlanner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      markerLocations: [],
    };
  }

  handleMarkerAdded(location) {
    const { markerLocations } = this.state;
    const newMarkerLocations = [location, ...markerLocations];
    this.setState({ markerLocations: newMarkerLocations });
  }

  handleMarkerRemoved(location) {
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
          onMarkerAdded={this.handleMarkerAdded.bind(this)}
          onMarkerRemoved={this.handleMarkerRemoved.bind(this)}
        />
      </div>
    );
  }
}
