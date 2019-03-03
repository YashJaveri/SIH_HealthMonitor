import React from "react";
<<<<<<< HEAD
import { View, Text, TouchableOpacity, StyleSheet,AsyncStorage } from "react-native";
=======
import { View, Text, TouchableOpacity, StyleSheet, AsyncStorage } from "react-native";
>>>>>>> 54946a17ef4170df165730fab507743c1702b7c6
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

const notifManager = require("../Managers/NotificationManager");

export default class SplashScreen extends React.Component{

  static navigationOptions = ({ navigation }) => {
    return{
      title: navigation.getParam('title', "Arogya")+" " //extra space to avoid probs in Oxygen OS
    }
  }

  constructor(props){
    super(props);
    this.state ={

    }
    this.unsubscriber=null;
  }
  
  componentDidMount(){
    notifManager.checkPermissions();

    AsyncStorage.getItem('patientList').then((res)=>{
      this.patientList = res
    }).catch((err)=>{
      console.log(err);
    })

    //check user auth 
    this.unsubscriber = firebase.auth().onAuthStateChanged( (user) =>{
        if(!user){
            this.props.navigation.replace('login');
        }else{
            RtcClient.email = user.email;
            
            AsyncStorage.getItem("Number", "").then((numb) => {
              RtcClient.phoneNumb = numb;
              
              this.props.navigation.replace('home',{'patientList':this.patientList});
            });
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