import { createAction, handleActions } from 'redux-actions';
import { Map } from 'immutable';

/* actions */
const WEATHER_DETAIL_OPEN = "header/WEATHER_DETAIL_OPEN";
const WEATHER_DETAIL_CLOSE = "header/WEATHER_DETAIL_CLOSE";

/* action creators */
export const openWeatherDetail = createAction(WEATHER_DETAIL_OPEN);
export const closeWeatherDetail = createAction(WEATHER_DETAIL_CLOSE);

const initialState = Map({
	weatherDetail: Map({
		open: false
	})
});

export default handleActions({
	[WEATHER_DETAIL_OPEN]: (state, action) => (
		state.setIn(['weatherDetail', 'open'], true)
	),
	[WEATHER_DETAIL_CLOSE]: (state, action) => (
		state.setIn(['weatherDetail', 'open'], false)
	)
}, initialState);
