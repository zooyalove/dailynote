import React, { Component } from 'react';

import { OrdererInfo } from 'components/Orderer';
import ChartCard from 'components/ChartCard';

import * as api from 'helpers/WebApi/orderer';
import * as utils from 'helpers/utils';

const initialState = {
    priceChart: {
        loading: true,
        series: []
    },
    yearChart: {
        loading: true,
        series: []
    }
};

const barChartOptions = {
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
        guide: {
            'line-style': 'dotted'
        },
        thousandsSeparator: ','
    },
    utc: true,
    timezone: 9
};

const pieChartOptions = {
    legend: {},
    plot: {
        slice: '70%',
        refAngle: 120,
        valueBox: [{
                type: 'all',
                placement: 'out',
                text: '%t'
            },
            {
                type: 'all',
                placement: 'in',
                visible: true,
                fontSize: '10'
            }
        ],
        animation: {
            delay: 400,
            effect: 'ANIMATION_SLIDE_BOTTOM',
            method: 'ANIMATION_BOUNCE_EASE_OUT',
            sequence: 'ANIMATION_BY_PLOT_AND_NODE',
            speed: 'ANIMATION_FAST'
        }
    },
    tooltip: {
        fontSize: 14,
        anchor: 'c',
        x: '50%',
        y: '55%',
        sticky: true,
        backgroundColor: 'none',
        borderWidth: 0,
        thousandsSeparator: ',',
        text: '<span style="color:%color;font-weight:bold">%t 통합</span><br/><span style="color:%color">매출액 : %v</span>'
    }
};

class NullInfoRoute extends Component {

    state = initialState

    componentDidMount() {
        api.getOrdererStatistics()
            .then((res) => {
                console.log(res);
                const { priceData, yearData } = res.data;

                const yearValues = {};

                const yearSeries = [];
                const priceSeries = [];
                
                if (!utils.empty(yearData)) {

                    yearData.forEach((obj) => {
                        let year = obj._id.split('-')[0];
                        let month = parseInt(obj._id.split('-')[1], 10);

                        if (!(year in yearValues)) {
                            yearValues[year] = (new Array(12)).fill(0);
                        }

                        yearValues[year][(month-1)] = obj.monthPrice;
                    });

                    Object.keys(yearValues).forEach((y) => {
                        yearSeries.push({
                            values: yearValues[y],
                            'legend-text': y
                        });
                    });
                    // console.log(yearValues, yearSeries);
                }

                if (!utils.empty(priceData)) {
                    const { totalPrice, ordererPrice } = priceData;

                    priceSeries.push({
                        values: [(totalPrice - ordererPrice)],
                        text: '일반'
                    });

                    priceSeries.push({
                        values: [ordererPrice],
                        text: '거래처'
                    });
                }

                setTimeout(() => {
                    this.setState({
                        yearChart: {
                            loading: false,
                            series: yearSeries
                        },
                        priceChart: {
                            loading: false,
                            series: priceSeries
                        }
                    });
                }, 3000);
            })
            .catch((err) => {
                console.log(err);

                setTimeout(() => {
                    this.setState({
                        yearChart: {
                            loading: false,
                            series: []
                        },
                        priceChart: {
                            loading: false,
                            series: []
                        }
                    });
                }, 3000);
            });
    }

    render() {
        const { yearChart, priceChart } = this.state;

        return (
            <OrdererInfo noid>
                <div className="statinfo_wrapper">
                    <ChartCard id="orderer-chart"
                            loading={yearChart.loading}
                            type="bar"
                            options={barChartOptions}
                            series={yearChart.series}
                            title="거래처 연간 데이터 비교"
                            width="100%"
                            className="bar-chart"/>
                    <ChartCard id="orderer-chart2"
                            loading={priceChart.loading}
                            type="pie"
                            options={pieChartOptions}
                            series={priceChart.series}
                            title="유형별 매출액 비교"
                            width="100%"/>
                </div>
            </OrdererInfo>
        );
    }
}

export default NullInfoRoute;