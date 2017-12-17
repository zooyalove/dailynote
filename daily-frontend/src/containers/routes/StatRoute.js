import React, { Component } from 'react';
import { Dropdown } from 'semantic-ui-react';

import Card from 'components/Card';

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

const ProductTitle = () => {
	return (
		<div>
			▶ 상품종류별 현황
			<Dropdown
				selection
				placeholder="상품종류"
				options={productCategory.map((c, i) => { return {'key': i, 'text': c, 'value': c}; })}
			/>
		</div>
	);
};

class StatRoute extends Component {

	componentWillMount() {
		document.title = 'Daily Note - 통계';
	}

	render() {
		return (
			<div className="subcontents-wrapper">
				<Card
					className="category-graph"
					title={<ProductTitle />}
				>
					StatRoute 페이지입니다.
				</Card>
			</div>
		);
	}
};

export default StatRoute;