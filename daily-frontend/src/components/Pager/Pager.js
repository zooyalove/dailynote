import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './Pager.scss';

import DataList from 'components/DataList';

const cx = classNames.bind(styles);

class Pager extends Component {
    static defaultProps = {
        countPerPage: 10
    }
    
    state = {
        datas: null
    }

    componentWillMount() {
        
    }

    render() {
        return (
            <ul className={cx('pager-wrapper')}>
            </ul>
        );
    }
};

Pager.propTypes = {
    datas: PropTypes.array.isRequired,
    countPerPage: PropTypes.number,
    ordererView: PropTypes.bool,
    animation: PropTypes.bool,
    hide: PropTypes.bool,
    className: PropTypes.string
};

export default Pager;