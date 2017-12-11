import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Dimmer, Icon } from 'semantic-ui-react';

import * as headerAction from 'redux/modules/base/header';
import * as ordererAction from 'redux/modules/base/orderer';

import Header, { Logo, UserInfo } from 'components/Header';
import Sidebar, { MenuItem } from 'components/Sidebar';
import Contents from 'components/Content';
import Fab from 'components/Fab';

import * as user from 'helpers/WebApi/user';
import storage from 'helpers/storage';

class App extends Component {

	state = {
		scrolling: false
	}

	static contextTypes = {
		router: React.PropTypes.object
	}

	componentWillMount() {
		const { HeaderActions, status: { header } } = this.props;

		user.getInfo()
			.then( (info) => {
				if (!header.get('visible')) {
					HeaderActions.openHeader();
				}
			})
			.catch( (err) => {
				this.context.router.push('/login');
			});
	}

	componentDidMount() {
		const { status: { header } } = this.props;

		if (header.get('visible')) {
			window.addEventListener('scroll', this.handleScroll);
		}
	}

	componentWillUnmount() {
		const { status: { header } } = this.props;
		
		if (header.get('visible')) {
			window.removeEventListener('scroll', this.handleScroll);
		}

		if(storage.get('loginInfo')) {
			storage.remove('loginInfo');
		}

	}

	handleLogOut = async () => {
		if (storage.get('loginInfo')) {
			await user.signOut();

			storage.remove('loginInfo');
			this.context.router.push('/login');
		}
	}

	handleScroll = (e) => {
		if (window.scrollY > 220 && !this.state.scrolling) {
			this.setState({scrolling: true});
		} else if (window.scrollY <= 210 && this.state.scrolling) {
			this.setState({scrolling: false});
		}
	}

	handleFabClick = () => {
		window.scrollTo(0, 0);
	}

    render() {
    	const { handleLogOut, handleFabClick } = this;
		const { children, status: { header, orderer } } = this.props;
		const { scrolling } = this.state;
		const visible = header.get('visible');
		const username = storage.get('loginInfo') ? storage.get('loginInfo')['username'] : '';

        return (
			<div>
			{visible
			? (
				<div>
					<Header>
						<Logo />
						<UserInfo username={username} onLogOut={handleLogOut} />
					</Header>
					<Sidebar>
						<MenuItem color="red" content="장부등록" icon="write" to="/write" />
						<MenuItem color="grape" content="거래처 관리" icon="users" to="/orderer" />
						<MenuItem color="green" content="장부검색" icon="search" to="/search" />
						<MenuItem color="blue" content="통계" icon="bar graph" to="/stat" />
					</Sidebar>
					<Contents>
						{children}
						{scrolling && <Fab onAction={handleFabClick}><Icon name="angle double up" size="big"/></Fab> }
					</Contents>
	                {orderer.getIn(['modal', 'fetch']) && 
	                <Dimmer active page>
	                    {orderer.getIn(['modal', 'message'])}
	                </Dimmer>
	                }
				</div>
			)
			: children
			}
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
