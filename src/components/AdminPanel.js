import React from 'react';
import './AdminPanel.css';

const AdminPanel = ({ onClose, onChangeRound }) => {
    return (
        <div className="admin-panel">
            <button onClick={onClose}>Close</button>
            <h2>Панель управления игрой</h2>
            <h3>Если вы вдруг попали сюда случайно, то не ломайте ничего )</h3>
            <div>
                <button onClick={() => onChangeRound('WAITING')}>Ожидание участников</button>
                <button onClick={() => onChangeRound('START')}>Старт игры - распределение подарков</button>
                <button onClick={() => onChangeRound('TALK')}>Раунд обсуждения</button>
                <button onClick={() => onChangeRound('SWAP')}>Раунд обмена подарками</button>
                <button onClick={() => onChangeRound('FINAL')}>Раунд финального распределения</button>
                <button onClick={() => onChangeRound('END')}>Конец игры</button>
            </div>
        </div>
    );
};

export default AdminPanel;