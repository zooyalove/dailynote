import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Input, Dimmer, Loader } from 'semantic-ui-react';

import * as headerAction from 'redux/modules/base/header';
import * as ordererAction from 'redux/modules/base/orderer';

import Header, { Logo, UserInfo } from 'components/Header';
import Sidebar, { MenuItem } from 'components/Sidebar';
import Contents from 'components/Content';

import * as user from 'helpers/WebApi/user';
import storage from 'helpers/storage';

class App extends Component {

	static contextTypes = {
		router: React.PropTypes.object
	}

	componentWillMount() {
		const { HeaderActions, status: { header } } = this.props;

		user.getInfo()
			.then( (info) => {
				console.log(info);
				if (!header.get('visible')) {
					HeaderActions.openHeader();
				}
			})
			.catch( (err) => {
				console.log(err);
				this.context.router.push('/login');
			});
	}

	componentWillUnmount() {
		if(storage.get('loginInfo')) {
			storage.remove('loginInfo');
		}
	}

	handleLogOut = () => {
		if (storage.get('loginInfo')) {
			storage.remove('loginInfo');
			this.context.router.push('/login');
		}
	}

    render() {
    	const { handleLogOut } = this;
    	const { children, status: { header, orderer } } = this.props;
		const visible = header.get('visible');
		const username = storage.get('loginInfo') ? storage.get('loginInfo')['username'] : '';

        return (
			<div>
			{visible && (
				<div>
					<Header>
						<Logo />
						<UserInfo username={username} onLogOut={handleLogOut} />
						<Input className="quick-search" icon="search" placeholder="빠른 검색" />
					</Header>
					<Sidebar>
						<MenuItem color="red" content="장부등록" icon="write" to="/write" />
						<MenuItem color="grape" content="거래처 관리" icon="users" to="/orderer" />
						<MenuItem color="green" content="장부검색" icon="search" to="/search" />
						<MenuItem color="blue" content="통계" icon="bar graph" to="/stat" />
					</Sidebar>
					<Contents>
						{children}
					</Contents>
	                {orderer.getIn(['modal', 'fetch']) && 
	                <Dimmer active page>
	                    <Loader>{orderer.getIn(['modal', 'message'])}</Loader>
	                </Dimmer>
	                }
				</div>
				)
			}
			{!visible && children}
			</div>
        );
    }
}

App = connect(
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
 )(App);

export default App;
