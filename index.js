
import {AppRegistry, StatusBar} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import NotificationManager from './src/Managers/NotificationManager';

StatusBar.setBackgroundColor("#261C34")

AppRegistry.registerComponent(appName, () => App);

AppRegistry.registerHeadlessTask('RNFirebaseBackgroundMessage', () => Notfication.bgMessaging);
