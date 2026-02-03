const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

app.use(express.static('public'));

let currentBattleData = null;

// [서버 코드 수정본]
io.on('connection', (socket) => {
    console.log('사용자 접속');

    // 접속하자마자 최신 데이터를 보내줌
    if (currentBattleData) {
        socket.emit('battleUpdate', currentBattleData);
    }

    // 누군가 데이터를 바꾸면 (이벤트명: battleUpdate)
    socket.on('battleUpdate', (data) => {
        currentBattleData = data;
        // 나를 포함한 '모든' 접속자에게 배고픔(데이터)을 전달
        io.emit('battleUpdate', data); 
    });

    socket.on('disconnect', () => {
        console.log('접속 종료');
    });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
