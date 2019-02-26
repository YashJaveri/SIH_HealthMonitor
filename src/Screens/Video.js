import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

import Constants from "../Constants";

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
      </View>
    );
  }
}
