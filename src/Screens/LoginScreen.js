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

export default class LoginScreen extends React.Component{

  static navigationOptions = ({ navigation }) => {
    return{
      header: null
    }
  }

  constructor(props){
    super(props);
    this.password = "";
    this.email = "";
  }

  componentDidMount(){
    Platform.OS==="android"?StatusBar.setBackgroundColor("#f5f6fa"):(null);
    StatusBar.setBarStyle('dark-content', true);
  }

  login =  (email, password) => {


    firebase.auth().signInWithEmailAndPassword(email,password)
    .then( (userCred)=>{
      console.log('user logged in');
      RtcClient.email=email;
      this.props.navigation.replace('home');
    })
    .catch( (err)=>{
      console.log('user creation error',err);
      Alert.alert('auth error');
    })


  
  }

  render(){
    return(
      <View style={styles.mainStyle}>
        <Text style={{fontSize: 24, marginVertical: Dimensions.get('screen').height/6, fontWeight: 'bold', color: Constants.SECONDARY}}>WELCOME</Text>
        <View style={[styles.inpBox, { borderBottomWidth: 0.75, borderTopLeftRadius: 6, borderTopRightRadius: 6}]}>
          <TextInput style={{}}
            selectionColor={Constants.SECONDARY1}
            placeholder="Email"
            numberOfLines={1}
            onChangeText={(text) => {this.email = text}}
            autoFocus={true}
          />
        </View>
        <View style={[styles.inpBox, { borderTopWidth: 0.75, borderBottomLeftRadius: 6, borderBottomRightRadius: 6}]}>
          <TextInput style={{}}
            selectionColor={Constants.SECONDARY1}
            placeholder="Password"
            numberOfLines={1}
            onChangeText={(text) => {this.password = text}}
          />
        </View>
        <TouchableOpacity onPress={() => this.login(this.email, this.password)} activeOpacity={0.8}>
          <View style={{ width: Dimensions.get('screen').width/1.4, height: 42, borderWidth: 2, borderRadius: 24, borderColor: Constants.SECONDARY,
            marginVertical: 42, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{fontSize: 16, color: Constants.SECONDARY}}>Login</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={()=> this.props.navigation.replace('signUp')}>
        <Text>Sign UP</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
