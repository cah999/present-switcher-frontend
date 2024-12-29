import React from 'react';

function GameActions({ currentPlayer, onMove, onViewGift }) {
    const handleMove = () => {
        const newPosition = (currentPlayer.position % 7) + 1; // Перейти на следующую позицию
        onMove(newPosition);
    };

    return (
        <div>
            <h2>Ваши действия</h2>
            <p>Текущая позиция: {currentPlayer.position}</p>
            <button onClick={handleMove}>Переместиться</button>
            <button onClick={onViewGift}>Посмотреть подарок</button>
        </div>
    );
}

export default GameActions;
