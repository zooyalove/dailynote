import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import { Loader } from 'semantic-ui-react';

import DataList from 'components/DataList';

import * as header from 'redux/modules/base/header';

import storage from 'helpers/storage';
import * as api from 'helpers/WebApi/note';

class MainRoute extends Component {
    static contextTypes = {
        router: React.PropTypes.object
	}
	
	state = {
		datas: null
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

	componentDidMount() {
		const { getTodayData } = this;
		getTodayData();
	}

	getTodayData = async () => {
		const result = await api.getTodayNotes();
		if (result.data !== undefined) { 
			this.setState({datas: result.data.data});
		}
	}

	render() {
		const { state: { datas } } = this;
		const lists = (<DataList datalist={datas} ordererView />);

		return (
			<div className="subcontents-wrapper">
				<h3>오늘 ({moment().format("YYYY-MM-DD")})의 주문내역</h3>
				{datas
					? lists
					: <Loader active />
				}
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