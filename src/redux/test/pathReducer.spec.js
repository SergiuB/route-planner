import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { expect } from 'chai';
import createPathReducer from '../pathReducer';
import * as actions from '../actions';
import * as types from '../actionConstants';

const mockStore = configureMockStore([thunk]);

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

  it('creates ADD_MARKER when marker address has been resolved', async () => {
    const expectedActions = [
      { type: types.ADD_MARKER, location: [1, 1], address: 'address' },
    ];
    const store = mockStore({ markers: [], segments: [] });

    const addMarker = actions.addMarkerWithResolvedAddress({
      getAddressForLocation: () => Promise.resolve('address')
    })

    await store.dispatch(addMarker([1, 1]));
    expect(store.getActions()).to.deep.equal(expectedActions);
  });
});
