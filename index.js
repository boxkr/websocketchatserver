let app = require('express')();
let http = require('http').createServer(app);
let io = require('socket.io')(http);
let allClients = [];
let PORT = process.env.PORT || 3000;
nicknames = [];

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

//emmit connected/disconnected
io.on('connection', (socket) => {

    //prompt for name
    socket.on('username', (data, callback) => {
        socket.nickname = data;
        nicknames.push(socket.nickname);
        console.log(nicknames);
    });

    //connect
    console.log('A user has connected!');
    allClients.push(socket);
    io.emit('user-connection', 'user connected');
    io.emit('playerCount', allClients.length);

    //disconnect
    socket.on('disconnect', () => {
        console.log('user disconnected!');
        let i = allClients.indexOf(socket);
        allClients.splice(i, 1);
        io.emit('user-disconnection', 'user disconnected');
        io.emit('playerCount', allClients.length);
    });
});


//emit chat messages
io.on('connection', (socket) => {
    socket.on('chat message', (msg) => {
        console.log('message: ' + msg);
        io.emit('chat message', { msg: msg, nick: socket.nickname });
    })
});



http.listen(PORT, () => {
    console.log('listening on *:3000');
})

