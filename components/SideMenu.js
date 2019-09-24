import React,{useState,useEffect} from "react"
import {View,Image,AsyncStorage} from "react-native"
import {Link,Space} from "./ButtonGroup"
import {DrawerItems} from "react-navigation"
import {Content} from "./text"
import { APP_URL } from "../constants/API";
import {NavigationContextProvider,NavigationContextConsumer} from "./../navigation/NavigationContext"

function TitleComponent(props) {
    return <NavigationContextConsumer>
        {({displayName}) =>(<Content type={'heading'} align={'center'} >
        {displayName}
    </Content>)}
    </NavigationContextConsumer>
}



export default class SideMenu extends React.Component {

    constructor(props){
        super(props)
    }

    async componentDidMount(){
         console.log('====================INSIDE DRAWER COMPONENT================');
         console.log(this.props.navigation.state) 
         console.log('====================================');  
    }


    render(){
        return <View>
                    <View 
                        style={{
                            backgroundColor: '#fff',
                            width:'100.2%',
                            height: 180,
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderBottomColor:'#eee',
                            borderWidth:1,
                            marginTop:20
                        }}

                    >
                            <NavigationContextConsumer>
                            {
                                ({profilePic}) =>(
                                    <Image 
                                        source={
                                            profilePic != "" ? {uri:`${APP_URL.substr(0,APP_URL.length-1)}${profilePic}`} :require('./../assets/images/avatar.png')
                                        }
                                        style ={{
                                            width:80,
                                            height:80,
                                            borderRadius:50,
                                            borderColor:'#000',
                                            borderWidth:2
                                        }}
                                    />
                                )
                            }
                            </NavigationContextConsumer>
              
                        <Space/>    
                            <TitleComponent />    
                        <Space/>

                        <Link isUnderlined={false} color={'#6f8ca5'} onPress={
                            ()=> {
                                this.props.navigation.navigate('Settings')
                            }
                        }>
                        View Profile
                        </Link>    
                    </View>
                    <DrawerItems {...this.props} />

        </View> 

    }
}