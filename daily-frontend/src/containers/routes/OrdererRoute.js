import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import OrdererWidget, { OrdererList, OrdererItem, OrdererAdd, OrdererAddModal } from 'components/Orderer';

import * as header from 'redux/modules/base/header';
import * as orderer from 'redux/modules/base/orderer';

import * as api from 'helpers/WebApi/orderer';

//import storage from 'helpers/storage';

class OrdererRoute extends Component {

    componentWillMount() {
        const { OrdererActions } = this.props;

        api.getOrdererAll()
        .then( (res) => {
            const orderers = res.data.orderers;

            OrdererActions.setOrdererData({orderers});
        })
        .catch( (err) => {
            OrdererActions.setOrdererData({orderers: null});            
        });
    }

    handleOpenAddModal = () => {
        const { OrdererActions, status: { orderer } } = this.props;
        if (!orderer.getIn(['modal', 'open'])) {
            OrdererActions.openAddOrdererModal(true);
        }
    }

    handleModalClose = () => {
        const { OrdererActions } = this.props;
        OrdererActions.openAddOrdererModal(false);
    }

	render() {
        const { handleOpenAddModal, handleModalClose } = this;
        const { children, status: { orderer } } = this.props;

        const orderers = orderer.get('data') ?
                orderer.get('data').forEach( (data) => (
                    <OrdererItem />
                )) : 'No Results...'
        
		return (
			<div className="orderer-wrapper">
                <OrdererWidget>
                    <OrdererAdd onAdd={handleOpenAddModal} />
                    <OrdererList>
                        {orderers}
                    </OrdererList>
                </OrdererWidget>
                {children}
                <OrdererAddModal
                    open={orderer.getIn(['modal', 'open'])}
                    onClose={handleModalClose}
                    
                />
			</div>
		);
	}
};

OrdererRoute = connect(
    state => ({
        status: {
            header: state.base.header,
            orderer: state.base.orderer
        }
    }),
    dispatch => ({
        HeaderActions: bindActionCreators(header, dispatch),
        OrdererActions: bindActionCreators(orderer, dispatch)
    })
 )(OrdererRoute);

export default OrdererRoute;