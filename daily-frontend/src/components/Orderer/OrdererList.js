import React from 'react';

const OrdererList = ({children, count}) => {
	return (
		<div className="orderer-list">
			<div className="orderer-title">거래처 리스트 ({count})</div>
			<div className="orderer-list-item">
				{children}
			</div>
		</div>
	);
};

export default OrdererList;