import React, { Component } from 'react';
import Weather from './Weather';

class Header extends Component {

    render() {
        return (
            <div>
                <div className="header-wrapper">
                    <div className="header">
                        안녕하세요....일일장부(Daily Note) 개발 프로젝트입니다.^^;;
                        <Weather />
                    </div>
                </div>
                <div className="header-spacer">
                </div>
            </div>

        );
    }
}

export default Header;