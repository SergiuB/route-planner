import _ from 'lodash';

import * as Actions from './actionConstants'
import { geocodeLocation } from '../api/googleMap';
import { getDirections } from '../api/directions';

export default function createActions({
  getAddressForLocation = geocodeLocation,
  getPath = getDirections
} = {}) {

  function addMarkerSync(id, location, address) {
    return {
      type: Actions.ADD_MARKER,
      id,
      location,
      address
    }
  }

  function removeMarker(id) {
    return {
      type: Actions.REMOVE_MARKER,
      id,
    }
  }

  function updateMarkerSync(id, location, address) {
    return {
      type: Actions.UPDATE_MARKER,
      id,
      location,
      address
    }
  }

  function changeMarkerIndex(id, newIndex) {
    return {
      type: Actions.CHANGE_MARKER_INDEX,
      id,
      newIndex,
    }
  }

  function addMarker(id, location) {
    return dispatch => {
      dispatch(operationStarted());
      const [lat, lng] = location;
      return getAddressForLocation({ lat, lng })
        .then(address => dispatch(addMarkerSync(id, location, address)))
        .then(() => dispatch(operationDone()))
        .catch(() => dispatch(operationDone()));
    }
  }

  function updateMarker(id, location) {
    return async dispatch => {
      dispatch(operationStarted());
      const [lat, lng] = location;
      try {
        const address = await getAddressForLocation({ lat, lng });
        dispatch(updateMarkerSync(id, location, address));
      } finally {
        dispatch(operationDone());
      }
    }
  }

  function addSegmentSync(startMarkerId, endMarkerId, path) {
    return {
      type: Actions.ADD_SEGMENT,
      startMarkerId,
      endMarkerId,
      path
    }
  }

  function removeSegment(id) {
    return {
      type: Actions.REMOVE_SEGMENT,
      id,
    }
  }

  function updateSegmentSync(id, path) {
    return {
      type: Actions.UPDATE_SEGMENT,
      id,
      path
    }
  }

  function addSegment(startMarkerId, endMarkerId) {
    return async (dispatch, getState) => {
      dispatch(operationStarted());
      const { markers } = getState();
      const startMarker = _.find(markers, ({ id }) => id === startMarkerId);
      const endMarker = _.find(markers, ({ id }) => id === endMarkerId);
      try {
        const path = await getPath([ startMarker.location, endMarker.location ]);
        dispatch(addSegmentSync(startMarkerId, endMarkerId, path[0]));
      } finally {
        dispatch(operationDone());
      }
    }
  }

  function updateSegment(segmentId) {
    return async (dispatch, getState) => {
      dispatch(operationStarted());
      const [startMarkerId, endMarkerId] = segmentId.split('_');
      const { markers } = getState();
      const startMarker = _.find(markers, ({ id }) => id === startMarkerId);
      const endMarker = _.find(markers, ({ id }) => id === endMarkerId);
      try {
        const path = await getPath([ startMarker.location, endMarker.location ]);
        dispatch(updateSegmentSync(segmentId, path[0]));
      } finally {
        dispatch(operationDone());
      }
    }
  }

  function operationStarted() {
    return {
      type: Actions.OPERATION_STARTED
    }
  }

  function operationDone() {
    return {
      type: Actions.OPERATION_DONE
    }
  }

  return {
    addMarkerSync,
    removeMarker,
    updateMarkerSync,
    addMarker,
    updateMarker,
    changeMarkerIndex,
    addSegmentSync,
    removeSegment,
    updateSegmentSync,
    addSegment,
    updateSegment,
    operationStarted,
    operationDone
  }
}
