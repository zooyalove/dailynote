import React, { Component } from 'react';
import { Form, Segment, Divider } from 'semantic-ui-react';

const numberArrayGenerator = (first, last, cb) => {
	let i=first,
		ag=[];

	for (i; i <= last; i++) {
		ag.push(String(i));
	}
	return ag.map(cb);
};

const map = (y, i) => {
	const ret = {};
	ret['text'] = ret['value'] = y;

	return ret;
};

const year = numberArrayGenerator(2015, 2017, map);

const month = numberArrayGenerator(1, 12, map);
const day = numberArrayGenerator(1, 31, map);

const style = {
	'margin': '0 .85714286em 0 0',
	'fontWeight': '700'
};

const orderer = [
	{text:'일선교통', value:'일선교통', key: 1},
	{text:'태림포장', value:'태림포장', key: 2},
	{text:'서구산업', value:'서구산업', key: 3},
	{text:'매장판매', value:'매장판매', key: 4},
	{text:'구미송설동창회', value:'구미송설동창회', key: 5}
];

class WriteRoute extends Component {

	handleChange = (e, data) => {
		console.log(data);
		console.log(data.name);
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
							name="orderer"
							placeholder="거래처를 입력 또는 선택하세요"
							search
							selection
							inline
							tabIndex="0"
							options={orderer}
							onSearchChange={handleChange}
							onChange={handleChange} />
						<Form.Input label="연락처"
							placeholder="주문자 연락처를 입력하세요"
							inline
							tabIndex="1"
							onChange={handleChange} />
					</Segment>
					<Segment color="red">
						<Form.Input
							label="받는 사람"
							placeholder="받는 사람 이름을 입력하세요"
							inline
							tabIndex="2" />
						<Form.Input label="연락처"
							placeholder="받는 사람 연락처를 입력하세요"
							name="recv_phone"
							inline
							tabIndex="3"
							onChange={handleChange} />
						<Divider />
						<div>
							<label style={style}>배송일자</label>
							<Form.Dropdown
								name="recv_year"
								placeholder="년도"
								selection
								inline
								className="noclear"
								tabIndex="4"
								options={year}
								onChange={handleChange} />{' '}<span style={style}>년</span>
							<Form.Dropdown 
								name="recv_month"
								placeholder="월"
								selection
								inline
								className="noclear"
								tabIndex="5"
								options={month}
								onChange={handleChange} />{' '}<span style={style}>월</span>
							<Form.Dropdown 
								name="recv_day"
								placeholder="일"
								selection
								inline
								className="noclear"
								tabIndex="6"
								options={day}
								onChange={handleChange} />{' '}<span style={style}>일</span>
						</div>
					</Segment>
				</Form>
			</div>
		);
	}
};

export default WriteRoute;