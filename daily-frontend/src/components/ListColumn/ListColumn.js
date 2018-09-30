import React from 'react';
import classNames from 'classnames';
import styles from './ListColumn.scss';

const cx = classNames.bind(styles);

const ListColumn = ({
    text,
    bold,
    center,
    right,
    address,
    date,
    title="",
    red,
    className,
    children,
    ...rest
}) => {

    return (
        <div className={cx('list-column',
                { bold, center, right, address, date, red },
                className)}
                {...rest}
                title={(title !== "") ? title : (text || children)}
        >
            {text || children}
        </div>
    );
};

export default ListColumn;