import React, { Component } from 'react';

class StatRoute extends Component {

	componentWillMount() {
		document.title = 'Daily Note - 통계';
	}

	render() {
		return (
			<div>
				StatRoute 페이지입니다.
			</div>
		);
	}
};

export default StatRoute;