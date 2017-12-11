import React, { Component } from 'react';
import { Dimmer, Loader } from 'semantic-ui-react';

import SearchInput from 'components/SearchInput';

import * as api from 'helpers/WebApi/note';

class SearchRoute extends Component {
	state = {
		fetch: false
	}

	componentWillMount() {
		document.title = 'Daily Note - 검색';
	}

	handleSearch = async (value) => {
		this.setState({ fetch: true });

		const result = await api.searchNotes(value);
		
		window.setTimeout(() => this.setState({ fetch: false }), 3000);
	}

	render() {
		const { handleSearch, state: { fetch } } = this;
		return (
			<div className="subcontents-wrapper">
				<span style={{marginRight: '1rem', fontWeight: 'bold', fontSize: '1.4rem'}}>찾고자 하는 검색어 입력 :</span>
				<SearchInput placeholder="찾고 싶은 장부의 내용들을 검색해보세요!" icon onSearch={handleSearch}/>
				{ fetch && <Dimmer active><Loader>Data Loading...</Loader></Dimmer> }
			</div>
		);
	}
};

export default SearchRoute;