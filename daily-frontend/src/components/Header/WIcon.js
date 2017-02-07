import React, { Component } from 'react';

class WIcon extends Component {

    render() {
        const { name } = this.props;

        return (
            <i className={`wi wi-${name} ic`}></i>
        );
    }
}

export default WIcon;