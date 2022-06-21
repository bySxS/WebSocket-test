const PORT = 5000
const fs = require('fs')
const { Server } = require("socket.io");

const io = new Server(PORT, { /* options */ });
const ss = require('socket.io-stream')
//путь файла куда сохранить от клиента
const filename = './file2/basegame_4_gamedata.archive'

io.of('/get-file').on('connection', (socket) => {

    console.log('opened connection')

        //отправить
    // const stream = ss.createStream();
    // ss(socket).emit('big-file', stream, {name: filename});
    // fs.createReadStream(filename).pipe(stream);

    ss(socket).on('big-file', (stream, data) => {
        stream.pipe(fs.createWriteStream(filename))
    });

})

