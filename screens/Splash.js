/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {AsyncStorage, StyleSheet, Text, View, SafeAreaView, Dimensions} from 'react-native';
import {RoundButton,Link,Group,Space} from "./../components/ButtonGroup"
import { VIA_LOGIN, VIA_SIGNUP } from './../constants/app';
import {
  Video
} from "expo"
import {Asset} from 'expo';

const {width,height} = Dimensions.get('window')

const videoSource = Asset.fromModule(
  require('./../assets/video/landing_onboarding_x_compressed_android.mp4')
)

export default class Splash extends Component {
  
  static navigationOptions ={
   header:null  
  }

  componentDidMount(){

    AsyncStorage.getItem('token').then(t => {
        if (t != null) {
          this.props.navigation.navigate('dashboard')
        } 
    }).catch(err => console.log(err))
  }

  render() {
    const {navigation} = this.props
    return (
      
        <SafeAreaView style={styles.container}>
        <Video
          source={videoSource}
          rate={1.0}
          volume={1.0}
          isMuted={false}
          resizeMode="cover"
          shouldPlay
          isLooping
          style={{ width, height }}
        />

        <Text style={styles.welcome}>
          Havellory
        </Text>

      
       <View style={{width:'100%', justifyContent:'center',alignItems:'center',marginTop:'8%'}}>
        
         <Group>
            <RoundButton color={'#000'} background='#fff' onPress={
              () => {
                navigation.setParams({'backLink':'viaSignup'})
                navigation.navigate('login',{
                  route:VIA_SIGNUP
                })
              }
            }>
              Sign up
            </RoundButton>

             <Space />

            <RoundButton color={'#fff'} onPress={
              () =>{
                this.props.navigation.navigate("login",{
                  route:VIA_LOGIN
                })
              }
            }>
              Log in
            </RoundButton>
            
            <Space />
            <Space />
            <React.Fragment>
             <Text style={{color:'#fff'}}>
                 Ready to earn? 
             </Text>

              <Link>
                Open the driver app
              </Link>
            </React.Fragment>
        </Group>
      
       </View>

      </SafeAreaView>
    
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width:'auto',
    flex:1,
    alignItems:'center',
    justifyContent:'space-between',
    backgroundColor: '#FFF',
  },
  welcome: {
    fontSize: 75,
    textAlign: 'center',
    margin: 10,
    color:'#fff',
    marginTop:'30%'
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
