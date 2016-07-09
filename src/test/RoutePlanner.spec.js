import React from 'react';
import _ from 'lodash';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import RoutePlanner from '../components/RoutePlanner';
import MarkerLocation from '../components/MarkerLocation';
import Map from '../components/Map';

const apiMock = {
  getDirections: () => Promise.resolve([]),
  geocodeLocation: ({ lat, lng }) => Promise.resolve(`Address${lat}${lng}`),
};

function createRoutePlanner() {
  return <RoutePlanner api={apiMock} />;
}

describe('<RoutePlanner />', () => {
  it('renders a Map component', () => {
    const wrapper = shallow(createRoutePlanner());
    expect(wrapper.find(Map)).to.have.length(1);
  });

  it('renders a MarkerLocation component at the right location and with right address ' +
    'after click on map', async () => {
    const location = { lat: 1, lng: 1 };
    const wrapper = shallow(createRoutePlanner());

    await wrapper.find(Map).props().onMapClick(location);
    wrapper.update();

    const mlWrapper = wrapper.find(MarkerLocation);
    expect(mlWrapper).to.have.length(1);
    expect(mlWrapper.props().location).to.equal(location);
    expect(mlWrapper.props().address).to.equal('Address11');
  });

  it('renders a Map component with one marker data object in markers prop ' +
    'after click on map', async () => {
    const location = { lat: 1, lng: 1 };
    const wrapper = shallow(createRoutePlanner());
    let mapWrapper = wrapper.find(Map);

    await mapWrapper.props().onMapClick(location);
    wrapper.update();

    mapWrapper = wrapper.find(Map);
    const markerData = _.values(mapWrapper.props().markers)[0];
    expect(markerData.location).to.equal(location);
  });

  it('removes the previously added MarkerLocation component ' +
    'after double clicking the marker on map', async () => {
    const location = { lat: 1, lng: 1 };
    const wrapper = shallow(createRoutePlanner());
    const mapWrapper = wrapper.find(Map);

    await mapWrapper.props().onMapClick(location);
    wrapper.update();

    const id = wrapper.find(MarkerLocation).props().id;

    mapWrapper.props().onMarkerDblClick(id);
    wrapper.update();

    expect(wrapper.find(MarkerLocation)).to.have.length(0);
  });

  it('removes the previously added MarkerLocation component ' +
    'after clicking the remove button on the MarkerLocation', async () => {
    const location = { lat: 1, lng: 1 };
    const wrapper = shallow(createRoutePlanner());
    const mapWrapper = wrapper.find(Map);

    await mapWrapper.props().onMapClick(location);
    wrapper.update();

    const mlWrapper = wrapper.find(MarkerLocation);
    const mlId = mlWrapper.props().id;

    mlWrapper.props().onRemove(mlId);
    wrapper.update();

    expect(wrapper.find(MarkerLocation)).to.have.length(0);
  });

  it('updates the MarkerLocation component if a marker is dragged to a new location', async () => {
    const location = { lat: 1, lng: 1 };
    const newLocation = { lat: 2, lng: 2 };
    const wrapper = shallow(createRoutePlanner());
    let mapWrapper = wrapper.find(Map);

    await mapWrapper.props().onMapClick(location)
    wrapper.update();

    const id = wrapper.find(MarkerLocation).props().id;

    await mapWrapper.props().onMarkerDragEnd(id, newLocation)
    wrapper.update();

    mapWrapper = wrapper.find(Map);
    const markerData = _.values(mapWrapper.props().markers)[0];
    expect(markerData.location).to.equal(newLocation);
  });
});