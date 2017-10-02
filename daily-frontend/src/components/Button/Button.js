import React from 'react';
import { Icon } from 'semantic-ui-react';

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