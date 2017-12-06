import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';

import * as header from 'redux/modules/base/header';

import storage from 'helpers/storage';
import * as api from 'helpers/WebApi/note';

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

	getTodayData = async () => {
		const result = await api.getTodayNotes();
		console.log(result);
	}

	render() {
		const { getTodayData } = this;
		getTodayData().catch( (err) => console.log(err) );

		return (
			<div className="subcontents-wrapper">
				<h3>오늘 ({moment().format("YYYY-MM-DD")})의 주문내역</h3>
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