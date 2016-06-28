import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap-grid';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import './assets/stylesheets/style';
import RoutePlanner from './components/RoutePlanner';

ReactDOM.render(
  <MuiThemeProvider>
    <RoutePlanner />
  </MuiThemeProvider>,
  document.getElementById('app')
);
