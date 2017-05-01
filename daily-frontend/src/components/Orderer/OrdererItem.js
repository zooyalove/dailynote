import React from 'react';
import { Icon } from 'semantic-ui-react';

const OrdererItem = ({name}) => {
    console.log(name);
    return (
        <div className="orderer-item">
            <div className="orderer-name">{name}</div>
            <div className="orderer-chevron">
                <Icon name="chevron right" />
            </div>
        </div>
    );
};

export default OrdererItem;