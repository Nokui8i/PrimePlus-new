import 'dotenv/config';
import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import { config } from './config'
import { RouterManager } from './router'
import { RoomManager } from './room'
import { SocketManager } from './socket'

const app = express()
app.use(cors(config.server.cors))

const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: config.server.cors,
})

// Initialize managers
const routerManager = new RouterManager()
const roomManager = new RoomManager(routerManager)
const socketManager = new SocketManager(roomManager)

// Handle socket connections
socketManager.handleSocket(io)

// Start server
const port = process.env.PORT || 3001
httpServer.listen(port, () => {
  console.log(`Server is running on port ${port}`)
}) 