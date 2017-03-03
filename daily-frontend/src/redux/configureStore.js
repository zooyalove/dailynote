import { createStore, applyMiddleware, combineReducers } from 'redux';
import promiseMiddleware from 'redux-promise-middleware';

/* load modules */
// import header from './modules/header';

/* configure middleware */
const middlewares = [promiseMiddleware()];

const createSoreWithMiddleware = applyMiddleware(...middlewares)(createStore);

const reducer = combineReducers({
	// header
});

const configureStore = (initialState) => createSoreWithMiddleware(reducer, initialState, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

export default configureStore;
