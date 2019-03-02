import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import firebase from 'react-native-firebase';
import Constants from "../Constants";
import RtcClient from '../RtcClient';

const styles = StyleSheet.create({
  mainStyle: {
    flex: 1,
    backgroundColor: Constants.GREY1,
    justifyContent:'center',
    alignItems:'center',
  }
});

export default class SplashScreen extends React.Component{

  static navigationOptions = ({ navigation }) => {
    return{
      title: navigation.getParam('title', "Omic Healthcare")+" " //extra space to avoid probs in Oxygen OS
    }
  }

  constructor(props){
    super(props);
    this.state ={

    }
    this.unsubscriber=null;
  }
  
  componentDidMount(){

    //check user permission
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
        

    //check user auth 

    this.unsubscriber = firebase.auth().onAuthStateChanged( (user) =>{
        if(!user){
            this.props.navigation.replace('login');
            console.log('SplashScreen  user not logged in ');
        }else{
            RtcClient.email = user.email;
            console.log('splashscreen user logged in')
            this.props.navigation.replace('home');            
        }
      });

      
  }

  componentWillUnmount(){
    this.unsubscriber();
  }

  render(){
    return(
      <View style={styles.mainStyle}>
      <Text>SplashScreen</Text>
      </View>
    );
  }
}