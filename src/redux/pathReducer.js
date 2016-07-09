/* eslint no-case-declarations:0 */

import uuid from 'node-uuid';
import _ from 'lodash';
import * as types from './actionConstants';


const initialState = {
  markers: [],
  segments: [],
};

export default function createPathReducer({ generateId = () => uuid.v4() } = {}) {
  return function path(state = initialState, action) {
    const { markers } = state;
    switch (action.type) {
      case types.ADD_MARKER:
        const newMarker = {
          id: generateId(),
          location: action.location,
          address: action.address,
        };
        return Object.assign({}, state, {
          markers: _.concat(markers, [newMarker]),
        });
      case types.REMOVE_MARKER:
        return Object.assign({}, state, {
          markers: _.reject(markers, ({ id }) => id === action.id),
        });
      default:
        return state;
    }
  };
}
