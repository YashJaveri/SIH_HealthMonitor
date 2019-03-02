import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Platform, StatusBar,Dimensions, TextInput, AsyncStorage ,Alert } from "react-native";
import { createStackNavigator,createAppContainer } from "react-navigation";
import firebase from 'react-native-firebase';
import Constants from "../Constants";
import RtcClient from '../RtcClient';

const styles = StyleSheet.create({
  mainStyle: {
    flex: 1,
    backgroundColor: Constants.BACKGROUND,
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  inpBox: {
    width: Dimensions.get('screen').width/1.45,
    height: 42,
    borderWidth: 1.5,
    borderColor: Constants.LIGHTGREY
  }
});

export default class SignUp extends React.Component{

  static navigationOptions = ({ navigation }) => {
    return{
      header: null
    }
  }

  constructor(props){
    super(props);
    this.password = "";
    this.confirmPassword="";
    this.email = "";
  }

  componentDidMount(){
    Platform.OS==="android"?StatusBar.setBackgroundColor("#f5f6fa"):(null);
    StatusBar.setBarStyle('dark-content', true);
  }

  login =  (email, password , confirmPassword) => {


    if(password !== confirmPassword){
      Alert.alert('passwords do not match');
      return;
    }
    
    firebase.auth().createUserWithEmailAndPassword(email,password)
    .then( (userCred)=>{
      console.log('user created ');
      RtcClient.email = email;
      this.props.navigation.replace('home');
    })
    .catch( (err)=>{
      console.log('user creation error',err);
      Alert.alert('auth error');
    });
  
  }

  render(){
    return(
      <View style={styles.mainStyle}>
        <Text style={{fontSize: 24, marginVertical: Dimensions.get('screen').height/6, fontWeight: 'bold', color: 'white'}}>SignUp</Text>
        <View style={[styles.inpBox, { borderBottomWidth: 0.75, borderTopLeftRadius: 6, borderTopRightRadius: 6}]}>
          <TextInput style={{}}
            selectionColor={Constants.SECONDARY2}
            placeholder="Email"
            numberOfLines={1}
            onChangeText={(text) => {this.email = text}}
            autoFocus={true}
          />
        </View>
        <View style={[styles.inpBox, { borderTopWidth: 0.75, borderBottomLeftRadius: 6, borderBottomRightRadius: 6}]}>
          <TextInput style={{}}
            selectionColor={Constants.SECONDARY2}
            placeholder="Password"
            numberOfLines={1}
            onChangeText={(text) => {this.password = text}}
          />
        </View>
        <View style={[styles.inpBox, { borderTopWidth: 0.75, borderBottomLeftRadius: 6, borderBottomRightRadius: 6}]}>
          <TextInput style={{}}
            selectionColor={Constants.SECONDARY2}
            placeholder="confirm Password"
            numberOfLines={1}
            onChangeText={(text) => {this.confirmPassword = text}}
          />
        </View>
        <TouchableOpacity onPress={() => this.login(this.email, this.password , this.confirmPassword)} activeOpacity={0.8}>
          <View style={{ width: Dimensions.get('screen').width/1.4, height: 42, borderWidth: 2, borderRadius: 24, borderColor: Constants.SECONDARY,
            marginVertical: 42, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{fontSize: 16, color: 'white'}}>SignUp</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}
