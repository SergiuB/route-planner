import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { expect } from 'chai';
import createPathReducer from '../pathReducer';
import * as actions from '../actions';
import * as types from '../actionConstants';

const mockStore = configureMockStore([thunk]);

describe('addMarkerWithResolvedAddress', () => {
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

describe('updateMarkerWithResolvedAddress', () => {
  it('creates UPDATE_MARKER_LOCATION when marker address has been resolved', async () => {
    const expectedActions = [
      { type: types.UPDATE_MARKER_LOCATION, id: 1, location: [2, 2], address: 'new address' },
    ];
    const store = mockStore({ markers: [], segments: [] });

    const updateMarker = actions.updateMarkerWithResolvedAddress({
      getAddressForLocation: () => Promise.resolve('new address')
    })

    await store.dispatch(updateMarker(1, [2, 2]));
    expect(store.getActions()).to.deep.equal(expectedActions);
  });
});
