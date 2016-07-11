import React, { Component } from 'react';
import LinearProgress from 'material-ui/LinearProgress';
import uuid from 'node-uuid';
import _ from 'lodash';

import Map from './Map';
import MarkerLocation from './MarkerLocation';
import SegmentDots from './SegmentDots';

export default class RoutePlanner extends Component {
  constructor(props) {
    super(props);
    this.handleMapClick = this.handleMapClick.bind(this);
    this.removeMarker = this.removeMarker.bind(this);
    this.handleMarkerDragEnd = this.handleMarkerDragEnd.bind(this);
  }

  async handleMapClick(location) {
    const { markers, dispatch, actions, generateId } = this.props;
    const id = generateId();
    const previousMarker = _.last(markers);
    await dispatch(actions.addMarker(id, location));
    if (previousMarker) {
      dispatch(actions.addSegment(previousMarker.id, id));
    }
  }

  async removeMarker(id) {
    const { markers, dispatch, actions } = this.props;

    const index = _.findIndex(markers, { id });
    const markerBefore = markers[index - 1];
    const markerAfter = markers[index + 1];

    dispatch(actions.removeMarker(id));

    if (markerBefore) {
      dispatch(actions.removeSegment(`${markerBefore.id}_${id}`));
    }

    if (markerAfter) {
      dispatch(actions.removeSegment(`${id}_${markerAfter.id}`));
    }

    if (markerBefore && markerAfter) {
      await dispatch(actions.addSegment(markerBefore.id, markerAfter.id));
    }
  }

  handleMarkerDragEnd(id, location) {
    const { markers, dispatch, actions } = this.props;
    dispatch(updateMarker(id, location));
  }

  render() {
    const { markers, segments, opsInProgress } = this.props;
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
        {opsInProgress && <LinearProgress mode="indeterminate" />}
        </div>
        <div className="col-lg-3">
          <div className="segment-list">
            {segments.map(({ id }, index) => (
              <SegmentDots
                id={id} key={id}
                segmentIdx={index} segmentDistance={100} segmentElevation={500}
              />
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
  markers: React.PropTypes.array,
  segments: React.PropTypes.array,
  opsInProgress: React.PropTypes.number,
  dispatch: React.PropTypes.func,
  actions: React.PropTypes.object,
  generateId: React.PropTypes.func,
};

RoutePlanner.defaultProps = {
  markers: [],
  segments: [],
  opsInProgress: 0,
};
