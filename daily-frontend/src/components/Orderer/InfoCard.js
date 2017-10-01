import React from 'react';

const InfoCard = ({
    backgroundImage
}) => {
    return (
        <div className="info-card" style={{backgroundImage: `url('${backgroundImage}')`}}></div>
    );
};

export default InfoCard;