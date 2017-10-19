import { createAction, handleActions } from 'redux-actions';
import { Map, List, fromJS } from 'immutable';
import _ from 'lodash';

/* actions */
const ORDERER_ADD_MODAL_OPEN = "orderer/ORDERER_ADD_MODAL_OPEN";
const ORDERER_MODIFY_INFO_SET = "orderer/ORDERER_MODIFY_INFO_SET";
const ORDERER_DATA_FETCHING = "orderer/ORDERER_DATA_FETCHING";
const ORDERER_DATA_SET = "orderer/ORDERER_DATA_SET";

/* action creators */
export const openAddOrdererModal = createAction(ORDERER_ADD_MODAL_OPEN);
export const setOrdererModifyInfo = createAction(ORDERER_MODIFY_INFO_SET);
export const fetchingOrdererData = createAction(ORDERER_DATA_FETCHING);
export const setOrdererData = createAction(ORDERER_DATA_SET);

const initialState = Map({
    modal: Map({
        mode: '',
        open: false,
        fetch: false,
        message: ''
    }),
    info: null,
    data: List([])
});

export default handleActions({
	[ORDERER_ADD_MODAL_OPEN]: (state, action) => {
        const { open, mode } = action.payload;

        let m = '';

        if (typeof mode !== 'undefined') m = mode;

        return state.setIn(['modal', 'open'], open)
                    .setIn(['modal', 'mode'], m);
    },
    [ORDERER_MODIFY_INFO_SET]: (state, action) => {
        const { info } = action.payload;

        return state.set('info', info);
    },
	[ORDERER_DATA_FETCHING]: (state, action) => {
        const { fetch, message } = action.payload;

		return state.setIn(['modal', 'fetch'], fetch)
                    .setIn(['modal', 'message'], message);
    },
	[ORDERER_DATA_SET]: (state, action) => {
        const { orderer } = action.payload;

        let data = state.get('data');

        if (orderer.length === undefined && orderer.size === undefined) {
            if (!data.isEmpty()) {
                // console.log("무언가 있을때...");
                if (data.findIndex((d) => d.get('name') === orderer.name) === -1) {
                    data = data.insert(0, fromJS(orderer));
                    return state.set('data', data);
                } else {
                    return state;
                }
            } else {
                // console.log("무언가 없을때...");
                data = data.push(fromJS(orderer));
                return state.set('data', data);
            }
        }

        return state.set('data', fromJS(orderer));
    }
}, initialState);
