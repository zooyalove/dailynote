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
        const { countPerPage, displayPage, ordererView, animation, hide } = this.props;

        let datalist;
        let startIndex = 0;

        if (datas.length === 0) {
            datalist = [];
        } else {
            startIndex = datas.length - ((currentPage-1) * countPerPage);

            if (currentPage === 1) {
                if (datas.length <= countPerPage) {
                    datalist = datas;
                } else {
                    datalist = datas.slice(0, 10);
                }
            } else {
                const pageOffset = currentPage * countPerPage;
                datalist = datas.slice(pageOffset, (pageOffset + countPerPage));
            }
        }

        return (
            <div className={cx('data-table')}>
                <DataList
                    startIndex={startIndex}
                    datalist={datalist}
                    ordererView={ordererView ? true : false}
                    animation={animation ? true : false}
                    hide={hide ? true : false}
                />
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