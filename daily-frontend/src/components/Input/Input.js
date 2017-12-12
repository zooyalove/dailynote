import React from 'react';
import classNames from 'classnames';
import styles from './Input.scss';

const cx = classNames.bind(styles);

const Input = ({
    fullWidth,
    icon,
    rectangle,
    className,
    ...rest
}) => {
    return (
        <input
            className={cx('input', {
                'full-width': fullWidth,
                icon,
                rectangle
            }, className)}
            {...rest}
        />
    );
};

export default Input;