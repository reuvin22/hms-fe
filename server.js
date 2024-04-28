const express = require('express')
const next = require('next')
const http = require('http')
const socketIO = require('socket.io')
const Redis = require('ioredis')
const { createClient } = require("redis")
const { Emitter } = require("@socket.io/redis-emitter")


const dev = process.env.NEXT_ENV !== 'production'

const app = express()
const server = http.createServer(app)
// const io = socketIO(server, {
//   cors: {
//       origin: "http://localhost:3000",
//       method: ["GET", "POST"],
//       allowedHeaders: ["my-custom-header"],
//       credentials: true
//   }
// })
// const redis = new Redis({
//     host: '127.0.0.1',
//     port: 6379
// })

// redis.subscribe('notifications', () => {
//     console.log('Subscribed to "notifications" channel')
// })

// redis.on('message', (channel, message) => {
//     console.log(`Message received from ${channel}: ${message}`)
//     io.sockets.emit('NewNotification', message)
// })

// const redisClient = createClient({ url: 'redis://127.0.0.1:6001' })
// const emitter = new Emitter(redisClient)

// redisClient.on('connect', () => {
//     console.log('Connected to Redis Server')
// })
    
// redisClient.on('ready', () => {
//     console.log('Subscribing to "notifications" channel')
//     redisClient.subscribe('notifications')
// })

// redisClient.on('message', (channel, message) => {
//     console.log(`Message received from ${channel}: ${message}`)
//     // Emitting to all clients connected to the Socket.IO server
//     emitter.emit('NewNotification', message)
// })

server.listen(6001, () => console.log(`Server is running on port 6001`))

// const nextApp = next({ dev })
// const handle = nextApp.getRequestHandler() // Next.js request handler

// nextApp.prepare().then(() => {
//   const app = express()
//   const server = http.createServer(app)
//   const io = socketIO(server, {
//     cors: {
//         origin: "http://localhost:3000",
//         method: ["GET", "POST"],
//         allowedHeaders: ["my-custom-header"],
//         credentials: true
//     }
//   })
//   const redis = new Redis()

//   redis.subscribe('notifications', () => {
//       console.log('Subscribed to "notifications" channel')
//   })

//   redis.on('message', (channel, message) => {
//       console.log(`Message received from ${channel}: ${message}`)
//       io.sockets.emit('NewNotification', message)
//   })

//   app.all('*', (req, res) => {
//       return handle(req, res) // handling the request with Next.js
//   })

//   server.listen(6001, () => console.log(`Server is running on port 6001`))
// })