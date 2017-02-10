import React from 'react';
import ReactDOM from 'react-dom';
import Root from './containers/Root';

import configureStore from './redux/configureStore';

import weatherHelper from './helpers/header/weather';
weatherHelper.getWeatherInfo('경상북도 구미시 지산동');

const store = configureStore();

const rootElement = document.getElementById('root');
ReactDOM.render(
  <Root store={store} />,
  rootElement
);
