import React from 'react';

const Header = ({children}) => {

    return (
        <header>
            <div className="header-wrapper">
                <div className="header">
                    {children}
                </div>
            </div>
        </header>

    );
}

export default Header;