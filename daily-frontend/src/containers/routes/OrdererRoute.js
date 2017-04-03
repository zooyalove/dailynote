import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as header from './../../redux/modules/base/header';

//import storage from './../../helpers/storage';

class OrdererRoute extends Component {

	render() {
		return (
			<div className="orderer-wrapper">
				OrdererRoute 페이지입니다.
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