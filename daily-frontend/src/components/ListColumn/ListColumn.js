import React from 'react';
import classNames from 'classnames';
import styles from './ListColumn.scss';

const cx = classNames.bind(styles);

const ListColumn = ({
    center,
    className,
    children
}) => {
    return (
        <div className={cx('list-column', { center }, className)}>
            {children}
        </div>
    );
};

export default ListColumn;