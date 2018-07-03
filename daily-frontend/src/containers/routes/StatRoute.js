import React, { Component } from 'react';

import ChartCard from 'components/ChartCard';
import CategoryStatistics from 'components/CategoryStatistics';

import * as api from 'helpers/WebApi/note';
import * as utils from 'helpers/utils';

const lineChartOptions = {
    legend: {
        layout: '1x2',
        align: 'center'
        // x: '50%',
        // y: '5%'
    },
    plotarea:{
        marginTop: '7%',
        marginLeft: '6%',
        marginRight: '6%',
        marginBottom: '10%'
    },
    tooltip: {
        thousandsSeparator: ','
    },
    plot: {
		aspect: 'spline',
        animation: {
            delay: 400,
            // effect: 'ANIMATION_SLIDE_BOTTOM',
            method: 'ANIMATION_BOUNCE_EASE_OUT',
            sequence: 'ANIMATION_BY_PLOT_AND_NODE',
            speed: 20 //'ANIMATION_FAST'
        }
    },
    scaleX: {
        minValue: (new Date((new Date()).getFullYear() + '-1-2')).getTime(),
        step: 'month',
        transform: {
            type: 'date',
            all: '%m月'
        },
        maxItems: 12
    },
    scaleY: {
		// values: "0:40:10",
        guide: {
            'line-style': 'dotted'
        }
    },
    utc: true,
    timezone: 9
};

class StatRoute extends Component {

	state = {
		loading: true,
		selectedCategory: '',
		series: [],
		filters: [],
		detailData: null
	}

	componentWillMount() {
		const { handleChangeCategory } = this;

		document.title = 'Daily Note - 통계';

		handleChangeCategory(null, { value: '근조화환'});
	}

	handleChangeCategory = async (e, data) => {
		const { state: { selectedCategory, filters }} = this;

		let result;

		if (data === undefined || data.value === undefined) {
			this.setState({ loading: true, series: [], detailData: null });
			result = await api.getCategoryStatistics(selectedCategory, filters);
		} else {
			this.setState({ selectedCategory: data.value, loading: true, series: [], detailData: null });
			result = await api.getCategoryStatistics(data.value, filters);
		}

		const cdata = result.data.data;

		const yearValues = {};
		const yearSeries = [];
		const detailData = {};
		
		if (!utils.empty(cdata)) {

			cdata.forEach((obj) => {
				let year = obj._id.split('-')[0];
				let month = parseInt(obj._id.split('-')[1], 10);

				if (!(year in yearValues)) {
					yearValues[year] = (new Array(12)).fill(0);
				}

				yearValues[year][(month-1)] = obj.count;

				obj.detail.forEach( (d) => {
					if ( !(d.price in detailData) ) {
						detailData[d.price] = d.count;
					} else {
						detailData[d.price] += d.count;
					}
				});
			});

			Object.keys(yearValues).forEach((y) => {
				yearSeries.push({
					values: yearValues[y],
					'legend-text': y
				});
			});
		}

		setTimeout(() => {
			this.setState({
				loading: false,
				series: yearSeries,
				detailData
			});
		}, 2000);
	}

	handleAddFilter = (filterText) => {
		const { handleChangeCategory, state: { filters }} = this;

		if (!utils.empty(filterText)) {
			if (filterText.indexOf(" ") !== -1) {
				let splitText = filterText.split(" ");
				let copyFilters = filters;

				splitText.forEach( (t) => {
					if (copyFilters.indexOf(t) === -1) {
						copyFilters.push(t);
					}
				});

				this.setState({
					filters: copyFilters
				});
			} else {
				let copyFilters = filters;

				if (copyFilters.indexOf(filterText) === -1) {
					copyFilters.push(filterText);

					this.setState({
						filters: copyFilters
					});
				}
			}

			handleChangeCategory();
		}
	}

	handleDeleteFilter = (filterText) => {
		const { handleChangeCategory, state: { filters }} = this;
		const i = filters.indexOf(filterText);
		let copyFilters = filters;
		copyFilters.splice(i, 1);

		this.setState({
			filters: copyFilters
		});

		handleChangeCategory();
	}

	render() {
		const { handleChangeCategory, handleAddFilter, handleDeleteFilter } = this;
		const { filters, loading, selectedCategory, series, detailData } = this.state;

		const detailKeys = !utils.empty(detailData) ? Object.keys(detailData) : [];
		detailKeys.sort( (a, b) => parseInt(a, 10) > parseInt(b, 10) ? -1 : 1 );

		const Detail = ({
			price,
			count
		}) => {
			return (
				<div className="detail-content">{price} 원 <div className="detail-count">{count}</div></div>
			);
		};
		const detail = detailKeys.map( (d, i) => {
			return <Detail key={i} price={parseInt(d, 10).toLocaleString()} count={detailData[d]} />
		});

		return (
			<div className="subcontents-wrapper">
				<ChartCard
					id="category-chart"
					loading={loading}
					type="line"
					options={lineChartOptions}
					series={series}
					title={<CategoryStatistics
								value={selectedCategory}
								filter={filters}
								onChange={handleChangeCategory}
								onEnterKeyUp={handleAddFilter}
								onAddFilter={handleAddFilter}
								onDeleteFilter={handleDeleteFilter}
							/>}
					width="100%"
					className="category-graph"
				>
					<div className="category-detail">
						<h3 className="detail-title">금액별 배송현황</h3>
						{detail}
					</div>
				</ChartCard>
			</div>
		);
	}
};

export default StatRoute;