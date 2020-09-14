var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

let content = 'Hello, World!';
let opCounter = 0;

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.emit('e_init', content);

    socket.on('e_ops', (args) => {
        let operations = args;
        console.log('Received ops', JSON.stringify(operations));

        operations.forEach(op => {
            console.log('Op: ', op);
            op.order = opCounter;
            opCounter++;
        });

        socket.broadcast.emit('e_ops', operations);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

});

http.listen(3000, () => {
    console.log('listening on *:3000');
});