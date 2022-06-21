const fs = require('fs')
const {io} = require("socket.io-client");
const ss = require('socket.io-stream');
const socket = io.connect("ws://localhost:5000/get-file");

socket.on("connect_error", (err) => {
    console.log('error', err)
});
// const stream = ss.createStream();


socket.on('connect', () => {

    console.log('connect client')

    ss(socket).on('big-file', (stream, data) => {

        let size = 0
        let lastProc = -1
        let Proc = 0
        stream.on('data', function (chunk) {
            size += chunk.length
            Proc = Math.floor(size / data.fileSize * 100)
            if (lastProc !== Proc) {
                lastProc = Proc
                console.log(Proc + '%')
            }
            if (100 === Proc) {
                socket.emit('success', {response: 'success, data received!'})
                socket.close()
            }
        })

        stream.pipe(fs.createWriteStream(data.fileName))

    })


})


//принять файл
// ss(socket).on('big-file', (stream, data) => {
//     const filename = './file2/basegame_4_gamedata.archive'
//     stream.pipe(fs.createWriteStream(filename))
// });