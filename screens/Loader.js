import React from "react"
import {View,Image,ActivityIndicator,AsyncStorage} from 'react-native'
import {Notifications} from "expo"
import { profileURL } from "../constants/API";
import {NavigationEvents} from "react-navigation"
import { VIA_LOGIN } from "../constants/app";

export default class Loader extends React.Component {

    static navigationOptions = {
        header:null
    }

    async pull(){
        const token = await AsyncStorage.getItem('token')
        if(token)
            this.pullProfile(token,()=>{
                this.props.navigation.navigate('dashboard')
            },()=> this.props.navigation.navigate('login',{
                route:VIA_LOGIN
            }))
            
        else
            this.props.navigation.navigate('splash')
    
    }

    pullProfile = (token,callBack, errorCallback) => {
        fetch(profileURL,{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                'Authorization':`Token ${token}`
            }
        }).then( async response => {
               const json = await response.json()
             if(response.status === 401) 
                 return {
                     ...json,
                     hasError:true
                 } 
             else
                return json 
        })
        .then((response) => {
           
            console.log(response)
           
            if (response.hasOwnProperty('hasError')) {
                errorCallback()
            }else{

                const {data:{firstName,lastName,profilePic}} = response
                AsyncStorage.multiSet([
                    ['firstName',firstName],
                    ['lastName',lastName],
                    ['profilePic',profilePic],
                ])

                callBack()
            }

             
            
        })
    }
     
    render(){
        return <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
            
            <NavigationEvents 
             onDidFocus={
                 async()=>{
                    await this.pull()
                 }
             }
            />
            
            <Image
             style={{
                 height:100,
                 width:250
             }} 
             source ={require('./../assets/images/logo.jpeg')}
            />

            <ActivityIndicator 
             size={"large"}
             color={'#8a2be2'}
            />
        </View>
    }
}
