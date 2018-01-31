import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './Pager.scss';

const cx = classNames.bind(styles);

const PageNumber = ({
    page,
    className,
    onClick
}) => {
    return (
        <li className={className} onClick={() => onClick(page)}>{page}</li>
    );
}

const FirstPage = () => {
    return <PageNumber page={1} className="pager-start" />
}

const Pager = ({
    current,
    countPerPage=10,
    displayPage=5,
    datas=[],
    onPageClick
}) => {

    const dataLength = (datas.length > 0) ? datas.length : 0;

    return (
        <ul className={cx('pager-wrapper')}>
        </ul>
    );
};

export default Pager;