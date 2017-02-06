import React from 'react';
export { default as Weather } from './Weather';
export { default as Logo } from './Logo';

const Header = ({children}) => {

    return (
        <div>
            <div className="header-wrapper">
                <div className="header">
                    {children}
                </div>
            </div>
            <div className="header-spacer">
            </div>
        </div>

    );
}

export default Header;