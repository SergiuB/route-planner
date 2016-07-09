import { expect } from 'chai';
import createPathReducer from '../pathReducer';
import * as actions from '../actionConstants';

describe('path reducer', () => {
  it('returns the initial state', () => {
    const pathReducer = createPathReducer();
    expect(pathReducer(undefined, {})).to.deep.equal({
      markers: [],
      segments: [],
    });
  });

  it('handles ADD_MARKER', () => {
    const pathReducer = createPathReducer({
      generateId: () => 1,
    });

    expect(pathReducer(undefined, {
      type: actions.ADD_MARKER,
      location: [1, 1],
    })).to.deep.equal({
      markers: [{ id: 1, location: [1, 1] }],
      segments: [],
    });

    expect(pathReducer({
      markers: [{ id: 'othermarker' }],
      segments: [1, 2, 3],
    }, {
      type: actions.ADD_MARKER,
      location: [1, 1],
    })).to.deep.equal({
      markers: [{ id: 'othermarker' }, { id: 1, location: [1, 1] }],
      segments: [1, 2, 3],
    });
  });
});
