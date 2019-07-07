import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Dimmer, Icon } from "semantic-ui-react";

import * as headerAction from "redux/modules/base/header";
import * as ordererAction from "redux/modules/base/orderer";

import Header, { Logo, UserInfo } from "components/Header";
import Sidebar, { MenuItem } from "components/Sidebar";
import Contents from "components/Content";
import Fab from "components/Fab";

import * as user from "helpers/WebApi/user";
import storage from "helpers/storage";

class App extends Component {
  state = {
    active: false,
    scrolling: false
  };

  static contextTypes = {
    router: React.PropTypes.object
  };

  componentWillMount() {
    const {
      HeaderActions,
      status: { header }
    } = this.props;

    user
      .getInfo()
      .then(info => {
        if (!header.get("visible")) {
          HeaderActions.openHeader();
        }
      })
      .catch(err => {
        if (storage.get("loginInfo")) {
          storage.remove("loginInfo");
        }
        this.context.router.push("/login");
      });
  }

  componentDidMount() {
    const {
      status: { header }
    } = this.props;

    if (header.get("visible")) {
      window.addEventListener("scroll", this.handleScroll);
    }
  }

  componentWillUnmount() {
    const {
      OrdererActions,
      status: { header }
    } = this.props;

    OrdererActions.clearOrdererData();

    if (header.get("visible")) {
      window.removeEventListener("scroll", this.handleScroll);
    }

    if (storage.get("loginInfo")) {
      storage.remove("loginInfo");
    }
  }

  handleLogOut = async () => {
    const { OrdererActions } = this.props;

    if (storage.get("loginInfo")) {
      await user.signOut();

      storage.remove("loginInfo");
    }

    OrdererActions.clearOrdererData();
    this.context.router.push("/login");
  };

  handleScroll = e => {
    if (window.scrollY > 220 && !this.state.scrolling) {
      this.setState({ scrolling: true });
    } else if (window.scrollY <= 210 && this.state.scrolling) {
      this.setState({ scrolling: false });
    }
  };

  handleFabClick = () => {
    window.scrollTo(0, 0);
  };

  handleSidebarClick = () => {
    const { active } = this.state;

    this.setState({
      active: !active
    });
  };

  render() {
    const { handleLogOut, handleFabClick, handleSidebarClick } = this;
    const {
      children,
      status: { header, orderer }
    } = this.props;
    const { active, scrolling } = this.state;
    const visible = header.get("visible");
    const username = storage.get("loginInfo")
      ? storage.get("loginInfo")["username"]
      : "";

    return (
      <div>
        {visible ? (
          <div>
            <Header>
              <Logo active={active} onSidebarClick={handleSidebarClick} />
              <UserInfo username={username} onLogOut={handleLogOut} />
            </Header>
            <Sidebar active={active}>
              <MenuItem
                color="red"
                content="장부등록"
                icon="write"
                to="/write"
                onClick={handleSidebarClick}
              />
              <MenuItem
                color="grape"
                content="거래처 관리"
                icon="users"
                to="/orderer"
                onClick={handleSidebarClick}
              />
              <MenuItem
                color="green"
                content="장부검색"
                icon="search"
                to="/search"
                onClick={handleSidebarClick}
              />
              <MenuItem
                color="blue"
                content="통계"
                icon="bar graph"
                to="/stat"
                onClick={handleSidebarClick}
              />
            </Sidebar>
            <Contents>
              {children}
              {scrolling && (
                <Fab onAction={handleFabClick}>
                  <Icon name="angle double up" size="big" />
                </Fab>
              )}
            </Contents>
            {orderer.getIn(["modal", "fetch"]) && (
              <Dimmer active page>
                {orderer.getIn(["modal", "message"])}
              </Dimmer>
            )}
          </div>
        ) : (
          children
        )}
      </div>
    );
  }
}

App = connect(
  state => ({
    status: {
      header: state.base.header,
      orderer: state.base.orderer
    }
  }),
  dispatch => ({
    HeaderActions: bindActionCreators(headerAction, dispatch),
    OrdererActions: bindActionCreators(ordererAction, dispatch)
  })
)(App);

export default App;
