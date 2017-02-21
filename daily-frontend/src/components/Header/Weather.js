import React, { Component } from 'react';
import { Button } from 'semantic-ui-react';

class Weather extends Component {
    render() {
        const { children, cn } = this.props;
        
        return (
            <div className="weather-wrapper">
                <div className={`weather ${cn}`}>
                    {children}
                </div>
                <Button className="weather-search" icon="search" size="mini" color="orange" compact circular />
            </div>
        );
    }
}

export default Weather;
