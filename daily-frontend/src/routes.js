import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './containers/App';
import { MainRoute } from './containers/routes';

export default (
	<Route path="/" component={App}>
		<IndexRoute component={MainRoute} />
	</Route>
);
