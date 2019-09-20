import React,{useEffect,useState} from "react"
import { View , Switch, AsyncStorage,Alert} from "react-native";
import {Header,ListItem} from "react-native-elements"
import {Bubbles} from "react-native-loader"
import { Notifications,Permissions} from "expo"
import {TOKEN_URL} from "./../constants/API"
function parseBool(str) {

    if (str.length == null) {
      return str == 1 ? true : false;
    } else {
      return str == "true" ? true : false;
    }
  
}


class NotificationView extends React.Component{
    
    state ={
        enabled:false,
        processing:false,
        message:false
    }

    async componentDidMount(){
        const item = await AsyncStorage.getItem('notificationState')
        console.log('=================SCREEN PROPS HERE===================');
        console.log(this.props.navigation.getScreenProps());
        console.log('====================================');
        if (item != null) {
            const enabled = parseBool(item)
            console.log(enabled)
            this.setState(state=>({...state,enabled}))
        }
    }


    valueListener = (value) => {
        console.log(`${value}`.toString())
        if (value) {
            Permissions.getAsync(Permissions.NOTIFICATIONS).then(
                ({status}) => {
                    console.log('====================================');
                    if (status == "granted") {
                        this.setState({processing:true})
                        this.loadNRegister(value.toString())
                    } else {
                        Permissions.askAsync(Permissions.NOTIFICATIONS)
                        .then(
                            ({status}) =>{
                                if (status=="granted") {
                                    this.setState({processing:true})
                                    this.loadNRegister(value.toString())

                                }else{
                                    Alert.alert('Permission denied')
                                }
                                // do Whatever
                            }
                        )
                    }
                    console.log('====================================');
                } 
            )
        }
        
    }

    async componentDidUpdate(){
        const item = await AsyncStorage.getItem('notificationState')
        if (item != null) {
            const enabled = parseBool(item)
            this.setState(state=>({...state,enabled}))
        }
    }

    loadToken = async () => {
         try{
            const token = await Notifications.getExpoPushTokenAsync()
            return token
         }catch(err){
             return err
         }   
    }

    postToken = (url, data) => fetch(url,{
        method:'post',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify(data)
    })

    loadNRegister = (value) =>{
        AsyncStorage.getItem('username').then(
            username => {
                if (username) {
                   console.log('============IN LOAD N REFOSTER========================');
                   this.loadToken().then(token =>{
                        this.postToken(TOKEN_URL,{username,token,identification:'user'}).then(
                            this.setState({processing:false},()=>{
                                this.setState({message:`Notificatons enabled ..`})
                                this.setState({enabled:value})
                            })
                        ).catch(err => {
                            this.setState({processing:false})
                            console.log(err.message);
                            
                        })
                   })
                   console.log('====================================');
                }
            }
        )
    }

    render(){
        return <View style={{flex:1}}>
        <Header
            backgroundColor={'#6f8ca5'}
            leftComponent={{ icon: 'menu', color: '#fff',onPress:()=>{
                this.props.navigation.toggleDrawer()
            } }}
            centerComponent={{ text: 'Notifications', style: { color: '#fff' } }}
            rightComponent={{ icon: 'home', color: '#fff',onPress:()=>{
                this.props.navigation.navigate('Ride')
            } }}
        />


        {
            this.state.processing 
            &&
            <View style={{height:60,justifyContent:'center',alignItems:'center',flexDirection:'row'}}>
                <Bubbles size={10} color={'#8a2be2'}/>
                 {
                     this.state.message 
                        &&
                        <ListItem 
                            title={this.state.message}
                            leftIcon={{
                                name:'right'
                            }}
                        />
                 }
            </View>
        }

        <ListItem 
            title={'Enable Notifications'}
            bottomDivider={true}
            topDivider={true}
            rightElement={
                <Switch 
                    value={this.state.enabled || false}
                    onValueChange={
                        this.valueListener    
                    }
                />
            }
        />
    </View>
    }
}


export default NotificationView