import { expect } from 'chai';
import createPathReducer from '../pathReducer';
import createActions from '../actions';

const actions = createActions({
  getAddressForLocation: () => 'address',
  getPath: () => [],
});

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

    expect(pathReducer(undefined, actions.removeMarker(1))).to.deep.equal({
      markers: [],
      segments: [],
      opsInProgress: 0,
    });

    expect(pathReducer({
      markers: [{ id: 1 }, { id: 2 }, { id: 3 }],
      segments: [1, 2, 3],
      opsInProgress: 0,
    }, actions.removeMarker(2))).to.deep.equal({
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

  describe('CHANGE_MARKER_INDEX', () => {
    const pathReducer = createPathReducer();

    it('throws if marker with given id does not exist', () => {
      expect(() => pathReducer(undefined, actions.changeMarkerIndex(1, 0)))
        .to.throw(Error, 'inexistent marker');
    });

    it('throws if new index is negative', () => {
      expect(() => pathReducer({
        markers: [{ id: 1 }, { id: 2 }, { id: 3 }],
      }, actions.changeMarkerIndex(1, -1))).to.throw(Error, 'index out of bounds');
    });

    it('throws if new index is outside bounds', () => {
      expect(() => pathReducer({
        markers: [{ id: 1 }, { id: 2 }, { id: 3 }],
      }, actions.changeMarkerIndex(1, 3))).to.throw(Error, 'index out of bounds');
    });

    it('throws if new index is not a number', () => {
      expect(() => pathReducer({
        markers: [{ id: 1 }, { id: 2 }, { id: 3 }],
      }, actions.changeMarkerIndex(1))).to.throw(Error, 'invalid new index');
    });

    it('moves marker to the first position if new index is 0', () => {
      expect(pathReducer({
        markers: [{ id: 1 }, { id: 2 }, { id: 3 }],
        otherState: 'unchanged',
      }, actions.changeMarkerIndex(2, 0))).to.deep.equal({
        markers: [{ id: 2 }, { id: 1 }, { id: 3 }],
        otherState: 'unchanged',
      });
    });

    it('moves marker to the last position if new index is length - 1', () => {
      expect(pathReducer({
        markers: [{ id: 1 }, { id: 2 }, { id: 3 }],
        otherState: 'unchanged',
      }, actions.changeMarkerIndex(2, 2))).to.deep.equal({
        markers: [{ id: 1 }, { id: 3 }, { id: 2 }],
        otherState: 'unchanged',
      });
    });

    it('moves marker somewhere else in the middle of markers array', () => {
      expect(pathReducer({
        markers: [{ id: 1 }, { id: 2 }, { id: 3 }],
        otherState: 'unchanged',
      }, actions.changeMarkerIndex(3, 1))).to.deep.equal({
        markers: [{ id: 1 }, { id: 3 }, { id: 2 }],
        otherState: 'unchanged',
      });
    });

    it('moves marker somewhere else in the middle of markers array', () => {
      expect(pathReducer({
        markers: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
        otherState: 'unchanged',
      }, actions.changeMarkerIndex(3, 1))).to.deep.equal({
        markers: [{ id: 1 }, { id: 3 }, { id: 2 }, { id: 4 }],
        otherState: 'unchanged',
      });
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

    const removeSegmentAction = actions.removeSegment(2);

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
