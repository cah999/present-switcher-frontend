import React from 'react';
import './PlayerCard.css'; // Стили для карточки
import {ReactComponent as GiftSvg} from '../assets/gift.svg';
import {ReactComponent as RectangleSvg} from '../assets/hand_rectangle.svg';
import {ReactComponent as SmallRectangleSvg} from '../assets/rectangle_small.svg';

const PlayerCard = ({name, turn, position, onGiftClick, onCardClick, isDisconnected}) => {
    return (
        <div className="player-card" style={{opacity: isDisconnected ? 0.5 : 1}} onClick={onCardClick}>
            <div className="gift" onClick={onGiftClick}>
                <GiftSvg/>
            </div>

            {turn && (<div className="player-turn">{turn}</div>)}

            <div className="info-large-container">
                <svg className="info-large" viewBox="0 0 260 70" preserveAspectRatio="xMidYMid meet">
                    <RectangleSvg/>
                    <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle">
                        {name}
                    </text>
                </svg>
            </div>

            <div className="info-small-container">
                <svg className="info-small" viewBox="0 0 135 35" preserveAspectRatio="xMidYMid meet">
                    <SmallRectangleSvg/>
                    <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle">
                        {position}
                    </text>
                </svg>
            </div>
        </div>
    );
};

export default PlayerCard;
