import React from 'react';
import ReactDOM from 'react-dom';
import './assets/stylesheets/style';
import 'bootstrap-grid';

class GoogleMap extends React.Component {
  componentDidMount(rootNode) {
    const {center, zoom} = this.props;
    const map = new google.maps.Map(this._mapEl, {center, zoom});
  }
  render() {
    return (
      <div className='map col-lg-6' ref={mapEl => this._mapEl = mapEl}></div>
    );
  }
}

GoogleMap.defaultProps = {
  center: {lat: -34.397, lng: 150.644},
  zoom: 8
};

ReactDOM.render(
  <GoogleMap></GoogleMap>,
  document.getElementById('app')
);
