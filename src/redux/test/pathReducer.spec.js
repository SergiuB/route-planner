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

    expect(pathReducer(undefined, actions.addMarkerSync([1, 1], 'address'))).to.deep.equal({
      markers: [{ id: 1, location: [1, 1], address: 'address' }],
      segments: [],
    });

    expect(pathReducer({
      markers: [{ id: 'othermarker' }],
      segments: [1, 2, 3],
    }, actions.addMarkerSync([1, 1], 'address'))).to.deep.equal({
      markers: [{ id: 'othermarker' }, { id: 1, location: [1, 1], address: 'address' }],
      segments: [1, 2, 3],
    });
  });

  it('handles REMOVE_MARKER', () => {
    const pathReducer = createPathReducer();

    expect(pathReducer(undefined, actions.removeMarkerSync(1))).to.deep.equal({
      markers: [],
      segments: [],
    });

    expect(pathReducer({
      markers: [{ id: 1 }, { id: 2 }, { id: 3 }],
      segments: [1, 2, 3],
    }, actions.removeMarkerSync(2))).to.deep.equal({
      markers: [{ id: 1 }, { id: 3 }],
      segments: [1, 2, 3],
    });
  });

  it('handles UPDATE_MARKER', () => {
    const pathReducer = createPathReducer();

    const updateAction = actions.updateMarkerSync(1, [2, 2], 'new address');

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

  it('handles ADD_SEGMENT', () => {
    const pathReducer = createPathReducer();

    const addSegmentAction = actions.addSegmentSync(1, 2, [[1, 1], [2, 2]]);

    expect(pathReducer(undefined, addSegmentAction))
      .to.deep.equal({
        markers: [],
        segments: [{
          id: '1_2',
          startMarkerId: 1,
          endMarkerId: 2,
          path: [[1, 1], [2, 2]],
        }],
      });

    expect(pathReducer({
      markers: [1, 2],
      segments: [{ id: 1 }, { id: 2 }, { id: 3 }],
    }, addSegmentAction)).to.deep.equal({
      markers: [1, 2],
      segments: [{ id: 1 }, { id: 2 }, { id: 3 }, {
        id: '1_2',
        startMarkerId: 1,
        endMarkerId: 2,
        path: [[1, 1], [2, 2]],
      }],
    });
  });

  it('handles REMOVE_SEGMENT', () => {
    const pathReducer = createPathReducer();

    const removeSegmentAction = actions.removeSegmentSync(2);

    expect(pathReducer(undefined, removeSegmentAction))
      .to.deep.equal({
        markers: [],
        segments: [],
      });

    expect(pathReducer({
      markers: [1, 2],
      segments: [{ id: 1 }, { id: 2 }, { id: 3 }],
    }, removeSegmentAction)).to.deep.equal({
      markers: [1, 2],
      segments: [{ id: 1 }, { id: 3 }],
    });
  });

  it('handles UPDATE_SEGMENT', () => {
    const pathReducer = createPathReducer();

    const updateSegmentAction = actions.updateSegmentSync(2, [[1, 1], [2, 2]]);

    expect(pathReducer(undefined, updateSegmentAction))
      .to.deep.equal({
        markers: [],
        segments: [],
      });

    expect(pathReducer({
      markers: [1, 2],
      segments: [{ id: 1 }, { id: 2 }, { id: 3 }],
    }, updateSegmentAction)).to.deep.equal({
      markers: [1, 2],
      segments: [{ id: 1 }, { id: 2, path: [[1, 1], [2, 2]] }, { id: 3 }],
    });
  });
});
