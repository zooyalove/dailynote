import React from 'react';

const Sidebar = ({
    active,
    children
}) => {
    return (
        <nav className={`${active ? 'active' : ''}`}>
            {children}
        </nav>
    );
}

export default Sidebar;