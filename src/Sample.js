import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

import Constants from "../Constants";

const styles = StyleSheet.create({
  mainStyle: {
    flex: 1,
    backgroundColor: Constants.GREY1,
  }
});

export default class LoginScreen extends React.Component{

  static navigationOptions = ({ navigation }) => {
    return{
      title: navigation.getParam('title', "Omic Healthcare")+" " //extra space to avoid probs in Oxygen OS
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
