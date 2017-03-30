import { combineReducers } from 'redux';

import header from './header';
import login from './login';

const base = combineReducers({
    header,
    login
});

export default base;