import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Checkbox, Dimmer, Icon, Input, Loader, Message } from 'semantic-ui-react';

import * as header from 'redux/modules/base/header';
import * as login from 'redux/modules/base/login';

import * as user from 'helpers/WebApi/user';
import * as utils from 'helpers/utils';
import storage from 'helpers/storage';

import backImage from 'static/images/background.jpg';

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

		user.getInfo()
        .then( (info) => {
            this.context.router.push('/');
        })
        .catch( (err) => {
            console.log(err);
            if (header.get('visible')) {
                HeaderActions.hideHeader();
            }
        });

        document.addEventListener('keyup', this.handleEnter);
    }

    componentWillUnmount() {
        document.removeEventListener('keyup', this.handleEnter);
    }

    handleEnter = (e) => {
        const { status: { login } } = this.props;

        const userid = login.getIn(['loginForm', 'userid']);
        const password = login.getIn(['loginForm', 'password']);

        if (e.keyCode === 13) {
            if (!utils.empty(userid) && !utils.empty(password)) {
                this.handleSubmit(null);
            }
        }
    }

    handleChange = ({name, data}) => {
        const { LoginActions } = this.props;
        const value = data.value;
        
        LoginActions.setLoginFormInfo({name, value});
    }

    handleRemember = (e, data) => {
        const { LoginActions } = this.props;
        LoginActions.setLoginFormRemember(!data.checked);
    }

    handleSubmit = (e) => {
        const { LoginActions, status: { login } } = this.props;

        const userid = login.getIn(['loginForm', 'userid']);
        const password = login.getIn(['loginForm', 'password']);

        LoginActions.fetchingLoginAuth();

        user.signIn({
            userid,
            password
        })
        .then( (res) => {
            console.log('Success');

            user.getInfo()
            .then( (info) => {
                const userInfo = info.data.info;

                LoginActions.completeLoginAuth();
                storage.set('loginInfo', userInfo);

                LoginActions.setLoginAuthMessage({
                    type: 'success',
                    message: 'Hello, ' + userInfo.username + '~!'
                });

                setTimeout( () => {
                    LoginActions.hideLoginAuthMessage();
                    setTimeout( () => {
                        LoginActions.clearLoginAuthMessage();
                        
                        this.context.router.push('/');
                    }, 1000);
                }, 3000);

            })
            .catch( (err) => {
                LoginActions.completeLoginAuth();
                if (err.response) {
                    LoginActions.setLoginAuthMessage({
                        type: 'error',
                        message: err.response.data.error + '~!'
                    });

                    setTimeout( () => {
                        LoginActions.hideLoginAuthMessage();
                        setTimeout( () => {
                            LoginActions.clearLoginAuthMessage();
                        }, 1000);
                    }, 3000);
                }
            });
        })
        .catch( (err) => { 
            LoginActions.completeLoginAuth();

            if (err.response) {
                LoginActions.setLoginAuthMessage({
                    type: 'error',
                    message: err.response.data.error + '~!'
                });

                setTimeout( () => {
                    LoginActions.hideLoginAuthMessage();
                    setTimeout( () => {
                        LoginActions.clearLoginAuthMessage();
                    }, 1000);
                }, 3000);
            }
        });
        
        // LoginActions.clearLoginFormInfo();
    }

    render() {
        const { handleChange, handleRemember, handleSubmit } = this;
        const { status: { login }} = this.props;
        const checked = login.get('is_remember');
        const fetching = login.get('fetching');
        const message = login.getIn(['auth', 'message']);
        const authtype = login.getIn(['auth', 'type']);
        const visible = login.getIn(['auth', 'visible']);

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
                            placeholder="User ID or Email..."
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
                            <Checkbox label="Remember me" checked={checked} onClick={handleRemember} />
                        </div>
                        <div className="login-item">
                            <button
                                className="login-submit"
                                tabIndex="3"
                                onClick={handleSubmit}
                            >LOGIN</button>
                        </div>
                    </div>
                </div>
                {fetching && 
                    <Dimmer active >
                        <Loader>사용자 정보 인증중...</Loader>
                    </Dimmer>
                }
                {message && 
                    <Message
                        icon
                        compact
                        color={`${authtype === 'success' ? 'green' : 'red'}`}
                        className={`float-message ${visible ? 'bounceInUp' : 'bounceOutDown'}`}
                    >
                        <Icon name='info circle' />
                        {message}
                    </Message>
                }
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
