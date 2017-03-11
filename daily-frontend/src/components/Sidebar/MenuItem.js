import React from 'react';
import { Icon } from 'semantic-ui-react';
import { Link } from 'react-router';

const MenuItem = ({ children, color, icon, to }) => {
    return (
        <Link to={to} activeClassName="active" className={color} >
            <Icon name={icon} />
            {children}
        </Link>
    );
};

export default MenuItem;