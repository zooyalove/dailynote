import React, { Component } from 'react';

class LoginRoute extends Component {

    static contextTypes = {
        router: React.PropTypes.object
    }

    render() {
        return (
            <div>LoginRoute 페이지입니다.</div>
        );
    }
}

export default LoginRoute;
