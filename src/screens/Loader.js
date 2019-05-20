import React from "react"
import {View,Image,ActivityIndicator} from 'react-native'
import AsyncStorage from "@react-native-community/async-storage"
export default class Loader extends React.Component {

    static navigationOptions = {
        header:null
    }

    async componentDidMount(){
        const token = await AsyncStorage.getItem('token')
        if(token)
            this.props.navigation.navigate('dashboard')
        else
        this.props.navigation.navigate('splash')
    }

    render(){
        return <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
            <Image
             style={{
                 height:100,
                 width:250
             }} 
             source ={require('./../assets/logo.jpeg')}
            />

            <ActivityIndicator 
             size={"large"}
             color={'#8a2be2'}
            />
        </View>
    }
}
