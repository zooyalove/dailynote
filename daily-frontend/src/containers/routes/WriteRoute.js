import React, { Component } from 'react';
import { Form } from 'semantic-ui-react';

class WriteRoute extends Component {

	render() {
		return (
			<div className="subcontents-wrapper">
				<h2 className="main-title">일일장부 등록</h2>
				<Form>
					<Form.Dropdown
						label="주문자"
						placeholder="거래처를 입력 또는 선택하세요"
						search
						selection
						inline />
					<Form.Input label="연락처" placeholder="" />
				</Form>
			</div>
		);
	}
};

export default WriteRoute;