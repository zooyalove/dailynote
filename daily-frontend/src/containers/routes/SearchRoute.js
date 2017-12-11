import React, { Component } from 'react';

class SearchRoute extends Component {

	componentWillMount() {
		document.title = 'Daily Note - 검색';
	}

	render() {
		return (
			<div>
				SearchRoute 페이지입니다.
			</div>
		);
	}
};

export default SearchRoute;