import React, {Component} from 'react';
import { createStackNavigator } from "react-navigation";
import HomeScreen from "./src/Screens/HomeScreen";
import Video from "./src/Screens/Video";
import Constants from './src/Constants';
import Login from './src/Screens/LoginScreen';
import signUp from './src/Screens/signUp';


const AppNavigator = createStackNavigator(
  {
    home: HomeScreen,
    video: Video,
    login :Login,
    signUp : signUp,
  }
);
  
export default class App extends Component {
  render() {
    return (
      <AppNavigator/>
    );
  }
}
