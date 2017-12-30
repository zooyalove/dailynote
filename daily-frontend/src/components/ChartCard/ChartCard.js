import React, { Component } from 'react';
import { core as ZingChart } from 'zingchart-react';
import { Loader, Icon } from 'semantic-ui-react';
import shortid from 'shortid';
import classNames from 'classnames';

import * as utils from 'helpers/utils';

import styles from './ChartCard.scss';
import Card from 'components/Card';

const cx = classNames.bind(styles);

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
        const { type, options } = this.props;
        options['type'] = type;

        this.setState({options});
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.series !== nextProps.series) {

            const options = JSON.parse(JSON.stringify(this.state.options));
            
            options['series'] = nextProps.series;

            this.setState({options});
        }
    }    

    render() {
        const { id, options } = this.state;
        const { title, loading, series, height, width, className, children } = this.props;
        const h = height ? height : 300;
        const w = width ? width : 600;

        return (
            <Card title={title ? title : ''}
                className={cx('chart-card', className)}
            >
                {loading
                    ? <Loader size="big" active >Data is loading...</Loader>
                    : (!utils.empty(series)
                        ? (<div className={cx('chart-wrapper')}>
                                <ZingChart id={id} data={options} height={h} width={w} />
                            { children }</div>
                            )
                        : <div className="no-data"><Icon name="warning sign" color="red" size="big"/> No Exists Data!</div>
                    )
                }
            </Card>
        );
    }
}

export default ChartCard;