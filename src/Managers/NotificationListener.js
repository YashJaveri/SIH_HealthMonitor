import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Button ,Platform} from "react-native";
import { RemoteMessage, RNFirebase } from 'react-native-firebase';
import firebase from 'react-native-firebase';
import Constants from "../Constants";
const NotificationManager = require('./NotificationManager');

const myLogger=require('../myLogger');

export default class NotificationListener extends React.Component{

 counter =1;

 constructor(props){
     super(props);
     this.state={
         fcmToken: ``,
     };
 }
 makeNotification(title,body){
    
    let notification = new firebase.notifications.Notification({ show_in_foreground: true })
                        .android.setChannelId('test-channel')
                        .setNotificationId('id')
                        .setTitle(title)
                        .setBody(body)
                        .setSound("default")
                        .setData({custom:'custom'})
                        .android.setAutoCancel(true)
    //                    .android.setSmallIcon('ic_notification')
  //                      .android.setLargeIcon('ic_notification')
    //                    .android.setClickAction(body)
                        .android.setCategory(firebase.notifications.Android.Category.Alarm)

// Build a channel
const channelId = new firebase.notifications.Android.Channel('test-channel', 'test-channel', firebase.notifications.Android.Importance.Max);

// Create the channel
firebase.notifications().android.createChannel(channelId);

firebase.notifications().displayNotification(notification).catch(err=>{console.log(err)});                    

    myLogger('notification made',notification);    


}


processFCM(notification){

    myLogger('process FCM ',notification);
    try{
        title = notification.title;
        body  =  notification.body;
        this.makeNotification(title,body);
    }catch(err){
        console.error(err);
    }
}


getToken= async ()=> {
    let token= await NotificationManager.getFcmToken();
    myLogger('fcm token',token);
    this.setState({
        fcmToken: token,
    });
}

componentDidMount(){



    // Process your notification as required
    this.notificationDisplayedListener = firebase.notifications().onNotificationDisplayed((notification: Notification) => {
        // ANDROID: Remote notifications do not contain the channel ID. You will have to specify this manually if you'd like to re-display the notification.
     
      myLogger('NOTIFICATION Displayed',notification);

      });
  

      //firebase notification is received here
      //schedule notification on background are received here
      this.notificationListener = firebase.notifications().onNotification((notification: Notification) => {
        // Process your notification as required
        
        myLogger('NOTIFICAION RECEIVED',notification);
        this.processFCM(notification);
        //this.makeNotification(notification.title,notification.body);
  
        
     });

     this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen: NotificationOpen) => {
        // Get the action triggered by the notification being opened
        const action = notificationOpen.action;
        // Get information about the notification that was opened
        const notification: Notification = notificationOpen.notification;

        myLogger('opened notification action',action);
        myLogger('opened notification',notification);
    });
  
       
      //fcm stuff
      this.messageListener = firebase.messaging().onMessage((message : RemoteMessage)=>{
          //handle notification
          
          myLogger('fcm message listener',message);
          this.processFCM(message);
          
        });   



    firebase.notifications().getInitialNotification()
    .then((notificationOpen: NotificationOpen) => {
        if (notificationOpen) {
        // App was opened by a notification
        // Get the action triggered by the notification being opened
        const action = notificationOpen.action;
        // Get information about the notification that was opened
        const notification: Notification = notificationOpen.notification;  
        myLogger('initial notification action',action);
        myLogger('initial notification',notification);
        }
    });   

    this.getToken();
}

componentWillUnmount(){

    this.messageListener();
    this.notificationDisplayedListener();
    this.notificationListener();
    this.notificationOpenedListener();
}

render(){
    
    
    return(false && 
        <View>
            <Button
                title='immediate notification'
                onPress={()=>{this.makeNotification('any','any')}}
              />  
            <Button
                title='test local logic'
                onPress={()=>{this.test()}}
              />  
              <Text>{this.state.fcmToken}</Text>
        </View>
        
    );
}

}