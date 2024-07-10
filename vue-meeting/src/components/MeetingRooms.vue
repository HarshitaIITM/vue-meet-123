<template>
  <div v-if="checked">
    <div :style="containerStyle">
      <div style="position: relative">
        <video
          muted
          ref="userVideo"
          autoplay
          playsinline
          :style="styledVideo"
        ></video>
        <div :style="userDataOverlay">
          <span>
            <span :style="infoStyle">{{ username }}</span>
            <span :style="infoStyle">{{ audioEnabled ? "Audio Enabled" : "Muted" }}</span>
            <span :style="infoStyle">{{ videoEnabled ? "Video Enabled" : "Video Off" }}</span>
          </span>
        </div>
      </div>
      <video-component
        v-for="(peer, index) in peers"
        :key="index"
        :peer="peer"
        :username="peer.peerID"
      ></video-component>
      <div :style="buttonContainerStyle">
        <button :style="buttonStyle" @click="toggleVideo">
          {{ videoEnabled ? "Turn Off Video" : "Turn On Video" }}
        </button>
        <button :style="buttonStyle" @click="toggleAudio">
          {{ audioEnabled ? "Turn Off Audio" : "Turn On Audio" }}
        </button>
        <button v-if="!recording" :style="buttonStyle" @click="StartRecording">
          Start Recording
        </button>
        <button v-if="recording" :style="buttonStyle" @click="handleRecordingStop">
          Stop Recording
        </button>
        <button :style="buttonDisconnectStyle" class="disconnect" @click="handleLeaveMeeting">
          Leave Meeting
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import io from "socket.io-client";
import Peer from "simple-peer";
import VideoComponent from "./VideoPage.vue"; // Assuming this component is correctly imported
import config from '../config.json';
import { mapState } from 'vuex';
import axios from 'axios';

const URL = config.URL || "http://localhost:8000"; // Default URL or from config

const videoConstraints = {
  height: window.innerHeight / 2,
  width: window.innerWidth / 2,
};

