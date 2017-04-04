import React from 'react';

const OrdererList = ({children}) => {
	return (
		<div className="orderer-list">
			<div className="orderer-title">거래처 리스트</div>
			{children}
		</div>
	);
};

export default OrdererList;