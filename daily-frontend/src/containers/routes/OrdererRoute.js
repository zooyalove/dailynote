import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import OrdererWidget, { OrdererList, OrdererItem, OrdererAdd } from './../../components/Orderer';
import * as header from './../../redux/modules/base/header';

//import storage from './../../helpers/storage';

class OrdererRoute extends Component {

	render() {
        const { children } = this.props;
        
		return (
			<div className="orderer-wrapper">
                <OrdererWidget>
                    <OrdererAdd />
                    <OrdererList />
                </OrdererWidget>
                {children}
			</div>
		);
	}
};

OrdererRoute = connect(
    state => ({
        status: {
            header: state.base.header,
        }
    }),
    dispatch => ({
        HeaderActions: bindActionCreators(header, dispatch),
    })
 )(OrdererRoute);

export default OrdererRoute;