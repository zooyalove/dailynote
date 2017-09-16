import React from 'react';
import { Icon } from 'semantic-ui-react';

const OrdererItem = ({name, children}) => {
    return (
        <div className={`orderer-item${(name === undefined)? ' no-item' : ''}`}>
            <div className="orderer-name">{name || children}</div>
            {name && (
            <div className="orderer-chevron">
                <Icon name="chevron right" />
            </div>
            )}
        </div>
    );
};

export default OrdererItem;