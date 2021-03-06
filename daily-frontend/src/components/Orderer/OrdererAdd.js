import React from 'react';
import { Icon } from 'semantic-ui-react';

const OrdererAdd = ({onAdd}) => {
    return (
        <div className="orderer-add">
            <div className="add-btn" onClick={onAdd}>
                <Icon name="add user" /><span>거래처 추가</span>
            </div>
        </div>
    );
};

export default OrdererAdd;