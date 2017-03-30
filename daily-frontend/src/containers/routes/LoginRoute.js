import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Checkbox, Icon, Input } from 'semantic-ui-react';

import * as header from './../../redux/modules/base/header';
import * as login from './../../redux/modules/base/login';

import storage from './../../helpers/storage';

import backImage from './../../static/images/background.jpg';

const FormItem = ( {icon, name, placeholder, tabIndex, type, onTextChange} ) => (
    <div className="login-item">
        <div className="login-icon">
            <Icon name={icon} />
        </div>
        <div className="login-field">
            <Input
                placeholder={placeholder}
                tabIndex={tabIndex}
                type={type}
                onChange={
                    (e, data) => {
                        onTextChange({name, data});
                    }
                }
            />
        </div>
     </div>
);

class LoginRoute extends Component {

    static contextTypes = {
        router: React.PropTypes.object
    }

    componentWillMount() {
        const { HeaderActions, status: { header } } = this.props;

        const loginInfo = storage.get('loginInfo');
        if (loginInfo) {
            this.context.router.push('/');
        }

        if (header.get('visible')) {
            HeaderActions.hideHeader();
        }
    }

    handleChange = ({name, data}) => {
        const { LoginActions } = this.props;
        const value = data.value;
        
        LoginActions.setLoginFormInfo({name, value});
    }

    handleSubmit = (e) => {
        const { LoginActions } = this.props;
        LoginActions.clearLoginFormInfo();
    }

    render() {
        const { handleChange, handleSubmit } = this;

        return (
            <div
                className="login-wrapper"
                style={{backgroundImage: `url(${backImage})`}}
            >
                <div className="login-content">
                    <div className="login-title">
                        <h1>Daily Note</h1>
                    </div>
                    <div className="login-form">
                        <FormItem
                            icon="user"
                            placeholder="User ID..."
                            name="userid"
                            tabIndex="1"
                            type="text"
                            onTextChange={handleChange}
                        />
                        <FormItem
                            icon="privacy"
                            placeholder="User Password..."
                            name="password"
                            tabIndex="2"
                            type="password"
                            onTextChange={handleChange}
                        />
                        <div className="login-remember">
                            <Checkbox label="Remember me" defaultChecked />
                        </div>
                        <div className="login-item">
                            <button className="login-submit" tabIndex="3" onClick={handleSubmit} >LOGIN</button>
                        </div>
                    </div>
                </div>


            </div>
        );
    }
}

LoginRoute = connect(
    state => ({
        status: {
            header: state.base.header,
            login: state.base.login
        }
    }),
    dispatch => ({
        HeaderActions: bindActionCreators(header, dispatch),
        LoginActions: bindActionCreators(login, dispatch)
    })
 )(LoginRoute);

export default LoginRoute;
