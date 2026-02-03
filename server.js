const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

app.use(express.static('public'));

let currentBattleData = null;

io.on('connection', (socket) => {
    console.log('사용자 접속');

    if (currentBattleData) {
        socket.emit('battleUpdate', currentBattleData);
    }

    socket.on('battleUpdate', (data) => {
        currentBattleData = data;
        
        // [수정 추천] io.emit 대신 socket.broadcast.emit 사용
        // 마스터(본인)에게는 다시 보내지 않고, 관전자들에게만 전송합니다.
        // 이렇게 해야 마스터가 입력 중에 화면이 리셋되는 걸 막을 수 있습니다.
        socket.broadcast.emit('battleUpdate', data); 
    });

    socket.on('disconnect', () => {
        console.log('접속 종료');
    });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
