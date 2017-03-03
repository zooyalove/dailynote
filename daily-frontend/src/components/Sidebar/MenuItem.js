import React from 'react';
import { Icon } from 'semantic-ui-react';
import { Link } from 'react-router';

const MenuItem = ({ children, icon, className, to }) => {
    return (
        <li className={className}>
            <Link to={to}>
                <Icon name={icon} />
                {children}
            </Link>
        </li>
    );
};

export default MenuItem;