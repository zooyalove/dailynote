import React from 'react';
import classNames from 'classnames';
import styles from './SearchInput.scss';
import Input from 'components/Input';

const cx = classNames.bind(styles);

let value = "";

const SearchInput = ({
    fullWidth,
    icon,
    onSearch,
    ...rest
}) => {
    return (
        <div className={cx('search-input', {
            'full-width': fullWidth,
            icon
        })}>
            <Input
                fullWidth={fullWidth}
                icon={icon}
                {...rest}
                onKeyUp={ (e) => {
                    if (e.keyCode !== 13) {
                        value = e.target.value.trim();
                    } else {
                        if (value && value !== "") onSearch(value);
                    }
                }}
            />
        </div>
    );
};

export default SearchInput;