import React from "react"
import {View,Button} from "react-native"
import {createAppContainer,createSwitchNavigator,createStackNavigator,createDrawerNavigator} from "react-navigation"
import Login from "./../screens/Login"
import Splash from "./../screens/Splash"
import Verify from "./../screens/Verify"
import Loader from "./../screens/Loader"
import {
    FontAwesome as Icon
} from '@expo/vector-icons';
import SideMenu from "./../components/SideMenu"
import {OvalButton} from "./../components/ButtonGroup"
import HMapView from "./../screens/HMapView"
import Settings from './../screens/Settings'
import Landing from './../screens/Landing'
import History from "./../screens/History"
import RideDetail from "./../screens/RideDetail"
import NotificationView from "./../screens/NotificationView"
import SettingsScreen from "../screens/SettingsScreen";
import i18n from "i18n-js"

const en = require('./../constants/lang/en.json')
const ar = require('./../constants/lang/ar.json')
import * as Localization from "expo-localization"



//i18n.fallbacks = true
i18n.translations = {
    en,ar
}
const AuthStack = createStackNavigator({
    loader:Loader,
    splash:Landing,
    login:Login ,
    verify:Verify
},{
    initialRouteName:'loader', 
})



const TestScreen = (props) => <View>
    <View style ={{
        position:'absolute',
        top:20,
        left:20
    }}>

        <OvalButton size={50} onPress={
            ()=>props.navigation.toggleDrawer()
        } bg="#fff" >
            <Icon name="bars" color="#000" size={20}/>
        </OvalButton>

    </View>
</View>



const profileStack = createStackNavigator({
    OverView:{
        screen:Settings
    },
    PDetails:{
        screen:SettingsScreen
    }
},{
    initialRouteName:'OverView'
})

const RideStack = createStackNavigator({
    RideHistory:History,
    RideDetail:RideDetail,
},{
    initialRouteName:'RideHistory'
})

const Home = createDrawerNavigator({
    Ride:{
        screen:HMapView,
        navigationOptions:({navigation}) =>{
            const {t} = navigation.getScreenProps()
            return {
                drawerLabel:t('Createride'),
                drawerIcon:({tintColor}) =><Icon name={'cab'} size={20} color={tintColor} />
            }
        }
    },
    
    Notifications:{
        screen:NotificationView,
        navigationOptions:({navigation}) =>{
            const {t} = navigation.getScreenProps()
            return {
                drawerLabel:t('notifications'),
                drawerIcon:({tintColor}) =><Icon name={'bell'} size={20} color={'black'}
                 />,
    
                 title:t('notifications')
            }
        }
    },
    /*Invites:{
        screen:TestScreen,
        navigationOptions:{
            drawerLabel:'Invite a friend',
            drawerIcon:({tintColor}) =><Icon name={'gift'} size={20} color={'black'} />
        }
    },*/
    
    History:{
        screen:RideStack,
        navigationOptions:({navigation}) =>{
            const {t} = navigation.getScreenProps()
            return {
                drawerLabel:t('rideHistory'),
                drawerIcon:({tintColor}) =><Icon name={'tags'} size={20} color={'black'} />,
                title:t('rideHistory'),
            }
        }
    },
    
    Help:{
        screen:TestScreen,
        navigationOptions:({navigation}) =>{
            const {t} =navigation.getScreenProps()
            return {
                drawerLabel:t('help'),
                drawerIcon:({tintColor}) =><Icon name={'envelope-o'} size={20} color={'black'} />
            }
        }
    },

    Settings:{
        screen:profileStack,
        navigationOptions:({navigation}) =>{
            const  {t} = navigation.getScreenProps()
            return {
                drawerLabel:t('profile'),
                drawerIcon:({tintColor}) =><Icon name={'cog'} size={20} color={'black'} />
            }
        }
    },
},{
    
    initialRouteName:'Ride',
    contentComponent:(props) =>(<SideMenu {...props} />),
})


const Switch = createSwitchNavigator({
    Auth:AuthStack,
    dashboard:Home
},{ 
    initialRouteName:'Auth',
})

const Navigator = createAppContainer(Switch)
 
 export class AppWithLocalization extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            locale: Localization.locale.search('en')!= -1 ?'en':'ar',
        };
    }
  
    
    setLocale = locale => {
        console.log(locale);
        
        this.setState({ locale });
    };
  
    t = (scope, options) => {
      return i18n.t(scope, { locale: this.state.locale, ...options });
    };
  
    render() {
      return (
        <Navigator
          screenProps={{
            t: this.t,
            locale: this.state.locale,
            setLocale: this.setLocale,
          }}
        />
      );
    }
  }
  