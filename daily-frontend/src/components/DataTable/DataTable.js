import React, { Component } from 'react';
import classNames from 'classnames';
import styles from './DataTable.scss';

import DataList from 'components/DataList';
import Pager from 'components/Pager';

const cx = classNames.bind(styles);

class DataTable extends Component {
    render() {
        return (
            <div className={cx('data-table')}>
                <DataList/>
                <Pager />
            </div>
        );
    }
}

export default DataTable;