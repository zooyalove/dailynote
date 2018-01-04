import React from 'react';

const OrdererInfo = ({
    noid,
    children
}) => {
    return (
        <div className={`orderer_info_wrapper${noid ? ' noid' : ''}`}>
            <div className={`${!noid ? 'orderer_info' : ''}`}>
                {children}
            </div>
        </div>
    );
}
 
export default OrdererInfo;