import {
    RTCPeerConnection,
    RTCIceCandidate,
    RTCSessionDescription,
    RTCView,
    MediaStream,
    MediaStreamTrack,
    mediaDevices
} from 'react-native-webrtc';

export default class RtcClient {

    static peerEmail = "hari@kanpur"; //set this before sending offer
    static videoUrl = null;  //static so that we dont need to create another RtcClient object in Video.js
    static email = 'yjaveri99@gmail.com';
    static phoneNumb = "";
    static data = {
        temp: 100.5,
        osl: 75,
        sl: 75,
        hr: null,
        bp: {
            hbp: 100,
            lbp: 80
        }
    };

    constructor() {
        socketURl = 'ws://healthmonitor-signalserver.herokuapp.com';
        this.ws = new WebSocket(socketURl);

        configuration = {
            "iceServers": [
                { "url": "stun:stun.l.google.com:19302" }
            ]
        };
        this.pc = new RTCPeerConnection(configuration);
        //socket handelers 

        this.ws.onopen = () => {
            //connection opened
            console.log('ws connection opened');
            let msg = {
                type: 'register',
                phone: RtcClient.phoneNumb,
                from: RtcClient.email, //send firebase email here
            }
            //send register request
            this.ws.send(JSON.stringify(msg));
            //console.log(JSON.stringify(msg));
            console.log('rtc peer email',RtcClient.peerEmail);
            console.log('rtc email',RtcClient.email);
            this.createDataChannel();
            this.sendOffer();
        }

        this.ws.onmessage = (event) => {
            console.log(event.data);
            const jsonMessage = JSON.parse(event.data);
            switch (jsonMessage.type) {
                case "candidate":
                    console.log("CANDID");
                    this.pc.addIceCandidate(new RTCIceCandidate(jsonMessage.candidate));
                    break;

                case "answer":
                    this.pc.setRemoteDescription(new RTCSessionDescription(jsonMessage.answer));
                    break;

                default:
                    break;
            }
        }

        this.ws.onclose = (event) => {
            console.log('websocket closed', event.code, event.reason);
        }


        this.ws.onerror = (event) => {
            console.log('err in socket', event.message);
        }

        this.pc.onicecandidate = (event) => {
            // send event.candidate to peer
            console.log('onIceCandidate + ' + JSON.stringify(event.candidate));

            if (event && event.candidate) {
                let msg = {
                    type: 'candidate',
                    from: RtcClient.email,
                    to: RtcClient.peerEmail,
                    candidate: event.candidate
                }
                this.ws.send(JSON.stringify(msg));
            }
        }

        this.pc.ondatachannel = (event) => {
            console.log("incoming" + event);
            event.channel.onmessage = (ev) => {
                console.log(ev);
            }
        }

        this.pc.oniceconnectionstatechange = (event) => {
            console.log("event tag", event.target.iceConnectionState);
        }
    }

    sendOffer = () => {
        this.pc.createOffer({ offerToReceiveVideo: true, offerToReceiveAudio: true }).then(desc => {
            this.pc.setLocalDescription(desc).then(() => {
                // Send pc.localDescription to peer
                let msg = {
                    type: 'offer',
                    to: RtcClient.peerEmail,
                    from: RtcClient.email,
                    offer: this.pc.localDescription,
                }
                this.ws.send(JSON.stringify(msg));
                console.log('local description ', JSON.stringify(msg));
            });
        });
    }


    createDataChannel = () => {

        if (this.pc.textDataChannel) {
            return;
        }

        var dataChannel = this.pc.createDataChannel("text");

        dataChannel.onerror = function (error) {

            console.log("dataChannel.onerror", error);
        };

        dataChannel.onmessage = function (event) {
            //console.log("dataChannel.onmessage:" + event.data);
            let json = JSON.parse(event.data);
            switch (json.type) {
                case 'temp': RtcClient.data.temp = json.value;
                    break;
                case 'bp': RtcClient.data.bp.hbp = json.value.split("/")[0];
                RtcClient.data.bp.lbp = json.value.split("/")[1];
                    break;
                case 'bs': RtcClient.data.sl = json.value;
                    break;
                case 'os': RtcClient.data.osl = json.value;
                    break;
                case 'hr': RtcClient.data.hr = json.value;
                    break;
                default:console.log('switch case error');
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

}