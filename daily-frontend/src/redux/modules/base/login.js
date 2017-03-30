import { createAction, handleActions } from 'redux-actions';
import { Map } from 'immutable';

/* actions */
const LOGIN_FORM_INFO_SET = "login/LOGIN_FORM_INFO_SET";
const LOGIN_FORM_INFO_CLEAR = "login/LOGIN_FORM_INFO_CLEAR";

/* action creators */
export const setLoginFormInfo = createAction(LOGIN_FORM_INFO_SET);
export const clearLoginFormInfo = createAction(LOGIN_FORM_INFO_CLEAR);

const initialState = Map({
    userid: null,
    password: null
});

export default handleActions({
	[LOGIN_FORM_INFO_SET]: (state, action) => {
        const {name, value} = action.payload;

		return state.set(name, value);
    },
	[LOGIN_FORM_INFO_CLEAR]: (state, action) => (
		state.merge(initialState)
	)
}, initialState);
