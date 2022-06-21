const fs = require('fs')
const { io } = require("socket.io-client");
const ss = require('socket.io-stream');
const socket = io.connect("ws://localhost:5000/get-file");
//файл который нужно передать серверу
const filename = './file/basegame_4_gamedata.archive'
socket.on("connect_error", (err) => {
    console.log('error', err)
});

const statsFile = fs.statSync(filename)
const fileSize = statsFile.size// / (1024*1024);

const stream = ss.createStream();
ss(socket).emit('big-file', stream, {name: filename});
let blobStream = fs.createReadStream(filename)
let size = 0;

blobStream.on('data', function(chunk) {
    size += chunk.length;
    console.log(Math.floor(size / fileSize * 100) + '%');
    // -> e.g. '42%'
});

blobStream.pipe(stream)

//принять файл
// ss(socket).on('big-file', (stream, data) => {
//     const filename = './file2/basegame_4_gamedata.archive'
//     stream.pipe(fs.createWriteStream(filename))
// });