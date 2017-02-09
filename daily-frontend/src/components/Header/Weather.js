import React, { Component } from 'react';

class Weather extends Component {
    render() {
        const { children } = this.props;
        
        return (
            <div className="weather-wrapper">
                <div className="weather">
                    {children}
                </div>
            </div>
        );
    }
}

export default Weather;
