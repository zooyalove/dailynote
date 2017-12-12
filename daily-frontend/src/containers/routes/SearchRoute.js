import React, { Component } from 'react';
import { Dimmer, Loader } from 'semantic-ui-react';

import SearchInput from 'components/SearchInput';
import DataList from 'components/DataList';

import * as api from 'helpers/WebApi/note';
import * as utils from 'helpers/utils';

class SearchRoute extends Component {
	state = {
		fetch: false,
		datas: null
	}

	componentWillMount() {
		document.title = 'Daily Note - 검색';
	}

	handleSearch = async (value) => {
		this.setState({ fetch: true, datas: null });

		const result = await api.searchNotes(value);
		const data = result.data.data;

		window.setTimeout(() => {
			this.setState({ fetch: false, datas: (utils.empty(data) ? null : data) });
		}, 2000);
	}

	render() {
		const { handleSearch, state: { datas, fetch } } = this;
		
		const lists = (<DataList datalist={datas} ordererView style={{marginTop: '2rem'}} />);

		return (
			<div className="subcontents-wrapper">
				<span style={{marginRight: '1rem', fontWeight: 'bold', fontSize: '1.4rem'}}>찾고자 하는 검색어 입력 :</span>
				<SearchInput placeholder="찾고 싶은 장부의 내용들을 검색해보세요!" icon onSearch={handleSearch}/>
				{ fetch && <Dimmer active><Loader>Data Loading...</Loader></Dimmer> }
				{lists}
			</div>
		);
	}
};

export default SearchRoute;