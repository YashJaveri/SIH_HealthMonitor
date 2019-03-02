import BackgroundTask from 'react-native-background-task';
const myLogger = require('../myLogger');

BackgroundTask.define( ()=>{
    const socketUrl= '';
    const socket = new WebSocket(socketUrl);

    socket.onopen = ()=>{
        myLogger('socket connected');        
    }

    socket.onmessage = (event)=>{
        data = JSON.parse(event.data);
        myLogger('socket onMessage',data);
    } 

    socket.onclose = (event)=>{
        data = JSON.parse(event.data);
        myLogger('socket onClose',data);
        BackgroundTask.finish();
    }

    socket.onerror  =  (event)=>{
        data = JSON.parse(event.data);
        myLogger('socket onError',data);
        BackgroundTask.finish();
    }

});