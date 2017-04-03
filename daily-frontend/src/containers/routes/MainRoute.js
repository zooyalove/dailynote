import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as header from './../../redux/modules/base/header';

import storage from './../../helpers/storage';

class MainRoute extends Component {
    static contextTypes = {
        router: React.PropTypes.object
    }

	componentWillMount() {
		const { HeaderActions, status: { header } } = this.props;

		if (!storage.get('loginInfo')) {
			this.context.router.push('/login');
		} else {
			if (!header.get('visible')) {
				HeaderActions.openHeader();
			}
		}
	}

	render() {
		return (
			<div className="subcontents-wrapper">
				MainRoute 페이지입니다.
			</div>
		);
	}
};

MainRoute = connect(
    state => ({
        status: {
            header: state.base.header,
        }
    }),
    dispatch => ({
        HeaderActions: bindActionCreators(header, dispatch),
    })
 )(MainRoute);

export default MainRoute;