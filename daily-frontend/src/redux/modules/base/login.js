import { createAction, handleActions } from 'redux-actions';
import { Map } from 'immutable';

/* actions */
const LOGIN_FORM_INFO_SET = "login/LOGIN_FORM_INFO_SET";
const LOGIN_FORM_REMEMBER_SET = "login/LOGIN_FORM_REMEMBER_SET";
const LOGIN_FORM_INFO_CLEAR = "login/LOGIN_FORM_INFO_CLEAR";

/* action creators */
export const setLoginFormInfo = createAction(LOGIN_FORM_INFO_SET);
export const setLoginFormRemember = createAction(LOGIN_FORM_REMEMBER_SET);
export const clearLoginFormInfo = createAction(LOGIN_FORM_INFO_CLEAR);

const initialState = Map({
	loginForm: Map({
	    userid: null,
	    password: null
	}),
	is_remember: true
});

export default handleActions({
	[LOGIN_FORM_INFO_SET]: (state, action) => {
        const { name, value } = action.payload;

		return state.setIn(['loginForm', name], value);
    },
    [LOGIN_FORM_REMEMBER_SET]: (state, action) => {
    	const checked = action.payload;

    	return state.set('is_remember', checked);
    },
	[LOGIN_FORM_INFO_CLEAR]: (state, action) => (
		state.mergeIn(['loginForm'], initialState.get('loginForm'))
	)
}, initialState);
