import { io } from 'socket.io-client'

// Use environment variable or default to localhost:5000
const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

// Create a singleton socket instance
export const socket = io(SOCKET_URL, {
    autoConnect: false,
})

export default socket
