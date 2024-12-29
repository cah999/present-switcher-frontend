import React from 'react';

function PlayerList({ players }) {
    return (
        <div>
            <h2>Список игроков</h2>
            <ul>
                {players.map((player) => (
                    <li key={player.id}>
                        {player.name} — Позиция: {player.position}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default PlayerList;
