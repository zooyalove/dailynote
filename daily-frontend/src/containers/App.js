import React, { Component } from 'react';
// import { connect } from 'react-redux';
// import { bindActionCreators } from 'redux';

import Header, { Logo } from '../components/Header';
import Sidebar, { MenuItem } from '../components/Sidebar';
import Contents from '../components/Content';


class App extends Component {

    render() {
    	const { children } = this.props;

        return (
        	<div>
            	<Header>
            		<Logo />
            	</Header>
				<Sidebar>
					<MenuItem icon="write" to="/write" />
					<MenuItem icon="users" to="/users" className="active" />
					<MenuItem icon="bar graph" to="/stat" />
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
