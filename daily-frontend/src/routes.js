import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './containers/App';
import { MainRoute, WriteRoute, OrdererRoute, SearchRoute, StatRoute } from './containers/routes';

export default (
	<Route path="/" component={App}>
		<IndexRoute component={MainRoute} />
		<Route path="write" component={WriteRoute} />
		<Route path="orderer" component={OrdererRoute} />
		<Route path="search" component={SearchRoute} />
		<Route path="stat" component={StatRoute} />
	</Route>
);
