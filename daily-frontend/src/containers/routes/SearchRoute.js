import React, { Component } from 'react';
import { Dimmer, Loader, Button } from 'semantic-ui-react';
import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';

import MomentLocaleUtils from 'react-day-picker/moment';
import 'moment/locale/ko';

import SearchInput from 'components/SearchInput';
import DataTable from 'components/DataTable';
import Card from 'components/Card';

import * as api from 'helpers/WebApi/note';
import * as utils from 'helpers/utils';

class SearchRoute extends Component {
	state = {
		fetch: false,
		datas: [],
		monthData: [],
		searchTxt: null,
		selectedDays: null,
		selectedMonth: null,
		calendarActive: false
	}

	componentWillMount() {
		document.title = 'Daily Note - 검색';

		this.getMonthNotes(new Date());
	}

	getMonthNotes = async (month) => {
		this.setState({ selectedMonth: `${month.getFullYear()}-${month.getMonth()}`});

		const date = month.getFullYear() + '-' + (month.getMonth()+1);
		const res = await api.getMonthNotes(date);
		const data = res.data.data;

		const monthData = [];

		if (data.length > 0) {
			data.forEach( (d) => {
				monthData.push(d._id);
			});
		}

		this.setState({ monthData });
	}

	existOrder = (day) => {
		const { state: { monthData, selectedMonth }} = this;
		const yearMonth = `${day.getFullYear()}-${day.getMonth()}`;

		return monthData.includes(day.getDate()) && selectedMonth === yearMonth;
	}

	handleSearch = async (value) => {
		this.setState({ fetch: true, datas: [], searchTxt: value, selectedDays: null });

		const result = await api.searchNotes(value);
		const data = result.data.data;

		window.setTimeout(() => {
			this.setState({ fetch: false, datas: (utils.empty(data) ? [] : data) });
		}, 2000);
	}

	handlePickerSearch = async (day, { selected }) => {
		if (!selected) {
			let date = day.toLocaleDateString().replace(/ /g, '').replace(/\./g, '-');
			date = date.substring(0, date.length-1);

			this.setState({ fetch: true, datas: [], searchTxt: date, selectedDays: day });

			const result = await api.searchNotes(date);
			const data = result.data.data;

			window.setTimeout(() => {
				this.setState({ fetch: false, datas: (utils.empty(data) ? [] : data),  calendarActive: false});
			}, 2000);
		}
	}

	render() {
		const { existOrder, getMonthNotes, handleSearch, handlePickerSearch, state: { datas, fetch, searchTxt, selectedDays, calendarActive } } = this;
		
		let total = 0;
		
		if (datas) {
			datas.forEach( (d) => {
				total += d.delivery.price;
			});
		}

		return (
			<div className="subcontents-wrapper flex">
				<div className="search-list-wrapper">
					<span style={{marginRight: '1rem', fontWeight: 'bold', fontSize: '1.4rem'}}>찾고자 하는 검색어 입력 :</span>
					<SearchInput placeholder="찾고 싶은 장부의 내용들을 검색해보세요!" icon onSearch={handleSearch}/>
					{ fetch && <Dimmer active><Loader>Data Loading...</Loader></Dimmer> }
					{ searchTxt && <div className="search-txt"><b>▶</b> 입력하신 검색어는 <span>{searchTxt}</span></div> }
					<div className="total-price-wrapper">총합계 <span className="price">{total === 0 ? total : total.toLocaleString()}</span>원</div>
					<DataTable
						datas={datas}
						countPerPage={10}
						displayPage={5}
						ordererView
						style={{marginTop: '2rem'}} />
				</div>
				<div className="day-picker">
					<Button circular icon="calendar" className={`calendar-icon${calendarActive ? ' active' : ''}`} onClick={() => this.setState({ calendarActive: !calendarActive })} />
					<Card className={`${calendarActive ? 'active' : ''}`}>
						<DayPicker
							localeUtils={MomentLocaleUtils}
							locale="ko"
							modifiers={{ existOrder }}
							selectedDays={selectedDays}
							todayButton="Go to Today"
							onMonthChange={getMonthNotes}
							onDayClick={handlePickerSearch}
						/>
					</Card>
				</div>
			</div>
		);
	}
};

export default SearchRoute;