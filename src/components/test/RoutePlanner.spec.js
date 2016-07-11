import React from 'react';
import _ from 'lodash';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import RoutePlanner from '../RoutePlanner';
import MarkerLocation from '../MarkerLocation';
import Map from '../Map';

const apiMock = {
  getDirections: () => Promise.resolve([]),
  geocodeLocation: ({ lat, lng }) => Promise.resolve(`Address${lat}${lng}`),
};

function createRoutePlanner() {
  return <RoutePlanner api={apiMock} />;
}

describe('<RoutePlanner />', () => {
  it('renders a Map component and a marker', () => {
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

    const mlWrapper = wrapper.find(MarkerLocation);
    expect(mlWrapper).to.have.length(1);
    expect(mlWrapper.props().location).to.equal(marker.location);
    expect(mlWrapper.props().address).to.equal(marker.address);
    expect(mlWrapper.props().id).to.equal(marker.id);
    expect(mlWrapper.props().key).to.equal(marker.id);

    expect(wrapper.find(SegmentDots)).to.have.length(0);
    expect(wrapper.find(LinearProgress)).to.have.length(0);
  });
  //
  // it('renders a MarkerLocation component at the right location and with right address ' +
  //   'after click on map', async () => {
  //   const location = { lat: 1, lng: 1 };
  //   const wrapper = shallow(createRoutePlanner());
  //
  //   await wrapper.find(Map).props().onMapClick(location);
  //   wrapper.update();
  //
  //   const mlWrapper = wrapper.find(MarkerLocation);
  //   expect(mlWrapper).to.have.length(1);
  //   expect(mlWrapper.props().location).to.equal(location);
  //   expect(mlWrapper.props().address).to.equal('Address11');
  // });
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
