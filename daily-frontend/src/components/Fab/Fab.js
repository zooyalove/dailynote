import React from 'react';
import styles from './Fab.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

const Fab = ({
    onAction,
    children
}) => {

    return (
        <div className={cx('fab-wrapper')} onClick={onAction}>
            <div className={cx('fab')}>
                {children}
            </div>
            <div className={cx('ripple')}></div>
        </div>
    );
};

export default Fab;