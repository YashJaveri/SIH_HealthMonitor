
import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import {
    RTCPeerConnection,
    RTCIceCandidate,
    RTCSessionDescription,
    RTCView,
    MediaStream,
    MediaStreamTrack,
    mediaDevices
  } from 'react-native-webrtc';


const configuration = {"iceServers": [{"url": "stun:stun.l.google.com:19302"}]};
const pc = new RTCPeerConnection(configuration);


function createDataChannel(){
if (pc.textDataChannel) {
    return;
    }
    var dataChannel = pc.createDataChannel("text");

    dataChannel.onerror = function (error) {
    console.log("dataChannel.onerror", error);
    };

    dataChannel.onmessage = function (event) {
    console.log("dataChannel.onmessage:", event.data);
    container.receiveTextData({user: socketId, message: event.data});
    };

    dataChannel.onopen = function () {
    console.log('dataChannel.onopen');
    container.setState({textRoomConnected: true});
    };

    dataChannel.onclose = function () {
    console.log("dataChannel.onclose");
    };

    pc.textDataChannel = dataChannel;
}  


export default class Test extends Component {

    state = {
        videoURL: null,
        isFront: true
    }



    componentDidMount(){

       

        const {isFront} = this.state;
        mediaDevices.enumerateDevices().then(sourceInfos => {
        console.log(sourceInfos);
        let videoSourceId;
        for (let i = 0; i < sourceInfos.length; i++) {
            const sourceInfo = sourceInfos[i];
            if(sourceInfo.kind == "video" && sourceInfo.facing == (isFront ? "front" : "back")) {
            videoSourceId = sourceInfo.id;
            }
        }

        


        mediaDevices.getUserMedia({
                audio: true,
                video: {
                mandatory: {
                    minWidth: 500, // Provide your own width, height and frame rate here
                    minHeight: 300,
                    minFrameRate: 30
                },
                facingMode: (isFront ? "user" : "environment"),
                optional: (videoSourceId ? [{sourceId: videoSourceId}] : [])
                }
            })
            .then(stream => {
                // Got stream!
                console.log('Streaming OK', stream);
                this.setState({
                    videoURL: stream.toURL()
                });
                pc.addStream(stream);
            })
            .catch(error => {
                // Log error
                console.log('catch in getUserMedia',error);
                throw error;
            });
        });

        pc.createOffer().then(desc => {
        pc.setLocalDescription(desc).then(() => {
            // Send pc.localDescription to peer
            console.log('setLoclDescription');
        });
        });

        pc.onicecandidate = function (event) {
        // send event.candidate to peer
            console.log('onIceCandidate');

            if(event && event.candidate){

                pc.addIceCandidate(event.candidate);
            }
        };


        pc.oniceconnectionstatechange=function(event){
            console.log('oniceconnectionsstatechange',event.target.iceConnectionState);

            if (event.target.iceConnectionState === 'completed') {
                setTimeout(() => {
                  getStats();
                }, 1000);
              }
              if (event.target.iceConnectionState === 'connected') {
                createDataChannel();
              }
        }
// also support setRemoteDescription, createAnswer, addIceCandidate, onnegotiationneeded, oniceconnectionstatechange, onsignalingstatechange, onaddstream

    }


    render(){

        return(
            <RTCView streamURL={this.state.videoURL} style={styles.container}/>
        );
    }
 }

 const styles = {
    container: {
        flex: 1,
        backgroundColor: '#ccc',
        borderWidth: 1,
        borderColor: '#000'
    }
};