export default {
  components: {
    VideoComponent,
  },
  props: {
    checked: Boolean, // Controls whether to initialize socket connection
    meetingID: String,
    username: String,
  },
  data() {
    return {
      peers: [], // List of connected peers
      disconnect: false, // Flag to disconnect from the meeting
      videoEnabled: true, // Current video state
      audioEnabled: true, // Current audio state
      recording: false, // Recording state
      socketRef: null, // Socket.io instance
      userVideo: null, // Reference to user's video element
      userStream: null, // User's media stream
      mediaRecorder: null, // MediaRecorder instance
      recordedChunks: [], // Recorded chunks of media
      peersRef: [], // Reference to peers for signaling
    };
  },
  computed: {
    ...mapState(['allParticipant']),
    containerStyle() {
      return {
        display: "grid",
        gap: "10px",
        padding: "20px",
        height: "100vh",
        width: "90%",
        margin: "auto",
        alignContent: "center",
        justifyContent: "center",
        gridTemplateColumns: `repeat(auto-fit, minmax(200px, 1fr))`,
        gridTemplateRows: `repeat(auto-fit, minmax(200px, 1fr))`,
      };
    },
    styledVideo() {
      return {
        width: "100%",
        height: "100%",
        objectFit: "cover",
        position: "relative",
      };
    },
    userDataOverlay() {
      return {
        position: "absolute",
        bottom: "10px",
        left: "10px",
        background: "rgba(0, 0, 0, 0.0)",
        color: "white",
        padding: "2px 5px",
        borderRadius: "5px",
        fontSize: "12px",
      };
    },
  },
  watch: {
    checked: 'initializeSocket', // Watch for changes in checked prop to initialize socket
  },
  mounted() {
    // console.log('particiapnt', allParticipant)
    this.userVideo = this.$refs.userVideo; // Assign userVideo reference
    this.initializeSocket();
  },
//   methods: {
//     initializeSocket() {
//       if (this.checked) {
//         this.socketRef = io.connect(URL); // Connect to Socket.io server
//         navigator.mediaDevices
//           .getUserMedia({ video: true, audio: true })
//           .then((stream) => {
//             this.userStream = stream; // Store user's media stream
//             this.userVideo.srcObject = stream; // Set user's video element source
//             this.socketRef.emit("join room", this.meetingID); // Notify server of joining room

//             this.socketRef.on("all users", (users) => {
//               // Handle receiving list of all users in the room
//               const peers = [];
//               users.forEach((userID) => {
//                 const peer = this.createPeer(userID, this.socketRef.id, stream); // Create peer connection
//                 this.peersRef.push({
//                   peerID: userID,
//                   peer,
//                 });
//                 peers.push(peer);
//               });
//               this.peers = peers; // Update peers list
//             });

//             this.socketRef.on("user joined", (payload) => {
//               // Handle a new user joining the room
//               const peer = this.addPeer(payload.signal, payload.callerID, stream); // Add peer to connection
//               this.peersRef.push({
//                 peerID: payload.callerID,
//                 peer,
//               });
//               this.peers.push(peer); // Update peers list
//             });

//             this.socketRef.on("receiving returned signal", (payload) => {
//               // Handle receiving returned signal from a peer
//               const item = this.peersRef.find((p) => p.peerID === payload.id);
//               if (item && item.peer) {
//                 item.peer.signal(payload.signal); // Signal the peer if peer object exists
//               }
//             });
//           })
//           .catch((error) => {
//             console.error('Error accessing media devices:', error);
//           });

//         // Handle disconnection if needed
//         this.disconnect && this.socketRef.emit("disconnect");
//       }
//     },
//     createPeer(userToSignal, callerID, stream) {
//       if (!stream) {
//         console.error("No stream provided");
//         return;
//       }
//       // Function to create a peer connection
//       const peer = new Peer({
//         initiator: true,
//         trickle: false,
//         stream,
//         config: {
//           iceServers: [
//             { urls: "stun:stun.l.google.com:19302" },
//             { urls: "stun:stun1.l.google.com:19302" },
//           ],
//         },
//       });

//       peer.on("signal", (signal) => {
//         this.socketRef.emit("sending signal", { userToSignal, callerID, signal }); // Send signal to server
//       });

//       return peer;
//     },
//     addPeer(incomingSignal, callerID, stream) {
//       // Function to add a peer connection
//       const peer = new Peer({
//         initiator: false,
//         trickle: false,
//         stream,
//         config: {
//           iceServers: [
//             { urls: "stun:stun.l.google.com:19302" },
//             { urls: "stun:stun1.l.google.com:19302" },
//           ],
//         },
//       });

//       peer.on("signal", (signal) => {
//         this.socketRef.emit("returning signal", { signal, callerID }); // Return signal to server
//       });

//       peer.signal(incomingSignal); // Signal incoming signal from peer

//       return peer;
//     },
//     toggleVideo() {
//       // Function to toggle video state
//       this.videoEnabled = !this.videoEnabled;
//       this.userStream.getVideoTracks()[0].enabled = this.videoEnabled; // Enable/disable video track
//     },
//     toggleAudio() {
//       // Function to toggle audio state
//       this.audioEnabled = !this.audioEnabled;
//       this.userStream.getAudioTracks()[0].enabled = this.audioEnabled; // Enable/disable audio track
//     },
//     StartRecording() {
//     if (this.recording) {
//     this.mediaRecorder.stop();
//     this.recording = false;
//   } else {
//     navigator.mediaDevices.getDisplayMedia({ video: true, audio: true }) // Request to capture screen and audio
//       .then((stream) => {
//         this.recordedChunks = [];
//         this.mediaRecorder = new MediaRecorder(stream);
//         this.mediaRecorder.ondataavailable = (event) => {
//           if (event.data.size > 0) {
//             this.recordedChunks.push(event.data);
//           }
//         };
//         this.mediaRecorder.onstop = this.handleRecordingStop.bind(this); // Bind the function to access 'this'
//         this.mediaRecorder.start();
//         this.recording = true;
//       })
//       .catch((err) => {
//         console.error('Error accessing media devices:', err);
//         // Handle errors, such as permission denied
//       });
//   }
// },
// handleRecordingStop(event) {
//   const blob = new Blob(this.recordedChunks, { type: 'video/webm' });

//   // Create a FileReader to read the blob as data URL
//   const reader = new FileReader();
//   reader.onload = () => {
//     const url = reader.result;
//     const a = document.createElement('a');
//     a.style.display = 'none';
//     a.href = url;
//     a.download = `${this.meetingID}.webm`;
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
//   };
//   reader.readAsDataURL(blob);
// }
// ,
//     handleLeaveMeeting() {
//       // // Function to handle leaving the meeting
//       // this.disconnect = true;
//       // window.location.href = "/"; // Redirect to home or another page after leaving
//       // Function to handle leaving the meeting
//     this.disconnect = true;
//     if (this.socketRef) {
//       this.socketRef.disconnect();
//     }
//     if (this.userStream) {
//       this.userStream.getTracks().forEach((track) => track.stop());
//     }
//     window.location.href = "/"; // Redirect to home or another page after leaving
       
//     },
//   },
methods: {
  initializeSocket() {
    if (this.checked) {
      this.socketRef = io.connect(URL); // Connect to Socket.io server
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          this.userStream = stream; // Store user's media stream
          this.userVideo.srcObject = stream; // Set user's video element source
          this.socketRef.emit("join room", this.meetingID); // Notify server of joining room

          this.socketRef.on("all users", (users) => {
            // Handle receiving list of all users in the room
            const peers = [];
            users.forEach((userID) => {
              const peer = this.createPeer(userID, this.socketRef.id, stream); // Create peer connection
              this.peersRef.push({
                peerID: userID,
                peer,
              });
              peers.push(peer);
            });
            this.peers = peers; // Update peers list
          });

          this.socketRef.on("user joined", (payload) => {
            // Handle a new user joining the room
            const peer = this.addPeer(payload.signal, payload.callerID, stream); // Add peer to connection
            this.peersRef.push({
              peerID: payload.callerID,
              peer,
            });
            this.peers.push(peer); // Update peers list
          });

          this.socketRef.on("receiving returned signal", (payload) => {
            // Handle receiving returned signal from a peer
            const item = this.peersRef.find((p) => p.peerID === payload.id);
            if (item && item.peer) {
              item.peer.signal(payload.signal); // Signal the peer if peer object exists
            }
          });
        })
        .catch((error) => {
          console.error('Error accessing media devices:', error);
        });

      // Handle disconnection if needed
      this.disconnect && this.socketRef.emit("disconnect");
    }
  },
  createPeer(userToSignal, callerID, stream) {
    if (!stream) {
      console.error("No stream provided");
      return;
    }
    // Function to create a peer connection
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
      config: {
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          { urls: "stun:stun1.l.google.com:19302" },
        ],
      },
    });

    peer.on("signal", (signal) => {
      this.socketRef.emit("sending signal", { userToSignal, callerID, signal }); // Send signal to server
    });

    return peer;
  },
  addPeer(incomingSignal, callerID, stream) {
    // Function to add a peer connection
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
      config: {
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          { urls: "stun:stun1.l.google.com:19302" },
        ],
      },
    });

    peer.on("signal", (signal) => {
      this.socketRef.emit("returning signal", { signal, callerID }); // Return signal to server
    });

    peer.signal(incomingSignal); // Signal incoming signal from peer

    return peer;
  },
  toggleVideo() {
    // Function to toggle video state
    this.videoEnabled = !this.videoEnabled;
    this.userStream.getVideoTracks()[0].enabled = this.videoEnabled; // Enable/disable video track
  },
  toggleAudio() {
    // Function to toggle audio state
    this.audioEnabled = !this.audioEnabled;
    this.userStream.getAudioTracks()[0].enabled = this.audioEnabled; // Enable/disable audio track
  },

  async StartRecording() {
  try {
    const response = await axios.get(`${URL}/startRecording`);
    if (response.status === 200) {
      console.log('Recording started.');
      this.recording = true;
    } else {
      console.error('Error starting recording:', response.data);
    }
  } catch (error) {
    console.error('Error starting recording:', error);
  }
},
async handleRecordingStop() {
  this.recording = false;
  try {
    const response = await axios.get(`${URL}/stopRecording`, {
      responseType: 'blob', // Set the response type to 'blob'
    });
    console.log('response', response)
    if (response.status === 200) {
      console.log('Recording stopped. Downloading file...');
      const blob = response.data;
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'output.mp4';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } else {
      console.error('Error stopping recording:', response.data);
    }
  } catch (error) {
    console.error('Error stopping recording:', error);
  }
},

  handleLeaveMeeting() {
    // Function to handle leaving the meeting
    this.disconnect = true;
    if (this.socketRef) {
      this.socketRef.disconnect();
    }
    if (this.userStream) {
      this.userStream.getTracks().forEach((track) => track.stop());
    }
    window.location.href = "/"; // Redirect to home or another page after leaving
  },
},

};
</script>

<style scoped>
/* Add any additional scoped styles here */
</style>


  <style scoped>
  /* Add any additional scoped styles here */
  </style>
  

  