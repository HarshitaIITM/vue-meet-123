<template>
    <div :style="videoContainerStyle">
      <video
        playsinline
        autoplay
        ref="videoRef"
        :style="styledVideo"
      ></video>
      <div :style="userDataOverlay">
        <span>
          <span :style="infoStyle">{{ username }}</span>
          <span :style="infoStyle">{{ true ? "Audio Enabled" : "Muted" }}</span>
          <span :style="infoStyle">{{ true ? "Video Enabled" : "Video Off" }}</span>
        </span>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      peer: Object,
      username: String,
    },
    mounted() {
      this.peer.on("stream", (stream) => {
        this.$refs.videoRef.srcObject = stream;
      });
    },
    computed: {
      videoContainerStyle() {
        return {
          position: "relative",
          width: "100%",
          paddingTop: "56.25%",
          background: "black",
          ...(window.innerWidth <= 768 ? { paddingTop: "75%" } : {}),
        };
      },
      styledVideo() {
        return {
          position: "absolute",
          top: "0",
          left: "0",
          width: "100%",
          height: "100%",
          objectFit: "cover",
          ...(window.innerWidth <= 768 ? { objectFit: "contain" } : {}),
        };
      },
      userDataOverlay() {
        return {
          position: "absolute",
          bottom: "10px",
          left: "10px",
          background: "rgba(0, 0, 0, 0.6)",
          color: "white",
          padding: "2px 5px",
          borderRadius: "5px",
          fontSize: "12px",
          ...(window.innerWidth <= 768 ? { bottom: "5px", left: "5px", fontSize: "10px" } : {}),
        };
      },
      infoStyle() {
        return {
          color: "white",
          margin: "0 5px",
          backgroundColor: "grey",
          padding: "2px 5px",
          borderRadius: "5px",
        };
      },
    },
  };
  </script>
  
  <style scoped>
  </style>
  