import React from 'react';
import classNames from 'classnames';
import styles from './Card.scss';

const cx = classNames.bind(styles);

const Card = ({
    title,
    color,
    rectangle,
    noshadow,
    className,
    children
}) => {
    return (
        <div className={cx('card', {rectangle, noshadow, className}, color)}>
            {title && (
                <h4 className={cx('title')}>
                    {title}
                </h4>
            )}
            <div>{children}</div>
        </div>
    );
};

export default Card;