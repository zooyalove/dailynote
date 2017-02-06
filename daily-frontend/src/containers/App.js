import React, { Component } from 'react';
import Header, { Weather, Logo } from '../components/Header/Header';

class App extends Component {
    render() {
    	const { children } = this.props;

        return (
        	<div>
            	<Header>
            		<Logo />
            		<Weather />
            	</Header>
            	<div className="content-wrapper">
            		{children}
            	</div>
            </div>
        );
    }
}

export default App;
