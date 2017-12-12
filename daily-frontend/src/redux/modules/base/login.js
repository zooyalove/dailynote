import { createAction, handleActions } from 'redux-actions';
import { Map } from 'immutable';

/* actions */
const LOGIN_FORM_INFO_SET = "login/LOGIN_FORM_INFO_SET";
const LOGIN_FORM_REMEMBER_SET = "login/LOGIN_FORM_REMEMBER_SET";
const LOGIN_FORM_AUTH_FETCHING = "login/LOGIN_FORM_AUTH_FETCHING";
const LOGIN_FORM_AUTH_FULLFILLED = "login/LOGIN_FORM_AUTH_FULLFILLED";
const LOGIN_FORM_AUTH_MESSAGE_SET = "login/LOGIN_FORM_AUTH_MESSAGE_SET";
const LOGIN_FORM_AUTH_MESSAGE_HIDE = "login/LOGIN_FORM_AUTH_MESSAGE_HIDE";
const LOGIN_FORM_AUTH_MESSAGE_CLEAR = "login/LOGIN_FORM_AUTH_MESSAGE_CLEAR";
const LOGIN_FORM_INFO_CLEAR = "login/LOGIN_FORM_INFO_CLEAR";

/* action creators */
export const setLoginFormInfo = createAction(LOGIN_FORM_INFO_SET);
export const setLoginFormRemember = createAction(LOGIN_FORM_REMEMBER_SET);
export const fetchingLoginAuth = createAction(LOGIN_FORM_AUTH_FETCHING);
export const completeLoginAuth = createAction(LOGIN_FORM_AUTH_FULLFILLED);
export const setLoginAuthMessage = createAction(LOGIN_FORM_AUTH_MESSAGE_SET);
export const hideLoginAuthMessage = createAction(LOGIN_FORM_AUTH_MESSAGE_HIDE);
export const clearLoginAuthMessage = createAction(LOGIN_FORM_AUTH_MESSAGE_CLEAR);
export const clearLoginFormInfo = createAction(LOGIN_FORM_INFO_CLEAR);

const initialState = Map({
	loginForm: Map({
	    userid: null,
	    password: null
	}),
	auth: Map({
		type: null,
		message: "",
		visible: false
	}),
	is_remember: true,
	fetching: false
});

export default handleActions({
	[LOGIN_FORM_INFO_SET]: (state, action) => {
        const { name, data } = action.payload;

		return state.setIn(['loginForm', name], data);
    },
    [LOGIN_FORM_REMEMBER_SET]: (state, action) => {
    	const checked = action.payload;

    	return state.set('is_remember', checked);
    },
	[LOGIN_FORM_AUTH_FETCHING]: (state, action) => (
		state.set('fetching', true)
	),
	[LOGIN_FORM_AUTH_FULLFILLED]: (state, action) => (
		state.set('fetching', false)
	),
	[LOGIN_FORM_AUTH_MESSAGE_SET]: (state, action) => {
		const { type, message } = action.payload;

		return state.mergeIn(['auth'], { type, message, visible: true });
	},
	[LOGIN_FORM_AUTH_MESSAGE_HIDE]: (state, action) => (
		state.setIn(['auth', 'visible'], false)
	),
	[LOGIN_FORM_AUTH_MESSAGE_CLEAR]: (state, action) => (
		state.mergeIn(['auth'], initialState.get('auth'))
	),
	[LOGIN_FORM_INFO_CLEAR]: (state, action) => (
		state.mergeIn(['loginForm'], initialState.get('loginForm'))
	)
}, initialState);
