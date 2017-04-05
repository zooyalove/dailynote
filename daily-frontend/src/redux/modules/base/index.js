import { combineReducers } from 'redux';

import header from './header';
import login from './login';
import orderer from './orderer';

const base = combineReducers({
    header,
    login,
    orderer
});

export default base;