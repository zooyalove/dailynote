import React from 'react';
import { Link } from 'react-router';
import { Icon } from 'semantic-ui-react';

const OrdererItem = ({
    name,
    to,
    children,
    onItemClick
}) => {
    if (!name) {
        return (
            <div className="no-item">{children}</div>
        );
    }
    
    return (
        <Link to={`/orderer/${to}`}
            activeClassName="active"
            className="orderer-item"
            onClick={() => onItemClick(false)}
        >
            <div className="orderer-name">{name}</div>
            <div className="orderer-chevron">
                <Icon name="chevron right" />
            </div>
        </Link>
    );
};

export default OrdererItem;