import { expect } from 'chai';
import createPathReducer from '../pathReducer';
import * as actions from '../actions';

describe('path reducer', () => {
  it('returns the initial state', () => {
    const pathReducer = createPathReducer();
    expect(pathReducer(undefined, {})).to.deep.equal({
      markers: [],
      segments: [],
      opsInProgress: 0,
    });
  });

  it('handles ADD_MARKER', () => {
    const pathReducer = createPathReducer();

    expect(pathReducer(undefined, actions.addMarkerSync(1, [1, 1], 'address'))).to.deep.equal({
      markers: [{ id: 1, location: [1, 1], address: 'address' }],
      segments: [],
      opsInProgress: 0,
    });

    expect(pathReducer({
      markers: [{ id: 'othermarker' }],
      segments: [1, 2, 3],
      opsInProgress: 0,
    }, actions.addMarkerSync(1, [1, 1], 'address'))).to.deep.equal({
      markers: [{ id: 'othermarker' }, { id: 1, location: [1, 1], address: 'address' }],
      segments: [1, 2, 3],
      opsInProgress: 0,
    });
  });

  it('handles REMOVE_MARKER', () => {
    const pathReducer = createPathReducer();

    expect(pathReducer(undefined, actions.removeMarkerSync(1))).to.deep.equal({
      markers: [],
      segments: [],
      opsInProgress: 0,
    });

    expect(pathReducer({
      markers: [{ id: 1 }, { id: 2 }, { id: 3 }],
      segments: [1, 2, 3],
      opsInProgress: 0,
    }, actions.removeMarkerSync(2))).to.deep.equal({
      markers: [{ id: 1 }, { id: 3 }],
      segments: [1, 2, 3],
      opsInProgress: 0,
    });
  });

  it('handles UPDATE_MARKER', () => {
    const pathReducer = createPathReducer();

    const updateAction = actions.updateMarkerSync(1, [2, 2], 'new address');

    expect(pathReducer(undefined, updateAction))
      .to.deep.equal({
        markers: [],
        segments: [],
        opsInProgress: 0,
      });

    expect(pathReducer({
      markers: [{ id: 1, location: [1, 1], address: 'address' }, { id: 2 }, { id: 3 }],
      segments: [1, 2, 3],
      opsInProgress: 0,
    }, updateAction)).to.deep.equal({
      markers: [{ id: 1, location: [2, 2], address: 'new address' }, { id: 2 }, { id: 3 }],
      segments: [1, 2, 3],
      opsInProgress: 0,
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
        opsInProgress: 0,
      });

    expect(pathReducer({
      markers: [1, 2],
      segments: [{ id: 1 }, { id: 2 }, { id: 3 }],
      opsInProgress: 0,
    }, addSegmentAction)).to.deep.equal({
      markers: [1, 2],
      segments: [{ id: 1 }, { id: 2 }, { id: 3 }, {
        id: '1_2',
        startMarkerId: 1,
        endMarkerId: 2,
        path: [[1, 1], [2, 2]],
      }],
      opsInProgress: 0,
    });
  });

  it('handles REMOVE_SEGMENT', () => {
    const pathReducer = createPathReducer();

    const removeSegmentAction = actions.removeSegmentSync(2);

    expect(pathReducer(undefined, removeSegmentAction))
      .to.deep.equal({
        markers: [],
        segments: [],
        opsInProgress: 0,
      });

    expect(pathReducer({
      markers: [1, 2],
      segments: [{ id: 1 }, { id: 2 }, { id: 3 }],
      opsInProgress: 0,
    }, removeSegmentAction)).to.deep.equal({
      markers: [1, 2],
      segments: [{ id: 1 }, { id: 3 }],
      opsInProgress: 0,
    });
  });

  it('handles UPDATE_SEGMENT', () => {
    const pathReducer = createPathReducer();

    const updateSegmentAction = actions.updateSegmentSync(2, [[1, 1], [2, 2]]);

    expect(pathReducer(undefined, updateSegmentAction))
      .to.deep.equal({
        markers: [],
        segments: [],
        opsInProgress: 0,
      });

    expect(pathReducer({
      markers: [1, 2],
      segments: [{ id: 1 }, { id: 2 }, { id: 3 }],
      opsInProgress: 0,
    }, updateSegmentAction)).to.deep.equal({
      markers: [1, 2],
      segments: [{ id: 1 }, { id: 2, path: [[1, 1], [2, 2]] }, { id: 3 }],
      opsInProgress: 0,
    });
  });

  it('handles OPERATION_STARTED', () => {
    const pathReducer = createPathReducer();

    const opStarted = actions.operationStarted();

    expect(pathReducer(undefined, opStarted))
      .to.deep.equal({
        markers: [],
        segments: [],
        opsInProgress: 1,
      });

    expect(pathReducer({
      markers: [1, 2],
      segments: [1],
      opsInProgress: 1,
    }, opStarted))
      .to.deep.equal({
        markers: [1, 2],
        segments: [1],
        opsInProgress: 2,
      });
  });

  it('handles OPERATION_DONE', () => {
    const pathReducer = createPathReducer();

    const opDone = actions.operationDone();

    expect(pathReducer(undefined, opDone))
      .to.deep.equal({
        markers: [],
        segments: [],
        opsInProgress: 0,
      });

    expect(pathReducer({
      markers: [1, 2],
      segments: [1],
      opsInProgress: 3,
    }, opDone))
      .to.deep.equal({
        markers: [1, 2],
        segments: [1],
        opsInProgress: 2,
      });
  });
});
