import React, { Component } from 'react';
import Header, { Weather, Logo, WIcon } from '../components/Header/Header';

class App extends Component {
    render() {
    	const { children } = this.props;

        return (
        	<div>
            	<Header>
            		<Logo />
            		<Weather>
						<b style={{marginRight:'0.5rem'}}>02.08.(수) 현재 구미의 날씨는</b>
						<WIcon name="day-rain"/>
					</Weather>
            	</Header>
            	<div className="content-wrapper">
            		{children}
            	</div>
            </div>
        );
    }
}

export default App;
