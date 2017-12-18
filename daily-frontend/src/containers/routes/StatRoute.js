import React, { Component } from 'react';
import { Dropdown } from 'semantic-ui-react';

import Card from 'components/Card';

import * as api from 'helpers/WebApi/note';

const productCategory = [
	'꽃다발',
	'꽃바구니',
	'꽃상자',
	'동양란',
	'서양란',
	'관엽식물',
	'영정바구니',
	'근조화환',
	'축하화환',
	'과일바구니',
	'기타'
];

const ProductTitle = ({
	value,
	onChange
}) => {
	return (
		<div>
			▶ 상품종류별 현황
			<Dropdown
				selection
				placeholder="상품종류"
				options={productCategory.map((c, i) => { return {'key': i, 'text': c, 'value': c}; })}
				value={value}
				onChange={onChange}
			/>
		</div>
	);
};

class StatRoute extends Component {

	state = {
		selectedCategory: '근조화환',
		filters: []
	}

	componentWillMount() {
		document.title = 'Daily Note - 통계';
	}

	handleChangeCategory = async (e, data) => {
		const { state: { filters }} = this;

		this.setState({ selectedCategory: data.value });

		const result = await api.getCategoryStatistics(data.value, filters);

		console.log(result);
	}

	render() {
		const { handleChangeCategory, state: { selectedCategory }} = this;

		return (
			<div className="subcontents-wrapper">
				<Card
					className="category-graph"
					title={<ProductTitle
								value={selectedCategory}
								onChange={handleChangeCategory}
							/>}
				>
					StatRoute 페이지입니다.
				</Card>
			</div>
		);
	}
};

export default StatRoute;