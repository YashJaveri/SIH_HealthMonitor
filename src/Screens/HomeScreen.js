import React from "react";
import ProgressCircle from "react-native-progress-circle";
import { View, Text, ScrollView, StyleSheet, Dimensions, Image, TouchableOpacity, Modal, TextInput, Button, Picker, AsyncStorage , FlatList} from "react-native";
import { Dialog } from 'react-native-simple-dialogs';
import LineChart from "react-native-responsive-linechart";
import firebase from 'react-native-firebase';
import RtcClient from '../RtcClient';
import Constants from "../Constants";
import NotificationListener from '../Managers/NotificationListener';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';


const languages = require('../Assets/Languages');
const curLang = languages.english;

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
    width: Dimensions.get('screen').width - 12,
    borderRadius: 8,
    flexDirection: 'column'
  },
});

export class Card extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.mainStyle1}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: Constants.PRIMARY, alignSelf: 'flex-start' }}>
          {this.props.title}
        </Text>
        <View style={{ margin: 12, alignItems: 'center', justifyContent: 'center', marginTop: 4}}>
          <ProgressCircle
            radius={50}
            borderWidth={3}
            percent={this.props.percent}
            color={this.props.color}
            shadowColor={Constants.BACKGROUND}
            bgColor={Constants.CARD_BACKGROUND}
          />
          <Image source={this.props.src} style={{ width: 30, height: 30, opacity: 0.8, tintColor: Constants.LIGHT_GREY, position: 'absolute' }} />
        </View>
        <Text style={{ fontSize: 16, color: Constants.PRIMARY }}>{this.props.value}</Text>
      </View>
    );
  }
}


export default class HomeScreen extends React.Component {

