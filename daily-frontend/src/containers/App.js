import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Input } from 'semantic-ui-react';

import * as header from 'redux/modules/base/header';

import Header, { Logo, UserInfo } from 'components/Header';
import Sidebar, { MenuItem } from 'components/Sidebar';
import Contents from 'components/Content';

import storage from 'helpers/storage';

class App extends Component {

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

	handleLogOut = () => {
		if (storage.get('loginInfo')) {
			storage.remove('loginInfo');
			this.context.router.push('/login');
		}
	}

    render() {
    	const { handleLogOut } = this;
    	const { children, status: { header } } = this.props;
		const visible = header.get('visible');
		const username = storage.get('loginInfo') ? storage.get('loginInfo')['username'] : '';

        return (
			<div>
			{visible && 
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
				</div>
			}
			{!visible && children}
			</div>
        );
    }
}

App = connect(
    state => ({
        status: {
            header: state.base.header
        }
    }),
    dispatch => ({
        HeaderActions: bindActionCreators(header, dispatch)
    })
 )(App);

export default App;
