import React from "react";
import ProgressCircle from "react-native-progress-circle";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

import Constants from "../Constants";

const styles = StyleSheet.create({
  mainStyle1: {
    backgroundColor: Constants.CARD_BACKGROUND,
    padding: 10, 
    margin: 8,
    height: 50,
    width: 50,
    flexDirection: 'column'
  }
});

export default class Card extends React.Component{

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
        <Text style={{fontSize: 18, fontWeight: 'bold', color: Constants.PRIMAY}}>{this.props.title}</Text>
        <ProgressCircle
             radius={50}
             borderWidth={6}
             percent={this.props.percent}
             color = {this.props.color}
             shadowColor={Constants.BACKGROUND}
             bgColor={Constants.CARD_BACKGROUND}
        />
        <Image src={require(this.props.src)} style={{width: 20, height: 20, color: Constants.GREY, position: 'absolute'}}/>
        <Text style={{fontSize: 16, color: Constants.PRIMAY}}>{this.props.value}</Text>
      </View>
    );
  }
}
