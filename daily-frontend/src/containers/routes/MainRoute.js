import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import { Dimmer, Loader } from 'semantic-ui-react';

import DataList from 'components/DataList';

import * as header from 'redux/modules/base/header';

import storage from 'helpers/storage';
import * as api from 'helpers/WebApi/note';

class MainRoute extends Component {
    static contextTypes = {
        router: React.PropTypes.object
	}
	
	state = {
		datas: null,
		fetch: true
	}

	componentWillMount() {
		const { HeaderActions, status: { header } } = this.props;

		document.title = 'Daily Note - 홈';

		if (!storage.get('loginInfo')) {
			this.context.router.push('/login');
		} else {
			if (!header.get('visible')) {
				HeaderActions.openHeader();
			}
		}
	}

	componentDidMount() {
		window.setTimeout(this.getTodayData, 2000);
	}

	getTodayData = () => {
		const result = api.getTodayNotes();

		result
			.then( (res) => {
				this.setState({
					datas: res.data.data,
					fetch: false
				});
			})
			.catch( (err) => {
				this.setState({ fetch: false });
			});
	}

	render() {
		const { state: { datas, fetch } } = this;
		let total = 0;
		if (datas) {
			datas.forEach( (d) => {
				total += d.delivery.price;
			});
		}

		const lists = (<DataList datalist={datas} ordererView />);

		return (
			<div className="subcontents-wrapper">
				<h3>오늘 ({moment().format("YYYY-MM-DD")})의 주문내역</h3>
				<div className="total-price-wrapper">총합계 <span className="price">{total === 0 ? total : total.toLocaleString()}</span>원</div>
				{fetch && <Dimmer active><Loader>Data Loading...</Loader></Dimmer>}
				{lists}
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