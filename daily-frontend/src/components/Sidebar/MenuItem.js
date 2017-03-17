import React from 'react';
import { Icon } from 'semantic-ui-react';
import { Link } from 'react-router';

const MenuItem = ({ children, color, icon, to }) => {
    return (
        <Link to={to} activeClassName="active" className={`menuitem ${color}`} >
            <Icon name={icon} />
            <span className="menuitem-text">{children}</span>
        </Link>
    );
};

export default MenuItem;