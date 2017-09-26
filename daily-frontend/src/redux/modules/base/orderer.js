import { createAction, handleActions } from 'redux-actions';
import { Map, List, fromJS } from 'immutable';
import _ from 'lodash';

/* actions */
const ORDERER_ADD_MODAL_OPEN = "orderer/ORDERER_ADD_MODAL_OPEN";
const ORDERER_DATA_FETCHING = "orderer/ORDERER_DATA_FETCHING";
const ORDERER_DATA_SET = "orderer/ORDERER_DATA_SET";

/* action creators */
export const openAddOrdererModal = createAction(ORDERER_ADD_MODAL_OPEN);
export const fetchingOrdererData = createAction(ORDERER_DATA_FETCHING);
export const setOrdererData = createAction(ORDERER_DATA_SET);

const initialState = Map({
    modal: Map({
        open: false,
        fetch: false
    }),
    data: List([])
});

export default handleActions({
	[ORDERER_ADD_MODAL_OPEN]: (state, action) => {
        const open = action.payload;

		return state.setIn(['modal', 'open'], open);
    },
	[ORDERER_DATA_FETCHING]: (state, action) => {
        const fetch = action.payload;

		return state.setIn(['modal', 'fetch'], fetch);
    },
	[ORDERER_DATA_SET]: (state, action) => {
        const { orderer } = action.payload;

        let data = state.get('data');
        if (!data.isEmpty()) {
            if (orderer.length === 'undefined') {
                if (data.findIndex((d) => d.get('name') === orderer.name) === -1) {
                    data = data.push(fromJS(orderer));
                    return state.set('data', data);
                }
            }
        }

        return state.set('data', fromJS(orderer));
    }
}, initialState);
