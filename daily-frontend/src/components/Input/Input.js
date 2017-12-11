import React from 'react';
import classNames from 'classnames';
import styles from './Input.scss';

const cx = classNames.bind(styles);

const Input = ({
    fullWidth,
    icon,
    className,
    ...rest
}) => {
    return (
        <input
            className={cx('input', {
                'full-width': fullWidth,
                icon
            }, className)}
            {...rest}
        />
    );
};

export default Input;