import React from 'react';
import _ from 'lodash';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import RoutePlanner from '../components/RoutePlanner';
import MarkerLocation from '../components/MarkerLocation';
import Map from '../components/Map';

const apiMock = {
  getDirections: () => Promise.resolve([]),
  geocodeLocation: () => Promise.resolve('Address'),
};

describe('<RoutePlanner />', () => {
  it('renders a Map component', () => {
    const wrapper = shallow(<RoutePlanner />);
    expect(wrapper.find(Map)).to.have.length(1);
  });

  it(`renders a MarkerLocation component at the right location
    after click on map`, async () => {
    const location = { lat: 1, lng: 1 };
    const wrapper = shallow(<RoutePlanner api={apiMock} />);

    await wrapper.find(Map).props().onMapClick(location);
    wrapper.update();

    expect(wrapper.find({ location })).to.have.length(1);
  });

  it(`renders a Map component with one marker data object in markerList prop
    after click on map`, async () => {
    const location = { lat: 1, lng: 1 };
    const wrapper = shallow(<RoutePlanner api={apiMock} />);
    let mapWrapper = wrapper.find(Map);

    await mapWrapper.props().onMapClick(location);
    wrapper.update();

    mapWrapper = wrapper.find(Map);
    const markerData = _.values(mapWrapper.props().markerList)[0];
    expect(markerData.location).to.equal(location);
  });

  it(`removes the previously added MarkerLocation component
    after double clicking the marker on map`, async () => {
    const location = { lat: 1, lng: 1 };
    const wrapper = shallow(<RoutePlanner api={apiMock} />);
    const mapWrapper = wrapper.find(Map);

    await mapWrapper.props().onMapClick(location);
    wrapper.update();

    const id = wrapper.find(MarkerLocation).props().id;

    mapWrapper.props().onMarkerDblClick(id);
    wrapper.update();

    expect(wrapper.find(MarkerLocation)).to.have.length(0);
  });

  it('updates the MarkerLocation component if a marker is dragged to a new location', async () => {
    const location = { lat: 1, lng: 1 };
    const newLocation = { lat: 2, lng: 2 };
    const wrapper = shallow(<RoutePlanner api={apiMock} />);
    let mapWrapper = wrapper.find(Map);

    await mapWrapper.props().onMapClick(location)
    wrapper.update();

    const id = wrapper.find(MarkerLocation).props().id;

    await mapWrapper.props().onMarkerDragEnd(id, newLocation)
    wrapper.update();

    mapWrapper = wrapper.find(Map);
    const markerData = _.values(mapWrapper.props().markerList)[0];
    expect(markerData.location).to.equal(newLocation);
  });
});
