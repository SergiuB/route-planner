import React, { Component } from 'react';
import LinearProgress from 'material-ui/LinearProgress';
import uuid from 'node-uuid';
import _ from 'lodash';
import { connect } from 'react-redux';

import Map from './Map';
import MarkerList from './MarkerList';
import SegmentDots from './SegmentDots';
import createActions from '../redux/actions';

export class RoutePlanner extends Component {
  constructor(props) {
    super(props);
    this.handleMapClick = this.handleMapClick.bind(this);
    this.removeMarker = this.removeMarker.bind(this);
    this.handleMarkerDragEnd = this.handleMarkerDragEnd.bind(this);
    this.handleMarkerIndexChange = this.handleMarkerIndexChange.bind(this);
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

  async handleMarkerDragEnd(id, location) {
    const { markers, dispatch, actions } = this.props;

    const index = _.findIndex(markers, { id });
    const markerBefore = markers[index - 1];
    const markerAfter = markers[index + 1];

    await dispatch(actions.updateMarker(id, location));

    const segmentUpdates = [];
    if (markerBefore) {
      segmentUpdates.push(dispatch(actions.updateSegment(`${markerBefore.id}_${id}`)));
    }

    if (markerAfter) {
      segmentUpdates.push(dispatch(actions.updateSegment(`${id}_${markerAfter.id}`)));
    }
    return Promise.all(segmentUpdates);
  }

  async handleMarkerIndexChange(id, newIndex) {
    const { markers, dispatch, actions } = this.props;

    const oldIndex = _.findIndex(markers, { id });
    const markerBeforeOld = markers[oldIndex - 1];
    const markerAfterOld = markers[oldIndex + 1];

    dispatch(actions.changeMarkerIndex(id, newIndex));

    const markerBefore = markers[newIndex - 1];
    // this is not a mistake, the marker after is the marker at newIndex, because
    // the markers array was not changed the changeMarkerIndex
    const markerAfter = markers[newIndex];

    const segmentAdditions = [];
    if (markerBeforeOld) {
      dispatch(actions.removeSegment(`${markerBeforeOld.id}_${id}`));
    }
    if (markerAfterOld) {
      dispatch(actions.removeSegment(`${id}_${markerAfterOld.id}`));
    }
    if (markerBefore && markerAfter){
      dispatch(actions.removeSegment(`${markerBefore.id}_${markerAfter.id}`));
    }
    if (markerBeforeOld && markerAfterOld){
      segmentAdditions.push(dispatch(actions.addSegment(markerBeforeOld.id, markerAfterOld.id)));
    }
    if (markerBefore) {
      segmentAdditions.push(dispatch(actions.addSegment(markerBefore.id, id)));
    }
    if (markerAfter) {
      segmentAdditions.push(dispatch(actions.addSegment(id, markerAfter.id)));
    }
    return Promise.all(segmentAdditions);
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
        {!!opsInProgress && <LinearProgress mode="indeterminate" />}
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
          <MarkerList
            markers={markers}
            onMarkerRemove={this.removeMarker}
            onMarkerChangeIndex={this.handleMarkerIndexChange}
          />
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
  generateId: uuid.v4,
  actions: createActions(),
};

const mapStateToProps = (state) => {
  return {
    markers: state.markers,
    segments: state.segments,
    opsInProgress: state.opsInProgress,
  }
}

export default connect(mapStateToProps)(RoutePlanner)
