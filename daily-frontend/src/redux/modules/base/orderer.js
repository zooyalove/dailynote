import { createAction, handleActions } from 'redux-actions';
import { Map } from 'immutable';

/* actions */
const ORDERER_ADD_MODAL_OPEN = "orderer/ORDERER_ADD_MODAL_OPEN";
const ORDERER_DATA_SET = "orderer/ORDERER_DATA_SET";

/* action creators */
export const openAddOrdererModal = createAction(ORDERER_ADD_MODAL_OPEN);
export const setOrdererData = createAction(ORDERER_DATA_SET);

const initialState = Map({
    modal: Map({
        open: false
    }),
    data: null
});

export default handleActions({
	[ORDERER_ADD_MODAL_OPEN]: (state, action) => {
        const open = action.payload;

		return state.setIn(['modal', 'open'], open);
    },
	[ORDERER_DATA_SET]: (state, action) => {
        const { orderers } = action.payload;

		return state.set('data', orderers);
    }
}, initialState);
