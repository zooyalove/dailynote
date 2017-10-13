import React, { Component } from 'react';
import { core as ZingChart } from 'zingchart-react';
import { Loader, Icon } from 'semantic-ui-react';
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
 * @prop type(required) <== enum ( bar, line, area, pie, scatter )
 * @prop options(required) <== object ( json type )
 * @prop series(required) <== array ( default: [] )
 * @prop title <== string ( default: '' )
 * @prop height
 * @prop width
 */

class ChartCard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id: this.props.id ? this.props.id : shortid.generate(),
            options: null
        }        
    }

    componentWillMount() {
        const { type, options, series } = this.props;
        options['type'] = type;
        options['series'] = [{ values: series[0] }];

        this.setState({options});
    }

    render() {
        const { id, options } = this.state;
        const { title, loading, series } = this.props;
        const height = this.props.height ? this.props.height : 300;
        const width = this.props.width ? this.props.width : 600;

        console.log(this.state);
        
        return (
            <Card title={`${title ? title : ''}`}
                className={cx('chart-card')}
                style={{minHeight: height}}>
                {loading
                    ? <Loader size="big" active >Data is loading...</Loader>
                    : (series
                        ? <ZingChart id={id} data={options} height={height} width={width} />
                        : <div className="no-data"><Icon name="warning sign" color="red" size="big"/> No Exists Data!</div>
                    )
                }
            </Card>
        );
    }
}

export default ChartCard;