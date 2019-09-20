import React from 'react'
import { Bubbles, DoubleBounce, Bars, Pulse } from 'react-native-loader';
import {View, AsyncStorage} from 'react-native'


const styles = {
    width:'100%',
    height:'100%',
    backgroundColor:'#fff',
    justifyContent:'center',
    alignItems:'center'
}

class AuthChecker extends React.Component{

    async componentDidMount(){
        try {
            const token = await AsyncStorage.getItem('token')
            if (token) {
                console.log(`Go 4 application flow`);
                
            } else {
                console.log(`Go 4 authentication flow`);
            }
        } catch (error) {
            console.log(error)
        }
    }
    
    static navigationOptions = {
        header:null
    }
    
    render = () =>  <View style={styles}>
            <Bubbles size={10} color="#8a2be2" />
    </View>
}

export default AuthChecker
