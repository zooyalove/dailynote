import React, { Component } from 'react';
import { Form, Segment } from 'semantic-ui-react';

class WriteRoute extends Component {

	handleChange = (e, data) => {
		console.log(e.target.name);
		console.log(data);
	}

	render() {
		const { handleChange } = this;
		return (
			<div className="subcontents-wrapper">
				<h2 className="main-title">일일장부 등록</h2>
				<Form>
					<Segment color='blue'>
						<Form.Dropdown
							label="주문자"
							placeholder="거래처를 입력 또는 선택하세요"
							search
							selection
							inline
							onSearchChange={handleChange} />
						<Form.Input label="연락처" placeholder="" inline onChange={handleChange} />
					</Segment>
				</Form>
			</div>
		);
	}
};

export default WriteRoute;