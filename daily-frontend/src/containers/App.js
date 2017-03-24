import React, { Component } from 'react';
// import { connect } from 'react-redux';
// import { bindActionCreators } from 'redux';
import { Input } from 'semantic-ui-react';

import Header, { Logo } from '../components/Header';
import Sidebar, { MenuItem } from '../components/Sidebar';
import Contents from '../components/Content';


class App extends Component {

	// static contextTypes = {
	// 	router: React.PropTypes.object
	// }


    render() {
    	const { children } = this.props;

        return (
        	<div>
            	<Header>
            		<Logo />
					<Input className="quick-search" icon="search" placeholder="빠른 검색" />
            	</Header>
				<Sidebar>
					<MenuItem color="red" icon="write" to="/write" />
					<MenuItem color="grape" icon="users" to="/orderer" />
					<MenuItem color="green" icon="search" to="/search" />
					<MenuItem color="blue" icon="bar graph" to="/stat" />
				</Sidebar>
				<Contents>
					{children}
				</Contents>
            </div>
        );
    }
}

// App = connect(
//     state => ({
//         status: {
//             weather: state.header.weather
//         }
//     }),
//     dispatch => ({
//         WeatherActions: bindActionCreators(weather, dispatch)
//     })
// )(App);

export default App;
