import express from "express"
import http from "http"
import { Server } from "socket.io"

const app = express()
const server = http.createServer(app)
const io = new Server(server, { cors: { origin: "*" } })

const rooms = {}

io.on("connection", socket => {

  socket.on("join-room", ({ roomId, name }) => {
    socket.join(roomId)
    rooms[roomId] ??= { tips: {} }
  })

  socket.on("tip-dealer", ({ roomId, name }) => {
    if (name === "NGLO" || name === "GIANGI3") {
      rooms[roomId].tips[name] = true
    }

    socket.emit("dealer-message", "Il dealer ringrazia 🐟")
  })

  socket.on("start-hand", roomId => {
    const winners = Object.keys(rooms[roomId].tips)
    socket.emit("hand-result", {
      winners: winners.length ? winners : ["Qualcun altro"]
    })
    rooms[roomId].tips = {}
  })
})

server.listen(3000)
