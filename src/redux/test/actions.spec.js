import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { expect } from 'chai';
import createPathReducer from '../pathReducer';
import * as actions from '../actions';
import * as types from '../actionConstants';

const mockStore = configureMockStore([thunk]);

describe('addMarker', () => {
  it('creates ADD_MARKER when marker address has been resolved', async () => {
    const expectedActions = [
      { type: types.ADD_MARKER, location: [1, 1], address: 'address' },
    ];
    const store = mockStore({ markers: [], segments: [] });

    const addMarker = actions.addMarker({
      getAddressForLocation: () => Promise.resolve('address')
    })

    await store.dispatch(addMarker([1, 1]));
    expect(store.getActions()).to.deep.equal(expectedActions);
  });
});

describe('updateMarker', () => {
  it('creates UPDATE_MARKER when marker address has been resolved', async () => {
    const expectedActions = [
      { type: types.UPDATE_MARKER, id: 1, location: [2, 2], address: 'new address' },
    ];
    const store = mockStore({ markers: [], segments: [] });

    const updateMarker = actions.updateMarker({
      getAddressForLocation: () => Promise.resolve('new address')
    })

    await store.dispatch(updateMarker(1, [2, 2]));
    expect(store.getActions()).to.deep.equal(expectedActions);
  });
});

describe('addSegment', () => {
  it('creates ADD_SEGMENT when segment path has been determined', async () => {
    const expectedActions = [
      { type: types.ADD_SEGMENT, startMarkerId: 1, endMarkerId: 2, path: [[1, 1], [2, 2]] },
    ];
    const store = mockStore({ markers: [{ id: 1, location: [1, 1] }, { id: 2, location: [2, 2]}], segments: [] });

    const addSegment = actions.addSegment({
      getPath: ([a, b]) => Promise.resolve([a, b])
    })

    await store.dispatch(addSegment(1, 2));
    expect(store.getActions()).to.deep.equal(expectedActions);
  });
});

describe('updateSegment', () => {
  it('creates UPDATE_SEGMENT when segment path has been determined', async () => {
    const expectedActions = [
      { type: types.UPDATE_SEGMENT, id: '1_2', path: [[1, 1], [3, 3]] },
    ];
    const store = mockStore({
      markers: [{ id: '1', location: [1, 1] }, { id: '2', location: [3, 3]}],
      segments: [{ id: '1_2', startMarkerId: '1', endMarkerId: '2', path: [[1, 1], [2, 2]] }]
    });

    const updateSegment = actions.updateSegment({
      getPath: ([a, b]) => Promise.resolve([a, b])
    })

    await store.dispatch(updateSegment('1_2'));
    expect(store.getActions()).to.deep.equal(expectedActions);
  });
});
