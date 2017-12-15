import React, { Component } from 'react';
import { Dimmer, Loader } from 'semantic-ui-react';
import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';

import MomentLocaleUtils from 'react-day-picker/moment';
import 'moment/locale/ko';

import SearchInput from 'components/SearchInput';
import DataList from 'components/DataList';
import Card from 'components/Card';

import * as api from 'helpers/WebApi/note';
import * as utils from 'helpers/utils';

class SearchRoute extends Component {
	state = {
		fetch: false,
		datas: null,
		monthData: [],
		searchTxt: null,
		selectedDays: null
	}

	componentWillMount() {
		document.title = 'Daily Note - 검색';

		this.getMonthNotes(new Date());
	}

	getMonthNotes = async (month) => {
		const date = month.getFullYear() + '-' + (month.getMonth()+1);
		const res = await api.getMonthNotes(date);
		const data = res.data.data;

		console.log(data);

		this.setState({ monthData: data });
	}

	handleSearch = async (value) => {
		this.setState({ fetch: true, datas: null, searchTxt: value, selectedDays: null });

		const result = await api.searchNotes(value);
		const data = result.data.data;

		window.setTimeout(() => {
			this.setState({ fetch: false, datas: (utils.empty(data) ? null : data) });
		}, 2000);
	}

	handlePickerSearch = async (day, { selected }) => {
		if (!selected) {
			let date = day.toLocaleDateString().replace(/ /g, '').replace(/\./g, '-');
			date = date.substring(0, date.length-1);

			this.setState({ fetch: true, datas: null, searchTxt: date, selectedDays: day });

			const result = await api.searchNotes(date);
			const data = result.data.data;

			window.setTimeout(() => {
				this.setState({ fetch: false, datas: (utils.empty(data) ? null : data) });
			}, 2000);
		}
	}

	render() {
		const { handleSearch, handlePickerSearch, state: { datas, fetch, searchTxt, selectedDays } } = this;
		
		const lists = (<DataList datalist={datas} ordererView style={{marginTop: '2rem'}} />);

		return (
			<div className="subcontents-wrapper flex">
				<div className="search-list-wrapper">
					<span style={{marginRight: '1rem', fontWeight: 'bold', fontSize: '1.4rem'}}>찾고자 하는 검색어 입력 :</span>
					<SearchInput placeholder="찾고 싶은 장부의 내용들을 검색해보세요!" icon onSearch={handleSearch}/>
					{ fetch && <Dimmer active><Loader>Data Loading...</Loader></Dimmer> }
					{ searchTxt && <div className="search-txt"><b>></b> 입력하신 검색어는 <span>{searchTxt}</span></div> }
					{ lists }
				</div>
				<Card className="day-picker">
					<DayPicker
						localeUtils={MomentLocaleUtils}
						locale="ko"
						selectedDays={selectedDays}
						todayButton="Go to Today"
						onDayClick={handlePickerSearch}
					/>
				</Card>
			</div>
		);
	}
};

export default SearchRoute;