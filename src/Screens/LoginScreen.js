import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, 
  Platform, StatusBar, Dimensions, TextInput, ToastAndroid, AsyncStorage, Alert } from "react-native";
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

export default class LoginScreen extends React.Component {

  static navigationOptions = ({ navigation }) => {
    return {
      header: null
    }
  }

  constructor(props) {
    super(props);
    this.password = "";
    this.email = "";
  }

  componentDidMount() {
    Platform.OS === "android" ? StatusBar.setBackgroundColor("#261C34") : (null);
    StatusBar.setBarStyle('light-content', true);
    <View style={styles.mainStyle}>
      <Text style={{ fontSize: 24, marginVertical: Dimensions.get('screen').height / 6, fontWeight: 'bold', color: Constants.PRIMARY }}>WELCOME</Text>
      <View style={[styles.inpBox, { borderBottomWidth: 0.75, borderTopLeftRadius: 6, borderTopRightRadius: 6 }]}>
        <TextInput placeholderTextColor={Constants.LIGHT_GREY}
          style={{ color: Constants.PRIMARY }}
          selectionColor={Constants.SECONDARY1}
          placeholder="Email"
          numberOfLines={1}
          secureTextEntry={true}
          onChangeText={(text) => { this.email = text }}
          autoFocus={true}
        />
      </View>
      <View style={[styles.inpBox, { borderTopWidth: 0.75, borderBottomLeftRadius: 6, borderBottomRightRadius: 6 }]}>
        <TextInput placeholderTextColor={Constants.LIGHT_GREY}
          style={{ color: Constants.PRIMARY }}
          selectionColor={Constants.SECONDARY1}
          placeholder="Password"
          numberOfLines={1}
          secureTextEntry={true}
          onChangeText={(text) => { this.password = text }}
        />
      </View>
      <TouchableOpacity onPress={() => this.login(this.email, this.password)} activeOpacity={0.8}>
        <View style={{
          width: Dimensions.get('screen').width / 1.5, height: 42, borderWidth: 2, borderRadius: 24, borderColor: Constants.PRIMARY,
          marginVertical: 42, justifyContent: 'center', alignItems: 'center'
        }}>
          <Text style={{ fontSize: 16, color: Constants.PRIMARY }}>Login</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => this.props.navigation.replace('signUp')}>
        <Text style={{ color: Constants.SECONDARY1, fontWeight: 'bold' }}>Sign UP</Text>
      </TouchableOpacity>
    </View>
  }

  login = (email, password) => {

    if (email !== "" && password !== "") {
      firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCred) => {
          console.log('user logged in');
          RtcClient.email = email;
          AsyncStorage.getItem("Number").then((numb) => {
            RtcClient.phoneNumb = numb;
            this.props.navigation.replace('home');
          });          
        })
        .catch((err) => {
          Alert.alert('Authentication failed');
        })
    }
    else
      ToastAndroid.show('Invalid Input', ToastAndroid.SHORT);
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
        <View style={[styles.inpBox, { borderTopWidth: 0.75, borderBottomLeftRadius: 6, borderBottomRightRadius: 6 }]}>
          <TextInput placeholderTextColor={Constants.LIGHT_GREY}
            style={{ color: Constants.PRIMARY }}
            selectionColor={Constants.SECONDARY1}
            placeholder="Password"
            secureTextEntry={true}
            numberOfLines={1}
            onChangeText={(text) => { this.password = text }}
          />
        </View>
        <TouchableOpacity onPress={() => this.login(this.email, this.password)} activeOpacity={0.8}>
          <View style={{
            width: Dimensions.get('screen').width / 1.4, height: 42, borderWidth: 2, borderRadius: 24, borderColor: Constants.PRIMARY,
            marginTop: 46, marginBottom: 24, justifyContent: 'center', alignItems: 'center'
          }}>
            <Text style={{ fontSize: 16, color: Constants.PRIMARY }}>Login</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.props.navigation.replace('signUp')}>
          <Text style={{ color: Constants.SECONDARY1, fontWeight: 'bold' }}>Not Registerd? Register</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
