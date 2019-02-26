import React, {Component} from 'react';
import { createStackNavigator } from "react-navigation";
import HomeScreen from "./src/Screens/HomeScreen";
import Video from "./src/Screens/Video";
import Constants from './src/Constants';

const AppNavigator = createStackNavigator(
  {
    home: HomeScreen,
    video: Video
  }
);
  
export default class App extends Component {
  render() {
    return (
      <AppNavigator/>
    );
  }
}
