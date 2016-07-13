import React from 'react';
import _ from 'lodash';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import { RoutePlanner } from '../RoutePlanner';
import Map from '../Map';
import createActions from '../../redux/actions';
import * as types from '../../redux/actionConstants';

const apiMock = {
  getDirections: () => Promise.resolve([]),
  geocodeLocation: ({ lat, lng }) => Promise.resolve(`Address${lat}${lng}`),
};

function createRoutePlanner() {
  return <RoutePlanner api={apiMock} />;
}

let clock;

describe('<RoutePlanner />', () => {
  before(() => {
    clock = sinon.useFakeTimers();
  });

  after(() => {
    clock.restore();
  });

  it('renders a Map and a MarkerLocation given one marker', () => {
    const marker = {
      id: '1',
      location: [1, 1],
      address: 'address'
    };

    const wrapper = shallow(<RoutePlanner markers={[marker]}/>);

    const mapWrapper = wrapper.find(Map);
    expect(mapWrapper).to.have.length(1);
    expect(mapWrapper.props().markers).to.deep.equal([marker]);
    expect(mapWrapper.props().path).to.be.empty;

    const mlWrapper = wrapper.find('MarkerLocation');
    expect(mlWrapper).to.have.length(1);
    expect(mlWrapper.props().location).to.equal(marker.location);
    expect(mlWrapper.props().address).to.equal(marker.address);
    expect(mlWrapper.props().id).to.equal(marker.id);

    expect(wrapper.find('SegmentDots')).to.have.length(0);
    expect(wrapper.find('LinearProgress')).to.have.length(0);
  });

  it('renders a Map, three MarkerLocations and two SegmentDots given three markers ' +
    'and two segments', () => {
    const markers = [
      { id: '1', location: [1, 1], address: 'address1' },
      { id: '2', location: [2, 2], address: 'address2' },
      { id: '3', location: [3, 3], address: 'address3' },
    ];
    const segments = [
      { id: '1_2', startMarkerId: '1', endMarkerId: '2', path: [[1, 1], [2, 2]] },
      { id: '2_3', startMarkerId: '2', endMarkerId: '3', path: [[2, 2], [3, 3]] },
    ];

    const wrapper = shallow(<RoutePlanner markers={markers} segments={segments} />);

    const mapWrapper = wrapper.find(Map);
    expect(mapWrapper).to.have.length(1);
    expect(mapWrapper.props().markers).to.deep.equal(markers);
    expect(mapWrapper.props().path).to.deep.equal(_.concat(segments[0].path, segments[1].path));

    const mlWrapper = wrapper.find('MarkerLocation');
    expect(mlWrapper).to.have.length(3);
    _.times(3, x => expect(mlWrapper.at(x).props()).to.include(markers[x]));

    const sdWrapper = wrapper.find('SegmentDots');
    expect(sdWrapper).to.have.length(2);
    _.times(3, x => expect(sdWrapper.at(x).props()).to.include(_.pick(segments[x], ['id'])));
  });

  it('renders a LinearProgress if operations in progress', () => {
    const wrapper = shallow(<RoutePlanner opsInProgress={1} />);
    expect(wrapper.find('LinearProgress')).to.have.length(1);
  });

  it('does not render a LinearProgress if no operations in progress', () => {
    const wrapper = shallow(<RoutePlanner opsInProgress={0} />);
    expect(wrapper.find('LinearProgress')).to.have.length(0);
  });

  it('dispatches addMarker when clicking on map with no markers', async () => {
    const actions = {
      addMarker: (id, location) => `${id},${location}`
    }
    const dispatch = sinon.spy();

    const location = [1, 1];
    const id = 1;

    const wrapper = shallow(
      <RoutePlanner
        generateId={() => id}
        dispatch={dispatch}
        actions={actions}/>);

    await wrapper.find(Map).props().onMapClick(location);
    expect(dispatch.calledWith(`${id},${location}`)).to.be.ok;
  });

  it('dispatches addMarker and addSegment when clicking on map with one initial marker', async () => {
    // configure addMarker to finish later
    const actions = {
      addMarker: (id, location) =>
                        new Promise((resolve) =>
                            setTimeout(() => resolve(`added marker ${id} with location ${location}`), 100)
                        ),
      addSegment: (startId, endId) => Promise.resolve(`added segment ${startId}_${endId}`),
    }

    let dispatchedActions = [];
    const dispatch = async promise => dispatchedActions.push(await promise);

    const location2 = [2, 2];
    const id2 = 2;
    const location1 = [1, 1];
    const id1 = 1;

    const wrapper = shallow(
      <RoutePlanner
        markers={[{
          id: id1
        }]}
        generateId={() => id2}
        dispatch={dispatch}
        actions={actions}/>);

    const promise = wrapper.find(Map).props().onMapClick(location2);
    clock.tick(100);
    await promise;

    expect(dispatchedActions).to.deep.equal([
      'added marker 2 with location 2,2',
      'added segment 1_2'
    ]);
  });

  it('dispatches removeMarker when double clicking a marker', async () => {
    const spy = sinon.spy();
    const actions = {
      removeMarker: (id) => id
    }
    const dispatch = sinon.spy();
    const id = 1;

    const wrapper = shallow(
      <RoutePlanner
        markers={[{
          id
        }]}
        dispatch={dispatch}
        actions={actions}/>);

    await wrapper.find(Map).props().onMarkerDblClick(id);
    expect(dispatch.calledWith(id)).to.be.ok;
  });

  it('dispatches removeMarker and removeSegment when double clicking the last marker', async () => {
    const spy = sinon.spy();
    const actions = {
      removeMarker: id => id,
      removeSegment: id => id,
    }
    const dispatch = sinon.spy();
    const [id1, id2] = [1, 2];

    const wrapper = shallow(
      <RoutePlanner
        markers={[{
          id: id1
        }, {
          id: id2
        }]}
        dispatch={dispatch}
        actions={actions}/>);

    await wrapper.find(Map).props().onMarkerDblClick(id2);
    expect(dispatch.calledWith(id2)).to.be.ok;
    expect(dispatch.calledWith(`${id1}_${id2}`)).to.be.ok;
  });

  it('dispatches removeMarker and removeSegment when double clicking the first marker', async () => {
    const spy = sinon.spy();
    const actions = {
      removeMarker: id => id,
      removeSegment: id => id,
    }
    const dispatch = sinon.spy();
    const [id1, id2] = [1, 2];

    const wrapper = shallow(
      <RoutePlanner
        markers={[{
          id: id1
        }, {
          id: id2
        }]}
        dispatch={dispatch}
        actions={actions}/>);

    await wrapper.find(Map).props().onMarkerDblClick(id1);
    expect(dispatch.calledWith(id1)).to.be.ok;
    expect(dispatch.calledWith(`${id1}_${id2}`)).to.be.ok;
  });

  it('dispatches removeMarker, removeSegment and addSegment when double clicking a marker in the middle', async () => {
    const spy = sinon.spy();
    const actions = {
      removeMarker: id => id,
      removeSegment: id => `removed ${id}`,
      addSegment: (startId, endId) => `added ${startId}_${endId}`
    }
    const dispatch = sinon.spy();
    const [id1, id2, id3] = [1, 2, 3];
    const [location1, location3] = [[1, 1], [3, 3]];

    const wrapper = shallow(
      <RoutePlanner
        markers={[{
          id: id1,
          location: location1,
        }, {
          id: id2
        }, {
          id: id3,
          location: location3,
        }]}
        dispatch={dispatch}
        actions={actions}/>);

    await wrapper.find(Map).props().onMarkerDblClick(id2);
    expect(dispatch.calledWith(id2)).to.be.ok;
    expect(dispatch.calledWith(`removed ${id1}_${id2}`)).to.be.ok;
    expect(dispatch.calledWith(`removed ${id2}_${id3}`)).to.be.ok;
    expect(dispatch.calledWith(`added ${id1}_${id3}`)).to.be.ok;
  });

  it('dispatches updateMarker when changing the location of the single marker of the map by drag and drop', async () => {
    const actions = {
      updateMarker: (id, location) => `${id},${location}`
    }
    const dispatch = sinon.spy();

    const location = [1, 1];
    const location2 = [2, 2];
    const id = 1;

    const wrapper = shallow(
      <RoutePlanner
        markers={[{
          id: id,
          location: location,
        }]}
        generateId={() => id}
        dispatch={dispatch}
        actions={actions}/>);

    await wrapper.find(Map).props().onMarkerDragEnd(id, location2);
    expect(dispatch.calledWith(`${id},${location2}`)).to.be.ok;
  });

  it('dispatches updateMarker and updateSegment when changing the location of the middle marker of the map by drag and drop', async () => {

    // configure updateMarker to finish later
    const actions = {
      updateMarker: (id, location) =>
                        new Promise((resolve) =>
                            setTimeout(() => resolve(`updated marker ${id} with location ${location}`), 100)
                        ),
      updateSegment: id => Promise.resolve(`updated segment ${id}`),
    }
    let dispatchedActions = [];
    const dispatch = async promise => dispatchedActions.push(await promise);

    const [id1, id2, id3] = [1, 2, 3];
    const [location1, location2, location3] = [[1, 1], [2, 2], [3, 3]];

    const wrapper = shallow(
      <RoutePlanner
        markers={[{
          id: id1,
          location: location1,
        }, {
          id: id2
        }, {
          id: id3,
          location: location3,
        }]}
        generateId={() => id}
        dispatch={dispatch}
        actions={actions}/>);

    const promise = wrapper.find(Map).props().onMarkerDragEnd(id2, location2);
    clock.tick(100);
    await promise;
    expect(dispatchedActions).to.deep.equal([
      'updated marker 2 with location 2,2',
      'updated segment 1_2',
      'updated segment 2_3'
    ]);
  });

  it('dispatches changeMarkerIndex, removeSegment, addSegment when changing the position of a marker in the list', async () => {
    // configure updateMarker to finish later
    const actions = {
      changeMarkerIndex: (id, newIndex) => Promise.resolve(`changed marker ${id} to new index ${newIndex}`),
      removeSegment: id => Promise.resolve(`removed segment ${id}`),
      addSegment: (startId, endId) => Promise.resolve(`added segment ${startId}_${endId}`),
    }
    let dispatchedActions = [];
    const dispatch = async promise => dispatchedActions.push(await promise);

    const [id1, id2, id3, id4] = [1, 2, 3, 4];

    const wrapper = shallow(
      <RoutePlanner
        markers={[{
          id: id1,  // position 0
        }, {
          id: id2   // position 1
        }, {
          id: id3,  // position 2
        }, {
          id: id4,  // position 3
        }]}
        dispatch={dispatch}
        actions={actions}/>);

    // change position of marker with id3 from 2 to 1
    const newIndex = 1;
    await wrapper.find('Markers').props().onMarkerChangeIndex(id3, newIndex);
    expect(dispatchedActions).to.deep.equal([
      `changed marker ${id3} to new index ${newIndex}`,
      `removed segment ${id2}_${id3}`,
      `removed segment ${id2}_${id4}`,
      `removed segment ${id1}_${id2}`,
      `added segment ${id2}_${id4}`,
      `added segment ${id1}_${id3}`,
      `added segment ${id3}_${id1}`,
    ]);
  });
});
