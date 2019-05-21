import React from "react"
import {View,Button} from "react-native"
import {createAppContainer,createSwitchNavigator,createStackNavigator,createDrawerNavigator} from "react-navigation"
import Login from "./../screens/Login"
import Splash from "./../screens/Splash"
import Verify from "./../screens/Verify"
import Loader from "./../screens/Loader"
import Icon from 'react-native-vector-icons/FontAwesome';
import SideMenu from "./../components/SideMenu"
import {OvalButton} from "./../components/ButtonGroup"
import HMapView from "./../screens/HMapView"
import Settings from './../screens/Settings'

const AuthStack = createStackNavigator({
    loader:Loader,
    splash:Splash,
    login:Login ,
    verify:Verify
},{
    initialRouteName:'loader',
    
})

const settingStack = createStackNavigator({
    Settings
},{
    initialRouteName:'Settings'
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

const Home = createDrawerNavigator({
    Ride:{
        screen:HMapView,
        navigationOptions:{
            drawerLabel:'Get a Ride',
            drawerIcon:({tintColor}) =><Icon name={'cab'} size={20} color={'black'} />
        }
    },
    Passes:{
        screen:TestScreen,
        navigationOptions:{
            drawerLabel:'Ride Passes',
            drawerIcon:({tintColor}) =><Icon name={'id-card'} size={20} color={'black'} />
        }
    },
    Notifications:{
        screen:TestScreen,
        navigationOptions:{
            drawerLabel:'Notifications',
            drawerIcon:({tintColor}) =><Icon name={'bell'} size={20} color={'black'} />
        }
    },
    Invites:{
        screen:TestScreen,
        navigationOptions:{
            drawerLabel:'Invite a friend',
            drawerIcon:({tintColor}) =><Icon name={'gift'} size={20} color={'black'} />
        }
    },
    History:{
        screen:TestScreen,
        navigationOptions:{
            drawerLabel:'Ride History',
            drawerIcon:({tintColor}) =><Icon name={'tags'} size={20} color={'black'} />
        }
    },
    
    Help:{
        screen:TestScreen,
        navigationOptions:{
            drawerLabel:'Help',
            drawerIcon:({tintColor}) =><Icon name={'envelope-o'} size={20} color={'black'} />
        }
    },
    Settings:{
        screen:Settings,
        navigationOptions:{
            drawerLabel:'Settings',
            drawerIcon:({tintColor}) =><Icon name={'cog'} size={20} color={'black'} />
        }
    }

},{
    initialRouteName:'Ride',
    contentComponent:SideMenu
})


const Switch = createSwitchNavigator({
    Auth:AuthStack,
    dashboard:Home
},{
    initialRouteName:'Auth'
})

const Navigator = createAppContainer(Switch)
 export {
     Navigator
 }

