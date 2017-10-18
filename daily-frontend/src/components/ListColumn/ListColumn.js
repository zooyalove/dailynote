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
    className,
    children,
    ...rest
}) => {

    return (
        <div className={cx('list-column',
                { bold, center, right, address, date },
                className)}
                {...rest}
                title={text || children}
        >
            {text || children}
        </div>
    );
};

export default ListColumn;