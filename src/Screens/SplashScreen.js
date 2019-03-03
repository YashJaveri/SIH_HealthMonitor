import React from "react";
import { View, Text, Animatable, StyleSheet, AsyncStorage } from "react-native";
import firebase from 'react-native-firebase';
import Constants from "../Constants";
import RtcClient from '../RtcClient';

const styles = StyleSheet.create({
  mainStyle: {
    flex: 1,
    backgroundColor: Constants.BACKGROUND,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcome: {
    fontSize: 42,
    fontFamily: "lobster",
    color: Constants.PRIMARY
  },
  bottom: {
    fontSize: 24,
    fontFamily: "opensans",
    color: Constants.PRIMARY,
    margin: 2
  },
});

const notifManager = require("../Managers/NotificationManager");

export default class SplashScreen extends React.Component {

  static navigationOptions = ({ navigation }) => {
    return {
      header: null,
    }
  }

  constructor(props) {
    super(props);
    this.state = {

    }
    this.unsubscriber = null;
  }

  componentDidMount() {
    notifManager.checkPermissions();

    AsyncStorage.getItem('patientList').then((res) => {
      this.patientList = res
    }).catch((err) => {
      console.log(err);
    })

    //check user auth 
    this.unsubscriber = firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        this.props.navigation.replace('login');
      } else {
        RtcClient.email = user.email;

        AsyncStorage.getItem("Number", "").then((numb) => {
          RtcClient.phoneNumb = numb;
          setTimeout(() => { this.props.navigation.replace('home', { 'patientList': this.patientList }); }, 2000);
        });
      }
    });
  }

  componentWillUnmount() {
    this.unsubscriber();
  }

  render() {
    return (
      <View style={styles.mainStyle}>
        <View style={{ flex: 1 }} />
        <Text
          style={styles.welcome}>
          AROGYA
      </Text>
        <View style={{ flex: 1 }} />
        <Text style={[styles.bottom, { textAlign: "center" }]}>
          {"Made with 💕"}
        </Text>
        <Text
          style={{
            fontSize: 26,
            fontWeight: "bold",
            marginBottom: 50,
            textAlign: "center",
            color: Constants.PRIMARY
          }}
        >
          {"TEAM TICCA"}
        </Text>
      </View>
    );
  }
}