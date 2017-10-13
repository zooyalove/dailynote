import React, { Component } from 'react';
import { core as ZingChart } from 'zingchart-react';
import shortid from 'shortid';
import classNames from 'classnames';

import styles from './ChartCard.scss';
import Card from 'components/Card';

const cx = classNames.bind(styles);

/*const myConfig = {
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
};*/

/**
 * Props information
 * 
 * @prop id   <== id for display zingchart ( default: shortid )
 * @prop type <== enum ( bar, line, area, pie, scatter )
 * @prop title <== string ( default: '' )
 * @prop series <== array ( default: [] )
 * @prop noData <== object ( json type )
 * @prop useTimezone <== boolean
 * @prop height
 * @prop width
 */

class ChartCard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id: this.props.id ? this.props.id : shortid.generate(),
            noData: {},
            series: []
        }
        
    }

    componentWillMount() {
        const { type, series, utcTimezone, noData } = this.props;

        this.setState({
            type,
            series,
            utc: utcTimezone ? true : false,
            timezone: 9,
            noData: {
                text: 'noData'
            }
        });
    }

    render() {
        const { id } = this.state;
        const { title } = this.props;
        const height = this.props.height ? this.props.height : 300;
        const width = this.props.width ? this.props.width : 600;

        return (
            <Card title={`${title ? title : ''}`} className={cx('chart-card')}>
                <ZingChart id={id} data={this.state} height={height} width={width} />
            </Card>
        );
    }
}

export default ChartCard;