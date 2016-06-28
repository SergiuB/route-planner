import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap-grid';

import './assets/stylesheets/style';
import GoogleMap from './components/GoogleMap';

ReactDOM.render(
  <GoogleMap />,
  document.getElementById('app')
);
