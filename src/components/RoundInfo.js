import React from 'react';
import './RoundInfo.css'; // Стили для текста

const RoundInfo = ({info}) => {
    return (
        <div className="round-info">
            {info}
        </div>
    );
};

export default RoundInfo;
