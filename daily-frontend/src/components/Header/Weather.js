import React, { Component } from 'react';

class Weather extends Component {
    render() {
        const { children, cn } = this.props;
        
        return (
            <div className="weather-wrapper">
                <div className={`weather ${cn}`}>
                    {children}
                </div>
            </div>
        );
    }
}

export default Weather;
