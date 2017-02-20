import React from 'react';

const WIcon = ({ name, size, time }) => {
	size = (!size || size === '') ? 'normal' : size;
    return (
        <i className={`wi wi-${name} ${time} ${size}`} />
    );
};

export default WIcon;
