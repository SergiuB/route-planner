import { expect } from 'chai';
import pathReducer from '../pathReducer';
import * as actions from '../actionConstants';

describe('path reducer', () => {
  it('returns the initial state', () => {
    expect(pathReducer(undefined, {})).to.deep.equal({
      markers: [],
      segments: [],
    });
  });
});
