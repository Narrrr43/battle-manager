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

    if (currentBattleData) {
        socket.emit('update_from_server', currentBattleData);
    }

    // 이름을 'update_data'로 일치시킵니다.
    socket.on('update_data', (data) => { 
        currentBattleData = data;
        // 마스터 화면뿐만 아니라 관전자 화면에도 즉시 반영되도록 io.emit 사용을 권장합니다.
        // 만약 본인(마스터) 화면이 중복 갱신되는 게 싫다면 기존처럼 socket.broadcast.emit을 쓰셔도 됩니다.
        io.emit('update_from_server', data); 
    });

    socket.on('disconnect', () => {
        console.log('접속 종료');
    });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
