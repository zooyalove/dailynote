import React from 'react';
import { Icon } from 'semantic-ui-react';
import Button from 'components/Button';

const InfoCard = ({
    backgroundImage,
    name,
    onDelete,
    onModify,
    children
}) => {
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
            </div>
            {children}
        </div>
    );
};

export default InfoCard;