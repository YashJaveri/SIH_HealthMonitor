import {
    RTCPeerConnection,
    RTCIceCandidate,
    RTCSessionDescription,
    RTCView,
    MediaStream,
    MediaStreamTrack,
    mediaDevices
  } from 'react-native-webrtc';

export default class RtcClient{

  static peerEmail=null; //set this before sending offer
  static videoUrl=null;  //static so that we dont need to create another RtcClient object in Video.js
  static email=null;
    

  constructor(){

    socketURl = 'ws://healthmonitor-signalserver.herokuapp.com'; 
    this.ws = new WebSocket(socketURl);

    configuration = {"iceServers": [{"url": "stun:stun.l.google.com:19302"}]};
    this.pc = new RTCPeerConnection(configuration);

    data={
        temp:null,
        heartRate:null,
        oxygenLvl:null,
        sugarLvl:null,
        bloodPressure:null,
    }

        //socket handelers 

       this.ws.onopen = ()=>{
            //connection opened

            console.log('ws connection opened');
            let msg = {
                type :'register',
                from : RtcClient.email, //send firebase email here
            }
            //send register request
           this.ws.send(JSON.stringify(msg));
        }

       this.ws.onmessage = (event)=>{

           console.log('ws message received');

            switch(event.data.type){
                
                case "candidate":
                    this.pc.addIceCandidate(new RTCIceCandidate(ev.data.candidate));
                    break;

                /*case "offer":
                    this.pc.setRemoteDescription(new RTCSessionDescription(ev.data.offer));

                    this.pc.createAnswer().then(answer => {

                        let msg={
                            type: "answer",
                            from: RtcClient.email,
                            to: RtcClient.peerEmail,
                            answer: answer
                        }                    
                        this.ws.send(JSON.stringify(msg));
                    });     
                    break;*/

              case "answer":            
                this.pc.setRemoteDescription(new RTCSessionDescription(ev.data.answer));
                break;

              default:
                    console.log('switch case error');
                     break;   
            }


        }

       this.ws.onclose = (event)=>{
            console.log('websocket closed',event.code,event.reason);
        }


       this.ws.onerror = (event)=>{
            console.log('err in socket',event.message);
        }

        this.pc.onicecandidate = (event)=>{
            // send event.candidate to peer
            console.log('onIceCandidate');
           
            if(event && event.candidate){
               let msg={
                   type : 'candidate',
                   from: RtcClient.email,
                   to: RtcClient.peerEmail,
               }
            this.ws.send(JSON.stringify(msg));
            //create data channel before offer is created
            createDataChannel();
            }
           }

        this.pc.onaddstream = (stream)=>{
           RtcClient.videoUrl = stream.toUrl();
        }   
  }

 createDataChannel = ()=>{
    if (this.pc.textDataChannel) {
        return;
        }

        var dataChannel = this.pc.createDataChannel("text");
    
        dataChannel.onerror = function (error) {
            console.log("dataChannel.onerror", error);
        };
    
        dataChannel.onmessage = function (event) {    
            console.log("dataChannel.onmessage:", event.data);

            switch(event.data.type){
                case 'temp': this.data.temp = event.data.value;
                        break;
                case 'temp': this.data.temp = event.data.value;
                break;
                case 'temp': this.data.temp = event.data.value;
                break;                
                case 'temp': this.data.temp = event.data.value;
                break;                        
            }
        };
    
        dataChannel.onopen = function () {
            console.log('dataChannel.onopen');
        };
    
        dataChannel.onclose = function () {
            console.log("dataChannel.onclose");
        };
    
        this.pc.textDataChannel = dataChannel;
    }  
    

 sendOffer = ()=>{
    this.pc.createOffer().then(desc => {
        this.pc.setLocalDescription(desc).then(() => {
            // Send pc.localDescription to peer
            let msg ={
                type:'offer',
                to: RtcClient.peerEmail, 
                from: RtcClient.email,
                offer:this.pc.localDescription,
            }
           this.ws.send(JSON.stringify(msg));
           console.log('local description ',pc.localDescription);
        });
    });
 }
}