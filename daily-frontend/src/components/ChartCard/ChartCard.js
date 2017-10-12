import React, { Component } from 'react';
import { core as ZingChart } from 'zingchart-react';
import classNames from 'classnames';
import styles from './ChartCard.scss';

const cx = classNames.bind(styles);

import Card from 'components/Card';

const myConfig = {
    type: 'bar',
    title: {
        text: '최근 1년간 데이터 비교'
    },
    utc: true,
    timezone: 9,
    'scale-x': {
        minValue: (new Date('2016-1-2')).getTime(),
        step: '1month',
        transform: {
            type: 'date',
            all: '%m月'
        },
        'max-items': 12
    },
    series : [
        {
            values : [35,42,67,89,25,34,67,85,123,43,15,12]
        },
        {
            values : [12,34,25,68,94,25,16,37,56,27,34,91]
        }

    ]
};

class ChartCard extends Component {

    render() {
        const { id } = this.props;
        return (
            <Card className={cx('chart-card')}>
                <ZingChart id={id} data={myConfig} height="300" width="100%" />
            </Card>
        );
    }
}

export default ChartCard;