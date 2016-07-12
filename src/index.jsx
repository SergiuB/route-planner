import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap-grid';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import { createStore, applyMiddleware } from 'redux';
import createPathReducer from './redux/pathReducer';

import './assets/stylesheets/style';
import RoutePlanner from './components/RoutePlanner';

const pathReducer = createPathReducer();
const loggerMiddleware = createLogger();

const store = createStore(
  pathReducer,
  applyMiddleware(
    thunkMiddleware, // lets us dispatch() functions
    loggerMiddleware // neat middleware that logs actions
  )
);

ReactDOM.render(
  <MuiThemeProvider>
    <Provider store={store}>
      <RoutePlanner />
    </Provider>
  </MuiThemeProvider>,
  document.getElementById('app')
);
