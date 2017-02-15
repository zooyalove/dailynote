import { createAction, handleActions } from 'redux-actions';
import { Map } from 'immutable';

/* actions */
const WEATHER_DETAIL_SET = "header/WEATHER_DETAIL_SET";
const WEATHER_DETAIL_OPEN = "header/WEATHER_DETAIL_OPEN";
const WEATHER_DETAIL_CLOSE = "header/WEATHER_DETAIL_CLOSE";

/* action creators */
export const setWeatherDetail = createAction(WEATHER_DETAIL_SET);
export const openWeatherDetail = createAction(WEATHER_DETAIL_OPEN);
export const closeWeatherDetail = createAction(WEATHER_DETAIL_CLOSE);

const initialState = Map({
	cityname: '경상북도 구미시 지산동',
	location: null,
	date: '',
	fetching: true,
	visible: false,
	weatherDetail: Map({
		data: null
	})
});

export default handleActions({
	[WEATHER_DETAIL_SET]: (state, action) => {
		const { geometry_loc, date, weather_data } = action.payload;
		console.log(weather_data);

		return state.merge({
			location: geometry_loc,
			date,
			fetching: false,
			weatherDetail: Map({
				data: weather_data.data.response.body.items.item
			})
		});
	},
	[WEATHER_DETAIL_OPEN]: (state, action) => (
		state.set('visible', true)
	),
	[WEATHER_DETAIL_CLOSE]: (state, action) => (
		state.set('visible', false)
	)
}, initialState);
