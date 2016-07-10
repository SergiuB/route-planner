import _ from 'lodash';

import * as Actions from './actionConstants'
import { geocodeLocation } from '../api/googleMap';
import { getDirections } from '../api/directions';

export function addMarkerSync(location, address) {
  return {
    type: Actions.ADD_MARKER,
    location,
    address
  }
}

export function removeMarkerSync(id) {
  return {
    type: Actions.REMOVE_MARKER,
    id,
  }
}

export function updateMarkerSync(id, location, address) {
  return {
    type: Actions.UPDATE_MARKER,
    id,
    location,
    address
  }
}

export function addMarker({ getAddressForLocation = geocodeLocation } = {}) {
  return location => async dispatch => {
    const [lat, lng] = location;
    const address = await getAddressForLocation({ lat, lng });
    dispatch(addMarkerSync(location, address));
  }
}

export function updateMarker({ getAddressForLocation = geocodeLocation } = {}) {
  return (id, location) => async dispatch => {
    const [lat, lng] = location;
    const address = await getAddressForLocation({ lat, lng });
    dispatch(updateMarkerSync(id, location, address));
  }
}

export function addSegmentSync(startMarkerId, endMarkerId, path) {
  return {
    type: Actions.ADD_SEGMENT,
    startMarkerId,
    endMarkerId,
    path
  }
}

export function removeSegmentSync(id) {
  return {
    type: Actions.REMOVE_SEGMENT,
    id,
  }
}

export function updateSegmentSync(id, path) {
  return {
    type: Actions.UPDATE_SEGMENT,
    id,
    path
  }
}

export function addSegment({ getPath = getDirections } = {}) {
  return (startMarkerId, endMarkerId) => async (dispatch, getState) => {
    const { markers } = getState();
    const startMarker = _.find(markers, ({ id }) => id === startMarkerId);
    const endMarker = _.find(markers, ({ id }) => id === endMarkerId);
    const path = await getPath([ startMarker.location, endMarker.location ]);
    dispatch(addSegmentSync(startMarkerId, endMarkerId, path));
  }
}

export function updateSegment({ getPath = getDirections } = {}) {
  return (segmentId) => async (dispatch, getState) => {
    const [startMarkerId, endMarkerId] = segmentId.split('_');
    const { markers } = getState();
    const startMarker = _.find(markers, ({ id }) => id === startMarkerId);
    const endMarker = _.find(markers, ({ id }) => id === endMarkerId);
    const path = await getPath([ startMarker.location, endMarker.location ]);
    dispatch(updateSegmentSync(segmentId, path));
  }
}

export function operationStarted() {
  return {
    type: Actions.OPERATION_STARTED
  }
}

export function operationDone() {
  return {
    type: Actions.OPERATION_DONE
  }
}
