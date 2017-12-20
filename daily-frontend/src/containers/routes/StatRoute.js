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
        marginLeft: '10%',
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
            effect: 'ANIMATION_SLIDE_BOTTOM',
            method: 'ANIMATION_BOUNCE_EASE_OUT',
            sequence: 'ANIMATION_BY_PLOT_AND_NODE',
            speed: 500 //'ANIMATION_FAST'
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
		values: "0:50:10",
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
		filters: ['구미시', '김천시']
	}

	componentWillMount() {
		const { handleChangeCategory } = this;

		document.title = 'Daily Note - 통계';

		handleChangeCategory(null, { value: '근조화환'});
	}

	handleChangeCategory = async (e, data) => {
		const { state: { filters }} = this;

		this.setState({ selectedCategory: data.value, loading: true, series: [] });

		const result = await api.getCategoryStatistics(data.value, filters);

		const cdata = result.data.data;

		const yearValues = {};
		const yearSeries = [];
		
		if (!utils.empty(cdata)) {

			cdata.forEach((obj) => {
				let year = obj._id.split('-')[0];
				let month = parseInt(obj._id.split('-')[1], 10);

				if (!(year in yearValues)) {
					yearValues[year] = (new Array(12)).fill(0);
				}

				yearValues[year][(month-1)] = obj.count;
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
				series: yearSeries
			});
		}, 2000);
}

	render() {
		const { handleChangeCategory, state: { loading, selectedCategory, series }} = this;

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
								onChange={handleChangeCategory}/>}
					width="100%"
					className="category-graph"
				/>
			</div>
		);
	}
};

export default StatRoute;