import React from "react";
import ProgressCircle from "react-native-progress-circle";
import { View, Text, ScrollView, StyleSheet, Dimensions, Image, TouchableOpacity , Modal, TextInput ,Button} from "react-native";
import {Dialog} from 'react-native-simple-dialogs';
import LineChart from "react-native-responsive-linechart";
import firebase from 'react-native-firebase';
import RtcClient from '../RtcClient';
import Constants from "../Constants";
import NotificationListener from '../Managers/NotificationListener';



const languages = require('../Assets/Languages').hindi;

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
  },
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
      title: languages.appName,      
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
    this.state={
      data: [-10, -15, 40, 60, 78, 42, 56],
      user:null,
      modalVisible:true,
    };
    this.unsubscriber = null;
  }
  
  
 config = { 
  line: {
    visible: true,
    strokeWidth: 2,
    strokeColor: Constants.SECONDARY3
  },
  area: {
    visible: false
  },
  yAxis: {
    visible: true,
    labelFormatter: v => String(v),
    labelColor: "#fff",
  },
  xAxis: {
    visible: true
  },
  grid: {
    stepSize: 15,
    backgroundColor: Constants.CARD_BACKGROUND,
  },
  insetY: 10,
  insetX: 10,
  backgroundColor: Constants.CARD_BACKGROUND
};

  componentDidMount(){
    let rtc = new RtcClient();    
  }

  componentWillUnmount(){
    this.unsubscriber();
  }

  render(){

    //if(!this.state.user) this.props.navigation.replace('login');
    
    return(
      <ScrollView scrollDirection="vertical" contentContainerStyle={{justifyContent: 'center', alignItems: 'center', lexGrow: 1, backgroundColor: Constants.BACKGROUND}} 
        style={{flex: 1, width: Dimensions.get('screen').width}}>
        <NotificationListener/>

          <Dialog 
          visible={this.state.modalVisible}
          title='Add patient id'
          >
          <View
            width={Dimensions.get('screen').width/1.3}
            style={{alignItems:'center',justifyContent:'center',backgroundColor:'#fff', alignSelf: 'center'}}>

              <TextInput
                placeholder='patient id'
                numberOfLines={1}
                width={Dimensions.get('screen').width/2.3}
                underlineColorAndroid='#aaa'
                onChangeText={(text) => { this.peerEmail = text }}
              />
              <Button
                title='connect'
                onPress={()=>{
                  console.log(this.peerEmail);
                  this.setState({
                    modalVisible:false
                  })
                }}
              />

            </View>
          </Dialog>    
        
        <View style={{height: Dimensions.get('window').height/1.75, width: Dimensions.get('window').width-16,
            backgroundColor: Constants.CARD_BACKGROUND,
            padding: 10, marginVertical: 12, borderRadius: 8}}>
        <Text style={{fontSize: 18, fontWeight: 'bold', color: Constants.PRIMARY, alignSelf: 'flex-start'}}>{languages.hr}</Text>    
        <LineChart style={{ flex: 1 , margin:10,justifyContent:'center',alignItems:'center' }} config={this.config} data={this.state.data} />     
        </View>
        <Card src={require("../Assets/thermometer.png")} title={languages.temp} value="100 F" color={Constants.SECONDARY1} percent={40}/>
        <Card src={require("../Assets/oxygen.png")} title={languages.osl} value="160" color={Constants.SECONDARY2} percent={40}/>
        <Card src={require("../Assets/sugar.png")} title={languages.sl} value="20" color={Constants.SECONDARY3} percent={40}/>
        <Card src={require("../Assets/bloodPres.png")} title={languages.bp} value="140" color={Constants.SECONDARY1} percent={40}/>
    </ScrollView>
    );
  }
}
