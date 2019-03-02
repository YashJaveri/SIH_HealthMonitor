// @flow
import firebase,{ RNFirebase } from 'react-native-firebase';
// Optional flow type
import type { RemoteMessage } from 'react-native-firebase';
import Constants from '../Constants';

notificationManager = {

    checkPermissions : function(){
        firebase.messaging().hasPermission()
          .then((permisson)=>{
      
          if(permisson){
            //user has given permisson
            console.log('permisson granted');
      
          }else{
      
            //permisson not granted
            //request permissons
      
            firebase.messaging().requestPermission()
              .then(()=>{
                //granted
                console.log('permisson granted');
              }).catch((err)=>{
                console.log(err);
              })
      
          }
        });
      },


    bgMessaging : async (message: RemoteMessage) => {
        // handle your message
    
        console.log('------------------------------------\n',message);
        return Promise.resolve();
    },


    getFcmToken: function(){

        return new Promise((resolve,reject)=>{
      
          firebase.messaging().getToken()
          .then((fcmToken)=>{
      
            if(fcmToken){
              //user has a token
             // console.log(fcmToken);
              Constants.fcmToken = fcmToken;
              resolve(fcmToken);
            }else{
      
              //doesnt have a TOKEN
      
              console.log('no token');
              reject('no fcm token');
            }
      
            });
      
        });
      },

      
      
    


}


module.exports = notificationManager;