  static navigationOptions = ({ navigation }) => {
    return {
      title: RtcClient.peerEmail,
      headerStyle: {
        backgroundColor: Constants.BACKGROUND,
        elevation: 0
      },
      headerRight: (
        <View>
          <Menu
            ref={navigation.getParam('setMenuRef')}
            button={<TouchableOpacity onPress={navigation.getParam('showMenu')} style={{ color: Constants.PRIMARY, fontWeight: 'bold' }}><Image source={require('../Assets/menu.png')}
              style={{ width: 20, height: 20, tintColor: Constants.PRIMARY, marginRight: 8 }} /></TouchableOpacity>}
          >
            <MenuItem onPress={navigation.getParam('changeLang')}>Change Language</MenuItem>
            <MenuItem onPress={navigation.getParam('changePatient')}>Change Patient</MenuItem>
            <MenuItem onPress={navigation.getParam('logOut')}>Logout</MenuItem>
          </Menu>
        </View>
      ),
      headerBackTitle: null,
      headerTintColor: Constants.PRIMARY,
      headerTitleStyle: {
        fontWeight: 'bold',
      }
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      data: [52,73,60,81, 65],
      user: null,
      isOn: true,
      dialogVisible: false,
      language: languages.english,
      patientDialog: false,
      
     };
    //this.unsubscriber = null;
  this.patientList=this.props.navigation.getParam('patientList',['a','b','c']);
  //   this.patientList=['a','b','c'];
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
      labelColor: "#ffffff",
    },
    xAxis: {
      visible: true
    },
    grid: {
      stepSize: 5,
      backgroundColor: Constants.CARD_BACKGROUND,
    },
    insetY: 10,
    insetX: 10,
    backgroundColor: Constants.CARD_BACKGROUND
  };

  componentDidMount() {
    let rtc = new RtcClient();
    setInterval(() => {
      let arr = this.state.data;
      if(arr.length > 10)
        arr.shift();
      arr.push(Math.round(RtcClient.data.hr));
      console.log("ARR ARR: "+arr);
      console.log("HR HR: "+this.state.data);
      console.log('hr ',RtcClient.data.hr);

      this.setState({data: arr});
    }, 30000);    


    this.props.navigation.setParams({
      lang: this.state.language, showMenu: this.showMenu, changeLang: this.changeLang,
      changePatient: this.changePatient, logOut: this.logOut, setMenuRef: this.setMenuRef
    });

    AsyncStorage.getItem('patient').then((res) => {
      if (res)
        this.patient = res;
      else {
        this.setState({
          patientDialog: true
        });
      }
    }).catch((err) => {
      console.log(err);
      this.setState({
        patientDialog: true
      });
    })
  }

  componentWillUnmount() {
    //this.unsubscriber();

    AsyncStorage.setItem('patientList',this.patientList).then(res=>{
      console.log(res);
    }).catch(err=>{
      console.log(err);
    })
  }

  camToggle = (on) => {
    this.setState({ isOn: on });
  }

  changeLang = () => {
    console.log('change language hit');
    this.setState({
      dialogVisible: true,
    });
    this.hideMenu();
  }

  changePatient = () => {
    console.log('change patient');
    this.setState({
      patientDialog: true
    });
    this.hideMenu();
  }

  logOut = () => {
    console.log('log out');
    firebase.auth().signOut();
    this.hideMenu();
    this.props.navigation.replace('login');
  }

  _menu = null;

  setMenuRef = ref => {
    this._menu = ref;
  };

  hideMenu = () => {
    this._menu.hide();
  };

  showMenu = () => {
    this._menu.show();
  };

  setPatient(patient){

//    RtcClient.peerEmail = patient;

    AsyncStorage.setItem('patient', patient).then((res) => {
      console.log(res);
    }).catch((err) => {
      console.log(err);
    });
    
    console.log('patient changed!!',RtcClient.peerEmail);
  }

  render() {
    //if(!this.state.user) this.props.navigation.replace('login');
    return (
      <View style={{ backgroundColor: Constants.BACKGROUND, flex: 1 }}>
        <ScrollView scrollDirection="vertical" contentContainerStyle={{
          justifyContent: 'center', alignItems: 'center',
          flexGrow: 1, backgroundColor: Constants.BACKGROUND, paddingBottom: 8, paddingHorizontal: 4
        }}
          style={{ flex: 1, width: Dimensions.get('screen').width }}>
          <NotificationListener />
          <Dialog
            visible={this.state.dialogVisible}
            title="Custom Dialog"
            onTouchOutside={() => this.setState({ dialogVisible: false })} >
            <View>
              <Picker
                selectedValue={this.state.language.name}
                style={{ height: 50, width: 200 }}
                onValueChange={(itemValue, itemIndex) => {
                  switch (itemIndex) {
                    case 0: this.setState({ language: languages.english });
                      this.setState({ dialogVisible: false });
                      break;
                    case 1: this.setState({ language: languages.hindi });
                      this.setState({ dialogVisible: false });
                      break;
                    case 2: this.setState({ language: languages.marathi });
                      this.setState({ dialogVisible: false });
                      break;
                    case 3: this.setState({ language: languages.gujrati });
                      this.setState({ dialogVisible: false });
                      break;
                    case 4: this.setState({ language: languages.urdu });
                      this.setState({ dialogVisible: false });
                      break;
                  }

                }
                }>
                <Picker.Item label="English" value="english" />
                <Picker.Item label="Hindi" value="hindi" />
                <Picker.Item label="Marathi" value="marathi" />
                <Picker.Item label="Gujrati" value="gujrati" />
                <Picker.Item label="Urdu" value="urdu" />
              </Picker>
            </View>
          </Dialog>

          <Dialog
            visible={this.state.patientDialog}
            title="Change Patient"
            onTouchOutside={() => this.setState({ patientDialog: false })} >
            <View>
              <TextInput placeholderTextColor='#000'
                style={{ color: Constants.BACKGROUND }}
                selectionColor={Constants.SECONDARY1}
                placeholder="Patient id"
                numberOfLines={1}
                onChangeText={(text) => { this.patient = text }}
                autoFocus={true}
              />
              <Button title='submit'
                color={Constants.BACKGROUND}
                onPress={() => {
                  
                  this.setPatient(this.patient);

                  this.setState({
                    patientDialog: false
                  });

                  
                  let arr =this.patientList;
                  ///arr.push(RtcClient.peerEmail);
                  this.patientList=arr;
                }
                
                } />

                <FlatList 
                  style={{marginTop:5}}
                  data={this.patientList}
                  renderItem={({item}) => <Text style={{color:'#000',fontSize:15}} onPress={(text)=>{
                    //set patient as this one
                    this.setPatient(text)
                  }}>{item}</Text>}
                />
            </View>
          </Dialog>
          <View style={{
            height: Dimensions.get('window').height / 1.75, width: Dimensions.get('window').width - 16,
            backgroundColor: Constants.CARD_BACKGROUND,
            padding: 10, marginVertical: 12, borderRadius: 8
          }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: Constants.PRIMARY, alignSelf: 'flex-start' }}>{this.state.language.hr}</Text>
            <LineChart style={{ flex: 1, margin: 10, justifyContent: 'center', alignItems: 'center' }} config={this.config} data={this.state.data} />
          </View>
          <Card src={require("../Assets/thermometer.png")} title={this.state.language.temp} value={`${RtcClient.data.temp} F`} color={RtcClient.data.temp >= 100.5 ? Constants.SECONDARY1 : Constants.SECONDARY2} percent={((RtcClient.data.temp - 95) / (20)) * 100} />
          <Card src={require("../Assets/oxygen.png")} title={this.state.language.osl} value={`${RtcClient.data.osl} %`} color={RtcClient.data.osl < 80 ? Constants.SECONDARY1 : Constants.SECONDARY2} percent={RtcClient.data.osl} />
          <Card src={require("../Assets/sugar.png")} title={this.state.language.sl} value={`${RtcClient.data.sl}`} color={(RtcClient.data.sl < 60 || RtcClient.data.sl > 120) ? Constants.SECONDARY1 : Constants.SECONDARY2} percent={((RtcClient.data.sl - 40) / (110)) * 100} />
          <View style={styles.mainStyle1}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: Constants.PRIMARY, alignSelf: 'flex-start' }}>
              {this.state.language.bp}
            </Text>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontSize: 25, fontWeight: 'bold', color: ((RtcClient.data.bp.hbp < 90 && RtcClient.data.bp.lbp < 60) || (RtcClient.data.bp.hbp > 150 && RtcClient.data.bp.lbp < 100)) ? Constants.SECONDARY1 : Constants.SECONDARY2, marginVertical: 1 }}>{`${RtcClient.data.bp.hbp}  SDP`}</Text>
              <Text style={{ fontSize: 25, fontWeight: 'bold', color: ((RtcClient.data.bp.hbp < 90 && RtcClient.data.bp.lbp < 60) || (RtcClient.data.bp.hbp > 150 && RtcClient.data.bp.lbp < 100)) ? Constants.SECONDARY1 : Constants.SECONDARY2, marginVertical: 1 }}>{`${RtcClient.data.bp.lbp}  DDP`}</Text>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}
