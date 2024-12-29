import React, {useState} from 'react';
import './JoinGame.css';

const JoinGame = ({text, onJoin}) => {
    const [nickname, setNickname] = useState(localStorage.getItem('nickname') || '')

    const handleJoin = () => {
        if (nickname.trim()) {
            onJoin(nickname);
        }
    };

    return (
        <div className="join-game">
            <input
                type="text"
                placeholder="Никнейм"
                maxLength={12}
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
            />
            <button onClick={handleJoin}>{text}</button>
        </div>
    );
};

export default JoinGame;