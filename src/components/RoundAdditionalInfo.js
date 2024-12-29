import React from 'react';
import './RoundAdditionalInfo.css'; // Стили для текста

const RoundInfo = ({info}) => {
    return (
        <div className="round-additional-info">
            {info}
        </div>
    );
};

export default RoundInfo;
