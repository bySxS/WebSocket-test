const PORT = 5000
const fs = require('fs')
const {Server} = require("socket.io");
const io = new Server(PORT, { /* options */});
const ss = require('socket.io-stream')

io.of('/get-file').on('connection', (socket) => {

    console.log('opened connection')

    const stream = ss.createStream();
    const filename = './file/test1.txt'
    const statsFile = fs.statSync(filename)
    const fileSize = statsFile.size

    ss(socket).emit('big-file', stream, {
        fileName: './file/test2.txt',
        fileSize
    });


    let blobStream = fs.createReadStream(filename)

    let size = 0
    let lastProc = -1
    let Proc = 0
    blobStream.on('data', function (chunk) {
        size += chunk.length;
        Proc = Math.floor(size / fileSize * 100)
        if (lastProc !== Proc) {
            lastProc = Proc
            console.log(Proc + '%');
        }

    });

    blobStream.pipe(stream)

    socket.on('success', (data) => {
        console.log(data)
    })

})