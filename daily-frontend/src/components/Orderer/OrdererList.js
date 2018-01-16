import React from 'react';
import { Scrollbars } from 'react-custom-scrollbars';

const renderThumb = ({style, ...props}) => {
	const thumbStyle = {
		backgroundColor: 'rgba(255, 255, 255, .65)',
		borderRadius: '2px'
	};
	return (
		<div
			style={{ ...style, ...thumbStyle }}
			{...props}/>
	);
};

const OrdererList = ({active, children, count, selected, onListClick}) => {
	return (
		<div className="orderer-list">
			<div className="orderer-title">거래처 리스트 <span className="badges">{count}</span></div>
			<div className={`orderer-selected${active ? ' active' : ''}`} onClick={() => onListClick(!active)}>{selected}</div>
			<Scrollbars
				className={`orderer-list-scrollbar${active ? ' active' : ''}`}
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