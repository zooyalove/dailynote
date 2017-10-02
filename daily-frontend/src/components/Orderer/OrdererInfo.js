import React, { Component } from 'react';

class OrdererInfo extends Component {

    render() {
        const { noid, children } = this.props;
        return (
            <div className={`orderer_info_wrapper${noid ? ' noid' : ''}`}>
                {!noid && (
                    <div className="orderer_info">
                        {children}
                    </div>
                )}
                {noid && (
                    <div>
                        {children}
                    </div>
                )}
            </div>
        );
    }
}
 
export default OrdererInfo;