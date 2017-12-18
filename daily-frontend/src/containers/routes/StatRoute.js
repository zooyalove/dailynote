import React, { Component } from 'react';

import Card from 'components/Card';
import CategoryStatistics from 'components/CategoryStatistics';

import * as api from 'helpers/WebApi/note';

class StatRoute extends Component {

	state = {
		selectedCategory: '',
		filters: ['구미시', '김천시']
	}

	componentWillMount() {
		const { handleChangeCategory } = this;

		document.title = 'Daily Note - 통계';

		handleChangeCategory(null, { value: '근조화환'});
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
					title={<CategoryStatistics
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