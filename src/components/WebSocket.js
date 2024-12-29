import {useEffect, useRef, useState} from 'react';

const UseWebSocket = (url, onMessageCallback) => {
    // console.log("UseWebSocket", url);
    const socketRef = useRef(null);
    const [isConnected, setIsConnected] = useState(false); // Состояние для отслеживания подключения

    useEffect(() => {
        // console.log("useEffect", url);
        const socket = new WebSocket(url);
        socketRef.current = socket;

        socket.onopen = () => {
            // console.log("WebSocket connection established");
            setIsConnected(true);
        };

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            // console.log("Received message:", data);
            onMessageCallback(data);
        };

        socket.onerror = (error) => {
            console.error("WebSocket error:", error);
        };

        socket.onclose = () => {
            setIsConnected(false);
        };

        return () => {
            socket.close();
        };
    }, [url]);

    const sendMessage = (message) => {
        // console.log("Sending message:", message);
        if (isConnected) { // Проверяем, что соединение установлено
            // console.log("Sent message");
            socketRef.current.send(JSON.stringify(message));
        } else {
            // console.log("Unable to send message, WebSocket is not connected");
        }
    };

    return {sendMessage};
};

export default UseWebSocket;