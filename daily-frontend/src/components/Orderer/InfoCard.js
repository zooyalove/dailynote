import React, { Component } from 'react';
import { Icon } from 'semantic-ui-react';

import AnimMoreButton from 'components/AnimMoreButton';
import Button from 'components/Button';

class InfoCard extends Component {
    state = {
        active: false
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.name !== nextProps.name) {
            this.setState({active: false});
        }
    }
    
    handleMoreClick = () => {
        const { active } = this.state;
        this.setState({active: !active});
    }

    render() {
        const {
            backgroundImage,
            name,
            moreButton,
            onMoreClick,
            onDelete,
            onModify,
            children
        } = this.props;

        const { active } = this.state;

        const { handleMoreClick } = this;

        return (
            <div>
                <div className="info_card" style={{backgroundImage: `url('${backgroundImage}')`}}>
                    <div className="label">{name}</div>
                    <div className="actions">
                        <Button desc="삭제" onClick={onDelete}>
                            <Icon name="trash" color="orange" size="large" />
                        </Button>
                        <Button desc="수정" onClick={onModify}>
                            <Icon.Group size="large">
                                <Icon name="address book outline" inverted color="red"/>
                                <Icon name="write" corner inverted color="red"/>
                            </Icon.Group>
                        </Button>
                    </div>
                    {moreButton && <AnimMoreButton active={active} onMoreClick={() => { handleMoreClick(); onMoreClick(); }} />}
                </div>
                {children}
            </div>
        );
    }
}

export default InfoCard;