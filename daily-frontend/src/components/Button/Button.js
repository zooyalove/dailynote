import React from 'react';

const Button = ({
    desc,
    onClick,
    children
}) => {
    return (
        <div className="dbutton" title={desc} onClick={onClick}>
            {children}
        </div>
    );
};

export default Button;