/* eslint no-case-declarations:0 */

import uuid from 'node-uuid';
import _ from 'lodash';
import { ADD_MARKER } from './actionConstants';


const initialState = {
  markers: [],
  segments: [],
};

export default function createPathReducer({ generateId = () => uuid.v4() } = {}) {
  return function path(state = initialState, action) {
    switch (action.type) {
      case ADD_MARKER:
        const { markers } = state;
        const newMarker = {
          id: generateId(),
          location: action.location,
        };
        return Object.assign({}, state, {
          markers: _.concat(markers, [newMarker]),
        });
      default:
        return state;
    }
  };
}
