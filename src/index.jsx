import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap-grid';

import './assets/stylesheets/style';
import RoutePlanner from './components/RoutePlanner';

ReactDOM.render(
  <RoutePlanner />,
  document.getElementById('app')
);
