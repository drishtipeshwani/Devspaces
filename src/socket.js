import {io} from 'socket.io-client';

export const initSocket = async () => {
    const options = {
        transports: ['websocket'], // 'websocket' is required for 
        forceNew: true, // 'forceNew' is required for multiple clients
        reconnectionAttempts: 'Infinity', // Try to reconnect forever
        timeout: 10000, // Stating the timeout for the connection
    }

    return io(process.env.REACT_APP_SERVER_URL, options); // This is returning an instance of socket.io client
}