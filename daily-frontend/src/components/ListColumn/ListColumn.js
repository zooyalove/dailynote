import React from 'react';
import classNames from 'classnames';
import styles from './ListColumn.scss';

const cx = classNames.bind(styles);

const ListColumn = ({
    text,
    center,
    className,
    children
}) => {
    let display_text = '';

    if (Object.keys(text).length > 0) {
        display_text = Object.keys(text).map((t, i) => {
            return <span key={i}>{text[t]}<br/></span>;
        });
    }

    return (
        <div className={cx('list-column', { center }, className)}>
            {display_text}
        </div>
    );
};

export default ListColumn;