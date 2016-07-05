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
  it('renders a <Map /> component', () => {
    const wrapper = shallow(<RoutePlanner />);
    expect(wrapper.find(Map)).to.have.length(1);
  });

  it(`renders a <MarkerLocation /> component at the right location
    after click on map`, (done) => {
    const location = { lat: 1, lng: 1 };
    const wrapper = shallow(<RoutePlanner api={apiMock} />);
    wrapper.find(Map).props().onMapClick(location)
      .then(() => {
        wrapper.update();
        expect(wrapper.find({ location })).to.have.length(1);
        done();
      })
      .catch(done);
  });

  it(`renders a <Map /> component with one marker data object in markerList prop
    after click on map`, (done) => {
    const location = { lat: 1, lng: 1 };
    const wrapper = shallow(<RoutePlanner api={apiMock} />);
    let mapWrapper = wrapper.find(Map);
    mapWrapper.props().onMapClick(location)
      .then(() => {
        wrapper.update();
        mapWrapper = wrapper.find(Map);
        const markerData = _.values(mapWrapper.props().markerList)[0];
        expect(markerData.location).to.equal(location);
        done();
      })
      .catch(done);
  });

  it(`removes the previously added <MarkerLocation /> component
    after double clicking the marker on map`, (done) => {
    const location = { lat: 1, lng: 1 };
    const wrapper = shallow(<RoutePlanner api={apiMock} />);
    const mapWrapper = wrapper.find(Map);
    mapWrapper.props().onMapClick(location)
      .then(() => {
        wrapper.update();
        const id = wrapper.find(MarkerLocation).props().id;
        mapWrapper.props().onMarkerDblClick(id);
        wrapper.update();
        expect(wrapper.find(MarkerLocation)).to.have.length(0);
        done();
      })
      .catch(done);
  });
});
