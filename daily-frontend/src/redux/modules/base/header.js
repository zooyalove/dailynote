import { createAction, handleActions } from 'redux-actions';
import { Map } from 'immutable';

/* actions */
const HEADER_HIDE = "header/HEADER_HIDE";
const HEADER_OPEN = "header/HEADER_OPEN";

/* action creators */
export const hideHeader = createAction(HEADER_HIDE);
export const openHeader = createAction(HEADER_OPEN);

const initialState = Map({
    visible: true
});

export default handleActions({
	[HEADER_HIDE]: (state, action) => (
		state.set('visible', false)
	),
	[HEADER_OPEN]: (state, action) => (
		state.set('visible', true)
	)
}, initialState);
