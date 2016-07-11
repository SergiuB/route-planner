import React from 'react';
import _ from 'lodash';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import RoutePlanner from '../RoutePlanner';
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

describe('<RoutePlanner />', () => {
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

  it('dispatches addSegment when clicking on map with one initial marker', async () => {
    const actions = {
      addMarker: () => {},
      addSegment: (startId, endId) => `${startId}_${endId}`
    }
    const dispatch = sinon.spy();

    const location2 = [2, 2];
    const id2 = 2;
    const location1 = [1, 1];
    const id1 = 1;

    const wrapper = shallow(
      <RoutePlanner
        markers={[{
          id: id1,
          location: location1,
        }]}
        generateId={() => id2}
        dispatch={dispatch}
        actions={actions}/>);

    await wrapper.find(Map).props().onMapClick(location2);
    expect(dispatch.calledWith(`${id1}_${id2}`)).to.be.ok;
  });

  it('dispatches removeMarker when double clicking a marker', async () => {
    const spy = sinon.spy();
    const actions = {
      removeMarker: (id, location) => id
    }
    const dispatch = sinon.spy();
    const id = 1;

    const wrapper = shallow(
      <RoutePlanner
        markers={[{
          id: 1
        }]}
        dispatch={dispatch}
        actions={actions}/>);

    await wrapper.find(Map).props().onMarkerDblClick(id);
    expect(dispatch.calledWith(id)).to.be.ok;
  });

  //
  // it('renders a Map component with one marker data object in markers prop ' +
  //   'after click on map', async () => {
  //   const location = { lat: 1, lng: 1 };
  //   const wrapper = shallow(createRoutePlanner());
  //   let mapWrapper = wrapper.find(Map);
  //
  //   await mapWrapper.props().onMapClick(location);
  //   wrapper.update();
  //
  //   mapWrapper = wrapper.find(Map);
  //   const markerData = _.values(mapWrapper.props().markers)[0];
  //   expect(markerData.location).to.equal(location);
  // });
  //
  // it('removes the previously added MarkerLocation component ' +
  //   'after double clicking the marker on map', async () => {
  //   const location = { lat: 1, lng: 1 };
  //   const wrapper = shallow(createRoutePlanner());
  //   const mapWrapper = wrapper.find(Map);
  //
  //   await mapWrapper.props().onMapClick(location);
  //   wrapper.update();
  //
  //   const id = wrapper.find(MarkerLocation).props().id;
  //
  //   mapWrapper.props().onMarkerDblClick(id);
  //   wrapper.update();
  //
  //   expect(wrapper.find(MarkerLocation)).to.have.length(0);
  // });
  //
  // it('removes the previously added MarkerLocation component ' +
  //   'after clicking the remove button on the MarkerLocation', async () => {
  //   const location = { lat: 1, lng: 1 };
  //   const wrapper = shallow(createRoutePlanner());
  //   const mapWrapper = wrapper.find(Map);
  //
  //   await mapWrapper.props().onMapClick(location);
  //   wrapper.update();
  //
  //   const mlWrapper = wrapper.find(MarkerLocation);
  //   const mlId = mlWrapper.props().id;
  //
  //   mlWrapper.props().onRemove(mlId);
  //   wrapper.update();
  //
  //   expect(wrapper.find(MarkerLocation)).to.have.length(0);
  // });
  //
  // it('updates the MarkerLocation component if a marker is dragged to a new location', async () => {
  //   const location = { lat: 1, lng: 1 };
  //   const newLocation = { lat: 2, lng: 2 };
  //   const wrapper = shallow(createRoutePlanner());
  //   let mapWrapper = wrapper.find(Map);
  //
  //   await mapWrapper.props().onMapClick(location)
  //   wrapper.update();
  //
  //   const id = wrapper.find(MarkerLocation).props().id;
  //
  //   await mapWrapper.props().onMarkerDragEnd(id, newLocation)
  //   wrapper.update();
  //
  //   mapWrapper = wrapper.find(Map);
  //   const markerData = _.values(mapWrapper.props().markers)[0];
  //   expect(markerData.location).to.equal(newLocation);
  // });
});
