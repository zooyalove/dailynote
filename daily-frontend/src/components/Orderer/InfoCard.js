import React from 'react';
import { Icon } from 'semantic-ui-react';
import Button from 'components/Button';

const InfoCard = ({
    backgroundImage,
    label,
    children
}) => {
    return (
        <div className="info-card" style={{backgroundImage: `url('${backgroundImage}')`}}>
            <div className="label">{label}</div>
            <div className="actions">
                <Button desc="삭제">
                    <Icon name="trash" color="orange" size="large" />
                </Button>
                <Button desc="수정">
                    <Icon.Group size="large">
                        <Icon name="address book outline" inverted color="red"/>
                        <Icon name="write" corner inverted color="red"/>
                    </Icon.Group>
                </Button>
            </div>
        </div>
    );
};

export default InfoCard;