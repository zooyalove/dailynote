import React, { Component } from 'react';
import classNames from 'classnames';
import styles from './DataTable.scss';

import DataList from 'components/DataList';
import Pager from 'components/Pager';

const cx = classNames.bind(styles);

class DataTable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentPage: 1,
            datas: ((props.datas.length > 0) ? props.datas : [])
        };
    }

    handlePageClick = (page) => {
        this.setState({ currentPage: page });
    }

    render() {
        const { handlePageClick, state: { currentPage, datas } } = this;
        const { countPerPage, displayPage } = this.props;

        return (
            <div className={cx('data-table')}>
                <DataList/>
                <Pager
                    datas={datas}
                    current={currentPage}
                    countPerPage={countPerPage}
                    displayPage={displayPage}
                    onPageClick={handlePageClick}
                />
            </div>
        );
    }
}

export default DataTable;