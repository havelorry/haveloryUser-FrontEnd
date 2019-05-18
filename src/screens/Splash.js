/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import Video from "react-native-video"
import {Platform, StyleSheet, Text, View, SafeAreaView} from 'react-native';
import {RoundButton,Link,Group,Space} from "./../components/ButtonGroup"


export default class Splash extends Component {
  
  static navigationOptions ={
   header:null  
  }

  render() {
    const {navigation} = this.props

    return (
      
        <SafeAreaView style={styles.container}>
        <Video 
        source={require('./../assets/landing_onboarding_x_compressed_android.mp4')}
        style={{
          ...StyleSheet.absoluteFill,
           zIndex:-1 
        }}
        resizeMode={'cover'}
        fullscreen={true}
        repeat={true}
        />

        <Text style={styles.welcome}>
          Havellory
        </Text>

      
       <View style={{width:'100%', justifyContent:'center',alignItems:'center',marginTop:'8%'}}>
        
         <Group>
            <RoundButton color={'#000'} background='#fff' onPress={
              () => navigation.navigate('login')
            }>
              Sign up
            </RoundButton>

             <Space />

            <RoundButton color={'#fff'} onPress={
              () =>this.props.navigation.navigate("login")
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
    fontFamily:`Righteous-Regular`,
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
