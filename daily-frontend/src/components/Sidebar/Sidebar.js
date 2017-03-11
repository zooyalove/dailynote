import React, { Component } from 'react';

class Sidebar extends Component {

    render() {
        const { children } = this.props;
        return (
            <nav>
                {children}
            </nav>
        );
    }
}

export default Sidebar;