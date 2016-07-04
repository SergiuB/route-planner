import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import RoutePlanner from '../components/RoutePlanner';
import MarkerLocation from '../components/MarkerLocation';
import Map from '../components/Map';

describe('<RoutePlanner />', () => {
  it('should render a <Map /> component', () => {
    const wrapper = shallow(<RoutePlanner />);
    expect(wrapper.find(Map)).to.have.length(1);
  });

  it(`should render a <MarkerLocation /> component at the right location
    after click on map`, () => {
    const location = { lat: 1, lng: 1 };
    const wrapper = shallow(<RoutePlanner />);
    wrapper.find(Map).props().onMapClick(location);
    wrapper.update();
    const markerWrapper = wrapper.find(MarkerLocation);
    expect(markerWrapper.props().location).to.equal(location);
  });
});
