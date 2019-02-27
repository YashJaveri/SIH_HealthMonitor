import React from "react";
import ProgressCircle from "react-native-progress-circle";
import { View, Text, ScrollView, StyleSheet, Dimensions, Image, TouchableOpacity } from "react-native";

import Constants from "../Constants";

const styles = StyleSheet.create({
  mainStyle: {
    flex: 1,    
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: Constants.BACKGROUND,
    flexDirection: 'column'
  },
  mainStyle1: {
    backgroundColor: Constants.CARD_BACKGROUND,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 10, 
    margin: 8,
    height: 200,
    width: Dimensions.get('screen').width-12,
    borderRadius: 8,
    flexDirection: 'column'
  }
});

export class Card extends React.Component{
 constructor(props){
     super(props);
  }
render(){
    return(
    <View style={styles.mainStyle1}>
         <Text style={{fontSize: 18, fontWeight: 'bold', color: Constants.PRIMARY, alignSelf: 'flex-start'}}>
             {this.props.title}
         </Text>
         <View style={{margin: 12, alignItems: 'center', justifyContent: 'center'}}>
            <ProgressCircle
                radius={50}
                borderWidth={3}
                percent={50}
                color = {this.props.color}
                shadowColor={Constants.BACKGROUND}
                bgColor={Constants.CARD_BACKGROUND}
            />
            <Image source={this.props.src} style={{width: 30, height: 30, opacity: 0.8, tintColor: Constants.LIGHT_GREY, position: 'absolute'}}/>
        </View>   
        <Text style={{fontSize: 16, color: Constants.PRIMARY}}>{this.props.value}</Text>
      </View>
    );
    }
}

export default class HomeScreen extends React.Component{

  static navigationOptions = ({ navigation }) => {
    return{
      title: "Health Monitor",      
      headerStyle: {
        backgroundColor: Constants.BACKGROUND,
          elevation: 0
      },
      headerRight: (
        <View style = {{marginRight: 14, marginBottom: 2}} hitSlop={{top: 12, bottom: 12, left: 12, right: 12}}>
          <TouchableOpacity activeOpacity={0.6}>
            <Image
              style={{width: 22, height: 22, tintColor: Constants.PRIMARY}}
              source={require("../Assets/tv.png")}/>
          </TouchableOpacity>
        </View>),
      headerBackTitle: null,
      headerTintColor: Constants.PRIMARY,
      headerTitleStyle: {
        fontWeight: 'bold',
      }
    }
  }

  constructor(props){
    super(props);
  }
  
  render(){
    return(
      <ScrollView scrollDirection="vertical" contentContainerStyle={{justifyContent: 'center', alignItems: 'center', lexGrow: 1, backgroundColor: Constants.BACKGROUND}} 
        style={{flex: 1, width: Dimensions.get('screen').width}}>
        <View style={{height: Dimensions.get('window').height/1.75, width: Dimensions.get('window').width-16,
            backgroundColor: Constants.CARD_BACKGROUND,
            padding: 10, marginVertical: 12, borderRadius: 8,}}/>
        <Card src={require("../Assets/thermometer.png")} title="Temperature" value="100 F" color={Constants.SECONDARY1} percent={40}/>
        <Card src={require("../Assets/oxygen.png")} title="Oxygen Level" value="160" color={Constants.SECONDARY2} percent={40}/>
        <Card src={require("../Assets/sugar.png")} title="Sugar level" value="20" color={Constants.SECONDARY3} percent={40}/>
        <Card src={require("../Assets/bloodPres.png")} title="Blood Pressure" value="140" color={Constants.SECONDARY1} percent={40}/>
    </ScrollView>
    );
  }
}
