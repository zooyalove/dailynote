import React from 'react';

const OrdererList = ({children}) => {
	return (
		<div className="orderer-list">
			<div className="orderer-title">거래처 리스트</div>
			<div className="orderer-list-item">
				{children}
			</div>
		</div>
	);
};

export default OrdererList;