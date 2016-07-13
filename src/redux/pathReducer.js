/* eslint no-case-declarations:0 */

import uuid from 'node-uuid';
import _ from 'lodash';
import * as types from './actionConstants';


const initialState = {
  markers: [],
  segments: [],
  opsInProgress: 0,
};

export default function createPathReducer() {
  return function path(state = initialState, action) {
    const { markers, segments, opsInProgress } = state;
    let markersCopy;
    let segmentsCopy;
    switch (action.type) {

      case types.ADD_MARKER:
        const newMarker = {
          id: action.id,
          location: action.location,
          address: action.address,
        };
        return {
          ...state,
          markers: _.concat(markers, [newMarker])
                    .map(m => ({ ...m })),
        };

      case types.REMOVE_MARKER:
        return {
          ...state,
          markers: _.reject(markers, ({ id }) => id === action.id)
                    .map(m => ({ ...m })),
        };

      case types.UPDATE_MARKER:
        markersCopy = markers.map(m => ({ ...m }));
        const marker = _.find(markersCopy, ({ id }) => id === action.id);
        if (marker) {
          marker.location = action.location;
          marker.address = action.address;
        }
        return {
          ...state,
          markers: markersCopy,
        };

      case types.CHANGE_MARKER_INDEX:
        markersCopy = markers.map(m => ({ ...m }));
        const currentIndex = _.findIndex(markersCopy, ({ id }) => id === action.id);
        if (currentIndex === -1) {
          throw new Error('inexistent marker');
        }
        if (action.newIndex < 0 || action.newIndex > (markersCopy.length - 1)) {
          throw new Error('index out of bounds');
        }
        if (_.isUndefined(action.newIndex)) {
          throw new Error('invalid new index');
        }
        const markerToMove = markersCopy[currentIndex];
        markersCopy.splice(currentIndex, 1);
        markersCopy.splice(action.newIndex, 0, markerToMove);

        return {
          ...state,
          markers: markersCopy,
        };

      case types.ADD_SEGMENT:
        const { startMarkerId, endMarkerId, path } = action;
        const newSegment = {
          id: `${startMarkerId}_${endMarkerId}`,
          startMarkerId,
          endMarkerId,
          path
        };
        return {
          ...state,
          segments: _.concat(segments, [newSegment])
                    .map(m => ({ ...m })),
        };

      case types.REMOVE_SEGMENT:
        return {
          ...state,
          segments: _.reject(segments, ({ id }) => id === action.id)
                    .map(seg => ({ ...seg })),
        };

      case types.UPDATE_SEGMENT:
        segmentsCopy = segments.map(seg => ({ ...seg }));
        const segment = _.find(segmentsCopy, ({ id }) => id === action.id);
        if (segment) {
          segment.path = action.path;
        }
        return {
          ...state,
          segments: segmentsCopy,
        };

      case types.OPERATION_STARTED:
        return {
          ...state,
          opsInProgress: opsInProgress + 1,
        }

      case types.OPERATION_DONE:
        return {
          ...state,
          opsInProgress: Math.max(0, opsInProgress - 1),
        }

      default:
        return state;
    }
  };
}
