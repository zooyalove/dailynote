import React, { Component } from "react";
import { Icon } from "semantic-ui-react";

import AnimMoreButton from "components/AnimMoreButton";
import Button from "components/Button";

class InfoCard extends Component {
  state = {
    active: false,
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.name !== nextProps.name) {
      this.setState({ active: false });
    }
  }

  handleMoreClick = () => {
    const { active } = this.state;
    this.setState({ active: !active });
  };

  handleViewPastClick = () => {
    const { bViewPast, onViewPastClick } = this.props;
    onViewPastClick(bViewPast);
  };

  render() {
    const {
      backgroundImage,
      name,
      moreButton,
      bViewPast,
      onMoreClick,
      onDelete,
      onModify,
      children,
    } = this.props;

    const { active } = this.state;

    const { handleMoreClick, handleViewPastClick } = this;

    return (
      <div>
        <div
          className="info_card"
          style={{ backgroundImage: `url('${backgroundImage}')` }}
        >
          <div className="label">{name}</div>
          <div className="actions">
            <Button
              desc={!bViewPast ? "지난해 리스트 보기" : "올해 리스트 보기"}
              onClick={handleViewPastClick}
            >
              {!bViewPast ? (
                <Icon
                  name="calendar minus outline"
                  color="violet"
                  size="large"
                />
              ) : (
                <Icon name="calendar check" color="blue" size="large" />
              )}
            </Button>
            <Button desc="삭제" onClick={onDelete}>
              <Icon name="trash" color="orange" size="large" />
            </Button>
            <Button desc="수정" onClick={onModify}>
              <Icon.Group size="large">
                <Icon name="address book outline" inverted color="red" />
                <Icon name="write" corner inverted color="red" />
              </Icon.Group>
            </Button>
          </div>
          {moreButton && (
            <AnimMoreButton
              active={active}
              onMoreClick={() => {
                handleMoreClick();
                onMoreClick();
              }}
            />
          )}
        </div>
        {children}
      </div>
    );
  }
}

export default InfoCard;
