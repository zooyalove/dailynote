import React, { Component } from 'react';

class OrdererInfo extends Component {

    render() {
        const { noid, children } = this.props;
        return (
            <div className={`orderer_info${noid ? ' noid' : ''}`}>
                {children}
            </div>
        );
    }
}
 
export default OrdererInfo;