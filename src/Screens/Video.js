import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

import { RTCView } from 'react-native-webrtc';
import Constants from "../Constants";
import RtcClient from '../RtcClient';

const styles = StyleSheet.create({
  mainStyle: {
    flex: 1,
    backgroundColor: Constants.GREY1,
  }
});

export default class Video extends React.Component{

  static navigationOptions = ({ navigation }) => {
    return{
      title: ""
    }
  }

  constructor(props){
    super(props);
    this.state ={

    }
  }
  
  componentDidMount(){

  }

  componentWillUnmount(){

  }

  render(){
    return(
      <View style={styles.mainStyle}>
      {
        RtcClient.videoUrl &&
        <RTCView streamURL={RtcClient.videoUrl} style={{flex : 1}}/>
      }
      </View>
    );
  }
}
