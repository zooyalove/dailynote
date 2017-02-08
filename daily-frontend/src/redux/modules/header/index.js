import { combineReducers } from 'redux';
import weather from './weather';

const header = combineReducers({
	weather
});

export default header;