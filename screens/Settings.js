import React from "react"
import {View,AsyncStorage,Picker,FlatList,Button,Text} from "react-native"
import { APP_URL } from "../constants/API";
import {DocumentPicker} from "expo"
import { Header,ListItem,Image } from "react-native-elements";
import {NavigationEvents} from "react-navigation"
import {NavigationContextConsumer} from "./../navigation/NavigationContext"
import * as Animatable from 'react-native-animatable';

import {FontAwesome as Icon} from "@expo/vector-icons"

function transformInput(value){
    return value.indexOf('_') > -1 ? value.split('_').join(' ') :value 
}

class SettingsScreen extends React.Component{
    
    constructor(props){
        super(props)
        this.state = {
            profile:{},
            uploading:false ,
            updated:false   
        }
        //this.props.navigation.getScreenProps().setLocale('ar')
    }

    
    static navigationOptions = ({navigation}) =>{
        return {
            ...navigation,
            header:null
        }
    }

    componentDidUpdate(){
        if (this.state.updated== false) {
            this.setState({updated:true})
        }
    }

    pullProfile =() =>{
        AsyncStorage.multiGet(['token','username','expiry']).then(values => {
            const [token] = values
            fetch(`${APP_URL}api/profile`,{
                method:'GET',
                headers:{
                    'Content-Type':'application/json',
                    'Authorization':`TOKEN ${token[1]}`
                }
            }).then(response => response.json())
            .then(response => {
                this.setState({profile:response.data, uploading:false})
            }).catch(err => {
                console.log(
                    {
                        url:`${APP_URL}api/profile`,
                        message:err.message
                    }
                )
            })
        })
        
    }
    
    

    uploadToServer = ({uri}) => {
        const parts = uri.split('.')
        const fileType = parts[parts.length -1]
        let data = new FormData()
        const uploadURL = `${APP_URL}api/pic/`
        data.append('file',{
            uri,
            name: `photo.${fileType}`,
            type: `image/${fileType}`,
        })

        return fetch(uploadURL,{
            method:'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data',
              },
            body:data
        })
    }


    pushUserImage = (body, success, errorCall) =>{
        AsyncStorage.getItem('token').then(
            token => {
                fetch(`${APP_URL}api/profile/`,{
                    method:'POST',
                    headers:{
                        'Content-Type':'application/json',
                        'Authorization':`Token ${token}`
                    },
                    body
                }).then( response => response.json()).then(response => {
                    success(response)
                }).catch(errorCall)        
            }
        )
    }

    updatePic = (setProfilePic)=> {
        this.setState({uploading:true})
        DocumentPicker.getDocumentAsync({
            type:'image/jpeg',
            copyToCacheDirectory:true
        }).then( result => {
            this.uploadToServer(result).then(
                result => result.json()
            ).then(
                ({file_url:profilePic}) => {
                    this.pushUserImage(
                        JSON.stringify({profilePic}),
                        ({data:{profilePic}}) => {
                            setProfilePic(profilePic)
                            this.pullProfile()
                        },
                        err => {
                            this.setState({uploading:false})
                        }
                        )
                }
            ).catch(err => {
                this.setState({uploading:false})
            })
        })
    }

    render(){
        const  {t} =  this.props.navigation.getScreenProps()

        const {profile} = this.state
        console.log('=============RNDR=======================');
        
        const {user} = profile
        console.log(user);
        
       
        console.log('====================================');        
        const fields = [
            {
                key:'User Name',
                value:user && user.phone,
                active:true,
                icon:'phone'
            },
            {
                key:'Email',
                value:profile.email || '---',
                active:profile.email_verified,
                icon:'email'
            },
            {
                key:'First Name',
                value:profile.hasOwnProperty('firstName') ? profile.firstName :'edit',
                icon:'person-outline'
            },

            {
                key:'Last Name',
                value:profile.hasOwnProperty('lastName') ? profile.lastName :'edit',
                icon:'person-outline'
            }
            
    
    ]

        console.log('====================================');
        console.log(`${APP_URL}${profile.profilePic}`);
        console.log(this.props.navigation.getScreenProps().locale);
        console.log('====================================');
        
        return (<View style={{flex:1}}>
            <NavigationEvents 
            onDidFocus={
                this.pullProfile
            }
            />
            
            <Header
                backgroundColor={'#6f8ca5'}
                leftComponent={{ icon: 'menu', color: '#fff',onPress:()=>{
                    this.props.navigation.toggleDrawer()
                }}}
                centerComponent={{ text: t('profile'), style: { color: '#fff' } }}
                rightComponent={{ icon: 'home', color: '#fff',onPress:(()=>{
                    this.props.navigation.navigate('Ride')
                }) }}
                />
    

            <View style={{justifyContent:'center',alignItems:'center', minHeight:200}}>
                <Image 
                    source={{uri:`${APP_URL.substr(0,APP_URL.length-1)}${profile.profilePic}`}}

                    style={{
                        borderRadius:50,
                        width:100,
                        height:100,
                        borderWidth:2,
                    }}

                />

                <View style={{height:10}}/>

                    {
                        this.state.uploading &&
                            <>
                            <Animatable.View animation="rotate" iterationCount="infinite" easing="linear" >
			                    <Icon name="refresh" size={22} color="#8a2be2" />
		                    </Animatable.View>
                        
                         <View style={{height:10}}/>
                       </>
                    }

                <NavigationContextConsumer>
                    {
                        ({setProfilePic}) =>(<Button 
                            title={
                                this.props.navigation.getScreenProps().t('update pic')
                            }
                            color={'#6f8ca5'}
                            onPress={
                                ()=>{
                                    this.updatePic(setProfilePic)
                                }
                            }
                        />)
                    }
                </NavigationContextConsumer>
            </View>

            <ListItem 
             title={'Language'}
             rightElement={
                 <Picker 
                 style={{width:200}}
                 selectedValue={this.props.navigation.getScreenProps().locale}
                 //value={this.props.navigation.getScreenProps().locale}
                 onValueChange={
                     (itemValue,index) =>{
                        this.props.navigation.getScreenProps().setLocale(itemValue)
                        //this.props.navigation.setParams({'langChanged':true})
                        if(this.state.updated){
                            this.props.navigation.navigate('loader')
                        }                 
                     }
                 }

                 onTouchStart={
                     ()=>{
                        this.setState({updated:true})
                     }
                 }
                 >
                    <Picker.Item label={'English'} value={'en'}/>
                    <Picker.Item label={'Arabic'} value={'ar'}/>   
                 </Picker>
             }
            
            />        
            <FlatList 
                keyExtractor = {(item,index)=> index.toString()}
                data={fields}
                renderItem = {
                    ({item,index}) => <ListItem 
                        title={item.key}
                        subtitle={item.value}
                        subtitleStyle={{
                            color:'#6f8ca5'
                        }}
                        leftIcon={{name:item.icon,color:'#000'}}
                        rightIcon={item.hasOwnProperty('active')? {name:'check-circle',color:item.active?'#0d0':'#000'} :null}
                        rightElement={item.element && item.element}
                        onPress ={()=>{
                            if (['First Name','Last Name'].includes(item.key)) {
                                this.props.navigation.navigate('PDetails',{
                                    firstName:profile.firstName,
                                    lastName:profile.lastName
                                })
                            }

                            if (['Language'].includes(item.key)) {                                
                                
                            }
                        }}
                        
                        bottomDivider={true}
                        subtitleStyle={{color:'#00d'}}
                    />
                }
            />                
        </View>)
    }
}

export default SettingsScreen;