import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Icon, Loader } from 'semantic-ui-react';

import OrdererWidget, { OrdererList, OrdererItem, OrdererAdd, OrdererAddModal } from 'components/Orderer';

import * as headerAction from 'redux/modules/base/header';
import * as ordererAction from 'redux/modules/base/orderer';

import * as api from 'helpers/WebApi/orderer';

class OrdererRoute extends Component {

    componentWillMount() {
        const { OrdererActions } = this.props;

        api.getOrdererAll()
        .then( (res) => {
            const orderer = res.data.orderers;

            OrdererActions.setOrdererData({orderer});
        })
        .catch( (err) => {
            OrdererActions.setOrdererData({orderer: []});            
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

    handleOrdererAdd = async (formdata) => {
		const { OrdererActions } = this.props;
		const { handleModal } = this;

		OrdererActions.fetchingOrdererData({fetch: true, message: (<Loader>거래처 정보 업데이트중...</Loader>)});

		await api.addOrderer(formdata)
			.then( (res) => {
				console.log('Orderer Add : ', res);
				const orderer = res.data.orderer;
				OrdererActions.setOrdererData({orderer});
			}, (err) => {
				console.log(err.response.data.error);
			});
		
		OrdererActions.fetchingOrdererData({fetch: true, message: (<div><Icon name="checkmark" color="green" /> 거래처 등록완료!!!</div>)});

		setTimeout(() => {
			OrdererActions.fetchingOrdererData({fetch: false, message: ''});
			handleModal.close();
		}, 1500);
	}

	render() {
        const { handleModal, handleOrdererAdd } = this;
        const { children, status: { orderer } } = this.props;

        const orderers = (orderer.get('data') && orderer.get('data').size > 0) ?
                orderer.get('data').map( (data, index) => {
                    return (<OrdererItem key={index} name={data.get('name')} to={data.get('_id')} />);
                }) : (<OrdererItem>No Results...</OrdererItem>);
        
		return (
			<div className="orderer-wrapper">
                <OrdererWidget>
                    <OrdererAdd onAdd={handleModal.open} />
                    <OrdererList count={orderers.size ? orderers.size : 0}>
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
        HeaderActions: bindActionCreators(headerAction, dispatch),
        OrdererActions: bindActionCreators(ordererAction, dispatch)
    })
 )(OrdererRoute);

export default OrdererRoute;