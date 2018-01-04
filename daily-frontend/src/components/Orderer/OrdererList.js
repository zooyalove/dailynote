import React from 'react';
import { Scrollbars } from 'react-custom-scrollbars';

const renderThumb = ({style, ...props}) => {
	const thumbStyle = {
		backgroundColor: 'rgba(255, 255, 255, .65)'
	};
	return (
		<div
			style={{ ...style, ...thumbStyle }}
			{...props}/>
	);
};

const OrdererList = ({children, count}) => {
	return (
		<div className="orderer-list">
			<div className="orderer-title">거래처 리스트 <span className="badges">{count}</span></div>
			<Scrollbars
				// style={{ height: '42.5rem' }}
				className="orderer-list-scrollbar"
				autoHide
				renderThumbVertical={renderThumb}
				renderThumbHorizontal={renderThumb}>
				<div className="orderer-list-item">
					{children}
				</div>
			</Scrollbars>
		</div>
	);
};

export default OrdererList;