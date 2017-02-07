import React, { Component } from 'react';
import { Button } from 'semantic-ui-react';

class Weather extends Component {
    render() {
        return (
            <div className="weather-wrapper">
                <Button.Group>
                    <Button>현재 구미의 날씨는 : </Button>
                    <Button icon="search" color="grey" />
                </Button.Group>
            </div>
        );
    }
}

export default Weather;
