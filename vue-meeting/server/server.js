require('dotenv').config();
const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const socket = require("socket.io");
const fs = require('fs');
const io = socket(server);
const path = require('path');
const { v4: uuid } = require('uuid');
const axios = require('axios');
const recorder = require('record-screen');
let recordingProcess = null;
let outputFile = null;

const DSS_URL = process.env.DSS_URL || 'http://localhost:3000';

app.use(express.json());
app.use(express.static(path.join(__dirname ,'./../dist')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './../dist', 'index.html'));
});

// using cors to allow cross-origin requests
const cors = require('cors');
app.use(cors());


app.post('/createRoom', async (req, res) => {
    console.log("room called")
    const roomID = uuid();
    const clientID = req.body.client_id;
    const URL = req.body.URL;
    let ParticipantNumber = req.body.participant.length;
    let offerlist = [];
    let typeList = [];
    let meetlink=[];
    let participants = req.body.participant;
    if(ParticipantNumber>4){
        res.status(400).send("Max 3 participants allowed");
    }
    for (let i = 0; i < ParticipantNumber; i++) {
        offerlist.push(Math.floor(1000 + Math.random() * 9000));
        meetlink.push(`${URL}/room?mID=${roomID}&oID=${offerlist[i]}`);
        if(i==0){
            typeList.push("host");
        }
        else{
            typeList.push("participant");
            meetlink[i]= meetlink[i]+"&t=P";
        }
    }
    console.log("offerlist", offerlist);
    if (clientID === null || clientID === undefined) {
        res.status(400).send("client_id is required");
    }
    try{
        let response = await axios.post(`${DSS_URL}/nl/addMeeting`, { meetingID: roomID, numberOfParticipants: ParticipantNumber, clientID: clientID, typeList: typeList, participants: participants, offeridList: offerlist });
        console.log(response.data);
        res.status(200).send({ roomID, offerlist, meetlink });
    }
    catch(err){
        console.log(err);
    }
});


app.get('/startRecording', async (req, res) => {
    console.log("start called1")
    const options = {
      width: 1920,
      height: 1080,
      output: './uploads/output.mp4', // Output file path in public directory
      framerate: 30,
    };
  
    if (!recordingProcess) {
        console.log("start called")
      try {
        outputFile = path.resolve(__dirname, options.output);
        recordingProcess = await recorder(options);
        res.send('Recording started.');
      } catch (err) {
        console.error('Recording error:', err);
        res.status(500).send('Error starting recording.');
      }
    } else {
      res.send('Recording already in progress.');
    }
  });
  app.get('/stopRecording', (req, res) => {
    console.log("stop called")
    if (recordingProcess) {
      recordingProcess.kill();
      recordingProcess = null;
      res.set({
        'Content-Type': 'video/mp4',
        'Content-Disposition': 'inline; filename=output.mp4', // or 'attachment; filename=output.mp4'
      });
      res.sendFile(outputFile, (err) => {
        if (err) {
          console.error('Error sending file:', err);
          res.status(500).send('Error sending file.');
        } else {
          console.log('File sent successfully.');
          // Optionally, delete the file after sending if needed
          // fs.unlinkSync(outputFile);
        }
      });
    } else {
      res.status(404).send('No recording in progress.');
    }
  });
  




const users = {};

const socketToRoom = {};
// Listen for connections
io.on('connection', socket => {
    socket.on("join room", roomID => {
        if (users[roomID]) {
            const length = users[roomID].length;
            if (length === 4) {
                socket.emit("room full");
                return;
            }
            users[roomID].push(socket.id);
        } else {
            users[roomID] = [socket.id];
        }
        socketToRoom[socket.id] = roomID;
        const usersInThisRoom = users[roomID].filter(id => id !== socket.id);

        socket.emit("all users", usersInThisRoom);
    });

    socket.on("sending signal", payload => {
        // Broadcasting the messange to users
        io.to(payload.userToSignal).emit('user joined', { signal: payload.signal, callerID: payload.callerID });
    });

    socket.on("returning signal", payload => {
        io.to(payload.callerID).emit('receiving returned signal', { signal: payload.signal, id: socket.id });
    });

    socket.on('disconnect', () => {
        const roomID = socketToRoom[socket.id];
        let room = users[roomID];
        if (room) {
            room = room.filter(id => id !== socket.id);
            users[roomID] = room;
        }
    });
  
});


let port = process.env.PORT || 8000;

server.listen(port, () => console.log(`server is running on port ${port}`));



