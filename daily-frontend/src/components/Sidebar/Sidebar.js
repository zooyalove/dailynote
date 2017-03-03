import React, { Component } from 'react';

class Sidebar extends Component {

    render() {
        const { children } = this.props;
        return (
            <nav>
                <ul>
                    {children}
                </ul>
            </nav>
        );
    }
}

export default Sidebar;