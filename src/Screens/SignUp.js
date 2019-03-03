import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Platform, StatusBar, Dimensions,
   TextInput, AsyncStorage, Alert } from "react-native";
import { createStackNavigator, createAppContainer } from "react-navigation";
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
    width: Dimensions.get('screen').width / 1.45,
    height: 42,
    borderWidth: 1.5,
    borderColor: Constants.PRIMARY
  }
});

export default class SignUp extends React.Component {

  static navigationOptions = ({ navigation }) => {
    return {
      header: null
    }
  }

  constructor(props) {
    super(props);
    this.password = "";
    this.confirmPassword = "";
    this.email = "";
    this.phoneNumb = "";
  }

  componentDidMount() {
    Platform.OS === "android" ? StatusBar.setBackgroundColor("#261C34") : (null);
    StatusBar.setBarStyle('light-content', true);
  }

  signUp = (email, password, confirmPassword, phoneNumb) => {


    if (password !== confirmPassword) {
      Alert.alert('Passwords do not match!');
      return;
    } else if (password === "" || email === "" || phoneNumb === "") {
      Alert.alert('Invalid input!');
      return;
    }
    AsyncStorage.setItem("Number", phoneNumb);
    RtcClient.phoneNumb = phoneNumb;



    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then((userCred) => {
        console.log('userCred',userCred);
        RtcClient.email = email;

        // if(phoneNumb){
        //   const ref = firebase.firestore().collection("Doctors").doc(userCred.user.uid);
    
        //   firestore.runTransaction(async transaction=>{
    
        //     const doc = transaction.get(ref);
    
        //     if(!doc.exist){
        //       transaction.set(ref,{
        //         uid:phoneNumb
        //       });
        //     }else{
        //       transaction.update(ref,{
        //         uid:phoneNumb
        //       });
        //     }
            
        //   });
        // }
            


        this.props.navigation.replace('home');
      })
      .catch((err) => {
        Alert.alert('Authentication failed');
        console.log('err',err);
      });
  }

  render() {
    return (
      <View style={styles.mainStyle}>
        <Text style={{ fontSize: 24, marginVertical: Dimensions.get('screen').height / 6, fontWeight: 'bold', color: Constants.PRIMARY }}>WELCOME</Text>
        <View style={[styles.inpBox, { borderBottomWidth: 0.75, borderTopLeftRadius: 6, borderTopRightRadius: 6 }]}>
          <TextInput placeholderTextColor={Constants.LIGHT_GREY}
            style={{ color: Constants.PRIMARY }}
            selectionColor={Constants.SECONDARY1}
            placeholder="Email"
            numberOfLines={1}
            onChangeText={(text) => { this.email = text }}
            autoFocus={true}
          />
        </View>
        <View style={[styles.inpBox, { borderTopWidth: 0.75, borderBottomWidth: 0.75 }]}>
          <TextInput placeholderTextColor={Constants.LIGHT_GREY}
            style={{ color: Constants.PRIMARY }}
            selectionColor={Constants.SECONDARY1}
            placeholder="Password"
            secureTextEntry={true}
            numberOfLines={1}
            onChangeText={(text) => { this.password = text }}
          />
        </View>
        <View style={[styles.inpBox, { borderTopWidth: 0.75, borderBottomWidth: 0.75}]}>
          <TextInput style={{}}
            placeholderTextColor={Constants.LIGHT_GREY}
            style={{ color: Constants.PRIMARY }}
            selectionColor={Constants.SECONDARY1}
            placeholder="Confirm Password"
            numberOfLines={1}
            secureTextEntry={true}
            onChangeText={(text) => { this.confirmPassword = text }}
          />
        </View>
        <View style={[styles.inpBox, { borderTopWidth: 0.75, borderBottomLeftRadius: 6, borderBottomRightRadius: 6 }]}>
          <TextInput style={{}}
            placeholderTextColor={Constants.LIGHT_GREY}
            style={{ color: Constants.PRIMARY }}
            selectionColor={Constants.SECONDARY1}
            placeholder="Phone Number"
            numberOfLines={1}
            onChangeText={(text) => { this.phoneNumb = text }}
          />
        </View>
        <TouchableOpacity onPress={() => this.signUp(this.email, this.password, this.confirmPassword, this.phoneNumb)} activeOpacity={0.8}>
          <View style={{
            width: Dimensions.get('screen').width / 1.5, height: 42, borderWidth: 2, borderRadius: 24, borderColor: Constants.PRIMARY,
            marginVertical: 42, justifyContent: 'center', alignItems: 'center'
          }}>
            <Text style={{ fontSize: 16, color: Constants.PRIMARY }}>Login</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.props.navigation.replace('login')}>
          <Text style={{ color: Constants.SECONDARY1, fontWeight: 'bold' }}>Already User? Sign In</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
