import React from 'react';

const OrdererInfo = ({noid, children}) => {
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
 
export default OrdererInfo;