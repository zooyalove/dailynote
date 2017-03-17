import React, { Component } from 'react';
import { Input } from 'semantic-ui-react';

class WriteRoute extends Component {

	render() {
		return (
			<div className="subcontents-wrapper">
				<h2 className="main-title">일일장부 등록</h2>
				<div className="write-container">
					<div className="write-row">
						<div className="write-label">주문자</div>
						<div className="write-content"><Input style={{width: '300px'}} /></div>
					</div>
				</div>
			</div>
		);
	}
};

export default WriteRoute;