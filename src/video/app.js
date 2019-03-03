let startButton = document.getElementById("start");
let stopButton = document.getElementById("stop");
let videoView = document.querySelector("video");
let serv;

startButton.onclick = () => {
  serv = new Server();
  serv.start();
};

stopButton.onclick = () => {
  serv.stop();
};

function Server() {}
Server.prototype.start = function() {
  navigator.mediaDevices
    .getUserMedia({ video: true, audio: true })
    .then(stream => {
      this.videoStream = stream;
      this.socketConnection = new WebSocket("ws://healthmonitor-signalserver.herokuapp.com");
      this.socketConnection.onopen = ev => {
        videoView.srcObject = stream;
        //console.log(stream);
        this.socketConnection.send(
          JSON.stringify({
            type: "register",
            from: "a@a"
          })
        );
        this.peerConnection = new RTCPeerConnection({
          iceServers: [{ urls: "stun:stun.1.google.com:19302" }]
        });
        stream.getTracks().forEach((t)=>{
          this.peerConnection.addTrack(t,stream);
          console.log(t.id);
        })
        this.createDataChannel();
        this.peerConnection.onicecandidate = ev => {
          if (ev.candidate) {
            this.socketConnection.send(
              JSON.stringify({
                type: "candidate",
                from: "a@a",
                to: "yjaveri99@gmail.com",
                candidate: ev.candidate
              })
            );
          }
        };

        this.peerConnection.onconnectionstatechange = p => {
          if (this.peerConnection.connectionState in ["connected", "completed"]) {
            // this.createDataChannel();
          }
        };

        this.peerConnection.ondatachannel = ev => {
          console.log(ev.channel);
        };

        this.socketConnection.onmessage = ev => {
          let data = JSON.parse(ev.data);
          console.log(data);
          switch (data.type) {
            case "candidate":
              if (data.candidate) {
                this.peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
              }
              break;
            case "offer":
              console.log(data.offer);
              this.peerConnection.setRemoteDescription(new RTCSessionDescription(data.offer)).then(() => {
                this.peerConnection.createAnswer().then(answer => {
                  this.peerConnection.setLocalDescription(answer).then(() => {
                    this.socketConnection.send(
                      JSON.stringify({
                        type: "answer",
                        from: "a@a",
                        to: data.user,
                        answer: answer
                      })
                    );
                    this.to = data.from;
                  });
                });
              });
              break;
            case "answer":
              this.peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
              break;
            default:
          }
        };
      };
    })
    .catch(err => {
      alert(err.message);
    });
};
Server.prototype.createDataChannel = function() {
  this.dataChannel = this.peerConnection.createDataChannel("dataChannel");
  this.dataChannel.onerror = (err)=>{
    console.log(err);
  }
  this.dataChannel.onopen = e => {
    console.log(e.type);
    this.temperatureInterval = setInterval(() => {
      let temp = `${Math.round(100 + Math.random() * Math.pow(-1, Math.round(Math.random() * 10)) * 10)}`;
      this.dataChannel.send(JSON.stringify({ type: "temp", value: temp }));
    }, 500);
    this.bloodPressureInterval = setInterval(() => {
      let bp = `${Math.round(100 + Math.random() * Math.pow(-1, Math.round(Math.random() * 10)) * 10)}/${Math.round(
        100 + Math.random() * Math.pow(-1, Math.round(Math.random() * 10)) * 10
      )}`;
      this.dataChannel.send(JSON.stringify({ type: "bp", value: bp }));
    }, 2000);
    this.bloodSugarInterval = setInterval(() => {
      let bs = `${Math.round(100 + Math.random() * Math.pow(-1, Math.round(Math.random() * 10)) * 10)}`;
      this.dataChannel.send(
        JSON.stringify({
          type: "bs",
          value: bs
        })
      );
    }, 1000);
    this.heartRateInterval = setInterval(() => {
      let hr = `${Math.round(50 + Math.random() * Math.pow(-1, Math.round(Math.random() * 10)) * 10)}`;
      this.dataChannel.send(
        JSON.stringify({
          type: "hr",
          value: hr
        })
      );
    },2500);
    this.oxygenSaturationInterval = setInterval(() => {
      let os = `${Math.round(80 + Math.random() * Math.pow(-1, Math.round(Math.random() * 10)) * 10)}`;
      this.dataChannel.send(
        JSON.stringify({
          type: "os",
          value: os
        })
      );
    }, 1500);
  };
  //console.log(this.videoStream);
  /*this.videoStream.getTracks().forEach(t => {
    this.peerConnection.addTrack(t, this.videoStream);
  });*/
};
Server.prototype.stop = function() {
  this.socketConnection.close();
  videoView.srcObject = null;
  this.videoStream.getTracks().forEach(t => {
    t.stop();
  });
};
