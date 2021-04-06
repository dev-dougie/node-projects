const express = require('express')
const path = require('path')

const app = express()
//Setting HTTP protocol
const server = require('http').createServer(app)
// '' websocket WSS protocol
const io = require('socket.io')(server)
//'' static files
app.use(express.static(path.join(__dirname, 'public')))
.set('views', path.join(__dirname, 'public'))
.engine('html', require('ejs').renderFile)
.set('view engine', 'html')

app.use('/', (req, res) => {
    res.render('index.html')
})

let messages = []

//News connections
io.on('connect', socket => {
    console.log(`Socket conectado: ${socket.id}`);
    socket.emit('previousMessages', messages)

    socket.on('sendMessage', data => {
        messages.push(data)
        socket.broadcast.emit('receivedMessage', data)
    })
})

const PORT = process.env.PORT || 5500
server.listen(PORT, () => console.log('The server is running'))