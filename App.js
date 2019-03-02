import React, {Component} from 'react';
import { createStackNavigator } from "react-navigation";
import HomeScreen from "./src/Screens/HomeScreen";
import Video from "./src/Screens/Video";
import LoginScreen from './src/Screens/LoginScreen';
import SignUp from './src/Screens/SignUp';
import SplashScreen from './src/Screens/SplashScreen';

const AppNavigator = createStackNavigator(
  {
    splashScreen :SplashScreen,
    home: HomeScreen,
    video: Video,
    login :LoginScreen,
    signUp : SignUp,
  },
  {
    initialRouteName:'splashScreen',
  }
);
  
export default class App extends Component {
  render() {
    return (
      <AppNavigator/>
    );
  }
}
