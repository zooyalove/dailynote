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
            // console.log(res);
            const orderer = res.data.orderers;

            OrdererActions.setOrdererData({orderer});
        })
        .catch( (err) => {
            OrdererActions.setOrdererData({orderers: null});            
        });
    }

    handleModal = (() => {
        const { OrdererActions, status: { orderer } } = this.props;
        return {
            open: () => {
                if (!orderer.getIn(['modal', 'open'])) {
                    OrdererActions.openAddOrdererModal(true);
                }
            },

            close: () => {
                OrdererActions.openAddOrdererModal(false);
            }
        };
    })()

    handleOrdererAdd = (formdata) => {
        const { OrdererActions } = this.props;

        api.addOrderer(formdata)
        .then( (res) => {
            console.log('Orderer Add : ', res);
            const orderer = res.data.orderer;
            OrdererActions.setOrdererData({orderer});
        }, (err) => {
            console.log(err.response.data.error);
        });
    }

	render() {
        const { handleModal, handleOrdererAdd } = this;
        const { children, status: { orderer } } = this.props;

        const orderers = orderer.get('data') ?
                orderer.get('data').map( (data, index) => {
                    console.log('Orderers : ', data);
                    return (<OrdererItem key={index} name={data.name} />);
                }) : 'No Results...'
        
		return (
			<div className="orderer-wrapper">
                <OrdererWidget>
                    <OrdererAdd onAdd={handleModal.open} />
                    <OrdererList>
                        {orderers}
                    </OrdererList>
                </OrdererWidget>
                {children}
                <OrdererAddModal
                    open={orderer.getIn(['modal', 'open'])}
                    className="bounceInUp"
                    onClose={handleModal.close}
                    onOrdererAdd={handleOrdererAdd}
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