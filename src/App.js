import React, {useEffect, useState} from 'react';
import RoundInfo from './components/RoundInfo';
import PlayerCard from './components/PlayerCard';
import AdminPanel from './components/AdminPanel';
import JoinGame from './components/JoinGame';
import UseWebSocket from './components/WebSocket';
import './App.css';
import './components/FinalInfo.css'
import './components/Waiting.css'
import RoundAdditionalInfo from "./components/RoundAdditionalInfo";

function App() {
    const [roundText, setRoundText] = useState('??');
    const [roundAdditionalText, setRoundAdditionalText] = useState(null);
    const [players, setPlayers] = useState([]);
    const [showAdminPanel, setShowAdminPanel] = useState(false);
    const [savedId, setSavedId] = useState(localStorage.getItem('playerId' || null));
    const [thisPlayer, setThisPlayer] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [gift, setGift] = useState(null);
    const [swapPlayerTurn, setSwapPlayerTurn] = useState(null);
    const [swapMessage, setSwapMessage] = useState(null);
    const [isGameFinished, setIsGameFinished] = useState(false);
    const [finalGifts, setFinalGifts] = useState(null);
    const [showTurns, setShowTurns] = useState(false);
    const webSocketUrl = 'ws://147.45.76.239:8080/ws/games';

    const {sendMessage} = UseWebSocket(
        webSocketUrl,
        (message) => {
            switch (message.action) {
                case "JOINED_PLAYER":
                    setThisPlayer(message.data);
                    localStorage.setItem('playerId', message.data.id);
                    localStorage.setItem("nickname", message.data.name);
                    setSavedId(message.data.id);
                    setIsConnected(true);
                    break;
                case 'UPDATE_PLAYERS':
                    setPlayers(message.data);
                    break;
                case 'ROUND_NAME':
                    setRoundText("Раунд: " + message.data);
                    setIsGameFinished(false);
                    // setRoundAdditionalText(null);
                    break;
                case "UPDATE_SWAPPED_PLAYERS":
                    const {first, second} = message.data;

                    setPlayers((prevPlayers) => {
                        const player1 = prevPlayers.find((player) => player.id === first);
                        const player2 = prevPlayers.find((player) => player.id === second);

                        if (!player1 || !player2) {
                            console.error("Players not found for swapping");
                            return prevPlayers;
                        }

                        const player1Index = prevPlayers.indexOf(player1);
                        const player2Index = prevPlayers.indexOf(player2);

                        const newPlayers = [...prevPlayers];

                        newPlayers[player1Index] = player2;
                        newPlayers[player2Index] = player1;

                        setSwapMessage(`${player1.name} и ${player2.name} поменялись подарками`);
                        setTimeout(() => {
                            setSwapMessage(null);
                        }, 2900);
                        return newPlayers;
                    });

                    break;
                case "VIEW_GIFT":
                    // console.log('Gift:', message.data);
                    setGift(message.data);
                    break
                case "START_QUEUE":
                    // console.log('Queue:', message.data);
                    setPlayers(message.data.queue);
                    break
                case "FINAL_QUEUE":
                    // console.log('Queue:', message.data);
                    setPlayers(message.data.queue);
                    setShowTurns(true);
                    break
                case "PLAYER_TURN":
                    // console.log('Player:', message.data);
                    setSwapPlayerTurn(message.data);
                    if (message.data) {
                        setRoundAdditionalText("Очередь игрока: " + message.data.name);
                    } else {
                        setRoundAdditionalText(null);
                    }
                    break
                case "GAME_FINISH":
                    // console.log('Game finish:', message.data);
                    setIsGameFinished(true);
                    setFinalGifts(message.data);
                    break
                default:
                    console.warn('Unhandled WebSocket action:', message.action);
            }
        }
    );

    const handleJoin = (nickname) => {
        sendMessage({action: 'JOIN_GAME', data: {name: nickname, playerId: savedId}});
    };


    const handleChangeRound = (newRound) => {
        sendMessage({action: 'ROUND_CHANGED', data: {newRound}});
    };

    const handleKeyDown = (event) => {
        const key = event.key.toLowerCase();
        if (event.altKey && (key === 'h' || key === 'р')) {
            setShowAdminPanel((prevShowAdminPanel) => !prevShowAdminPanel);
        }
    };

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    const handleCloseAdminPanel = () => {
        setShowAdminPanel(false);
    };


    useEffect(() => {
        const handleBeforeUnload = () => {
            if (thisPlayer) {
                sendMessage({action: 'EXIT_GAME', data: {playerId: thisPlayer.id}});
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [thisPlayer, sendMessage]);

    const isGameStarted = (Array.isArray(players) && players.some((player) => player.position != null))

    const handleGiftClose = () => {
        setGift(null);
    }

    const handleGiftClick = (player) => {
        if (thisPlayer.id !== player.id) {
            return;
        }
        sendMessage({action: 'VIEW_GIFT', data: {playerId: player.id}})
    }

    const handleCardClick = (player) => {
        if (thisPlayer.id === player.id && roundText !== "Раунд: обмен подарками") {
            handleGiftClick(player);
        } else if (swapPlayerTurn !== null && swapPlayerTurn.id === thisPlayer.id) {
            sendMessage({action: 'SWAP_PLAYERS', data: {player1Id: thisPlayer.id, player2Id: player.id}})
        }
    }

    const renderPlayers = () => (
        <div className="grid-container">
            {players.map((player) => (
                <PlayerCard key={player.id}
                            name={player.name}
                            turn={showTurns ? player.turn + 1 : null}
                            position={`Номер: ${player.position + 1}`}
                            onGiftClick={() => handleGiftClick(player)}
                            onCardClick={() => handleCardClick(player)}
                            isDisconnected={player.disconnected}
                />
            ))}
        </div>
    );
    // Рендер состояния ожидания
    const renderWaiting = () => (
        <div className="waiting-info">
            <div className="waiting-players">
                {players.map((player, index) => (
                    <span key={index} className="waiting-player" style={{animationDelay: `${index * 0.2}s`}}>
                    {player.name}
                </span>
                ))}
            </div>
        </div>
    );

    const renderFinal = () => (
        <div className="final-info">
            <div className="final-info__title">Игра окончена ⛄</div>
            <div className="final-info__gifts">
                {finalGifts.map((gift, index) => (
                    <div
                        key={index}
                        className="final-info__gift"
                        style={{animationDelay: `${index * 4}s`}}
                    >
                        {gift}
                    </div>
                ))}
            </div>
            <div className="final-info__text">С наступающим новым годом!🎄🎅</div>
        </div>
    );

    // Основной рендер игры
    const renderGame = () => (
        <>
            {/*<div className="nickname">Вы: {thisPlayer.name}</div>*/}
            <RoundInfo info={roundText}/>
            {roundAdditionalText && <RoundAdditionalInfo info={roundAdditionalText}/>}
            {isGameFinished ? renderFinal() : isGameStarted ? renderPlayers() : renderWaiting()}

            {showAdminPanel && (
                <AdminPanel
                    onClose={handleCloseAdminPanel}
                    onChangeRound={handleChangeRound}
                />
            )}
        </>
    );

    // Рендер основного компонента
    return (
        <div className="App">
            {gift && (
                <div className="overlay" onClick={handleGiftClose}>
                    <div className="overlay-text">
                        {gift.content}
                    </div>
                </div>
            )}
            {swapMessage && (
                <div className="swap-popup">
                    {swapMessage}
                </div>
            )}
            {!savedId ? (
                <JoinGame text="Подключиться" onJoin={handleJoin}/>
            ) : isConnected ? (
                renderGame()
            ) : (
                <JoinGame text="Переподключиться" onJoin={handleJoin}/>
            )}
        </div>
    );
}

export default App;