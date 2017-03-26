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
					<Segment color="blue">
						<Form.Dropdown
							label="주문자"
							placeholder="거래처를 입력 또는 선택하세요"
							search
							selection
							inline
							tabindex="0"
							onSearchChange={handleChange} />
						<Form.Input label="연락처"
							placeholder="주문자 연락처를 입력하세요"
							inline
							tabindex="1"
							onChange={handleChange} />
					</Segment>
					<Segment color="red">
						<Form.Input
							label="받는 사람"
							placeholder="받는 사람 이름을 입력하세요"
							inline
							tabindex="2" />
						<Form.Input label="연락처"
							placeholder="받는 사람 연락처를 입력하세요"
							inline
							tabindex="3"
							onChange={handleChange} />
					</Segment>
				</Form>
			</div>
		);
	}
};

export default WriteRoute;