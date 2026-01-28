const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

app.use(express.static('public'));

let currentBattleData = null;

io.on('connection', (socket) => {
    console.log('사용자 접속');

    // 새로 접속한 사람에게 현재 배틀 상태 전송
    if (currentBattleData) {
        socket.emit('update_from_server', currentBattleData);
    }

    // 누군가 배틀 데이터를 업데이트했을 때
    socket.on('sync_to_server', (data) => {
        currentBattleData = data;
        // 보낸 사람을 제외한 모든 접속자에게 전송
        socket.broadcast.emit('update_from_server', data);
    });

    socket.on('disconnect', () => {
        console.log('접속 종료');
    });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
