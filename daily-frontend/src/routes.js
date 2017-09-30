import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './containers/App';
import {
	MainRoute,
	WriteRoute,
	OrdererRoute,
	OrdererInfo,
	SearchRoute,
	StatRoute,
	LoginRoute
} from './containers/routes';

export default (
	<Route path="/" component={App}>
		<IndexRoute component={MainRoute} />
		<Route path="login" component={LoginRoute} />
		<Route path="write" component={WriteRoute} />
		<Route path="orderer" component={OrdererRoute}>
			<IndexRoute component={OrdererInfo} />
			<Route path=":userid" component={OrdererInfo} />
		</Route>
		<Route path="search" component={SearchRoute} />
		<Route path="stat" component={StatRoute} />
	</Route>
);
