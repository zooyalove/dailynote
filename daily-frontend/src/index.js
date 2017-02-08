import React from 'react';
import ReactDOM from 'react-dom';
import Root from './containers/Root';

import configureStore from './redux/configureStore';

const store = configureStore();

const rootElement = document.getElementById('root');
ReactDOM.render(
  <Root store={store} />,
  rootElement
);
