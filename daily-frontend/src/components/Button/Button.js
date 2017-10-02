import React from 'react';

const Button = ({
    desc,
    onClick,
    children
}) => {
    return (
        <div className="dbutton" title={desc}>
            {children}
        </div>
    );
};

export default Button;