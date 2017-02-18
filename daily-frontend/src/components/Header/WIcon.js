import React from 'react';

const WIcon = ({ name, size }) => {
	size = (!size || size === '') ? 'normal' : size;
    return (
        <i className={`wi wi-${name} ic ${size}`} />
    );
};

export default WIcon;
