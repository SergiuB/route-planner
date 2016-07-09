import { expect } from 'chai';
import createPathReducer from '../pathReducer';
import * as actions from '../actions';

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

    expect(pathReducer(undefined, actions.addMarker([1, 1], 'address'))).to.deep.equal({
      markers: [{ id: 1, location: [1, 1], address: 'address' }],
      segments: [],
    });

    expect(pathReducer({
      markers: [{ id: 'othermarker' }],
      segments: [1, 2, 3],
    }, actions.addMarker([1, 1], 'address'))).to.deep.equal({
      markers: [{ id: 'othermarker' }, { id: 1, location: [1, 1], address: 'address' }],
      segments: [1, 2, 3],
    });
  });

  it('handles REMOVE_MARKER', () => {
    const pathReducer = createPathReducer();

    expect(pathReducer(undefined, actions.removeMarker(1))).to.deep.equal({
      markers: [],
      segments: [],
    });

    expect(pathReducer({
      markers: [{ id: 1 }, { id: 2 }, { id: 3 }],
      segments: [1, 2, 3],
    }, actions.removeMarker(2))).to.deep.equal({
      markers: [{ id: 1 }, { id: 3 }],
      segments: [1, 2, 3],
    });
  });

  it('handles UPDATE_MARKER_LOCATION', () => {
    const pathReducer = createPathReducer();

    const updateAction = actions.updateMarkerLocation(1, [2, 2], 'new address');

    expect(pathReducer(undefined, updateAction))
      .to.deep.equal({
        markers: [],
        segments: [],
      });

    expect(pathReducer({
      markers: [{ id: 1, location: [1, 1], address: 'address' }, { id: 2 }, { id: 3 }],
      segments: [1, 2, 3],
    }, updateAction)).to.deep.equal({
      markers: [{ id: 1, location: [2, 2], address: 'new address' }, { id: 2 }, { id: 3 }],
      segments: [1, 2, 3],
    });
  });
});
