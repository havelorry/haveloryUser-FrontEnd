/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, View,Alert,Animated,Text} from 'react-native';
import {Content,LargeSpace,Link} from "./../components/text"
import {Space} from "./../components/ButtonGroup"
import {CompoundInput} from "./../components/input"
import {CircleButton} from "./../components/ButtonGroup"
import { inject, observer } from 'mobx-react';
import {
  VIA_SIGNUP,
  VIA_LOGIN
} from './../constants/app'


import * as Localization from 'expo-localization'

@inject('auth')
@observer
export default class Login extends Component {

  constructor(props){
    super(props)
    this.state = {
      value:'',
      route:null,
      fetching:false
    }

    this.decideCallType = this.decideCallType.bind(this)
  }


  decideCallType(state){
    const {route,value} = state
    const {auth} = this.props

    if (route != null) {
      switch (route) {
        case VIA_LOGIN:
            auth.doLogin(value,(data)=>{
              this.props.navigation.navigate('loader')
            })
          break;
        case VIA_SIGNUP:

            auth.doValidate(value,(data)=>
            {
              const {status,message} = data
              if (status) {
                this.props.navigation.navigate('verify',{
                  phone:value
                })
             }else{
               Alert.alert('Message',message)
             }

            }, err =>
              {
                console.log(err)
              })
            
          break;

        default:
          break;
      }
    }
  }
  static navigationOptions = {
      headerStyle: {
          elevation: 0,
          shadowOpacity: 0
          }
  }

  componentDidMount(){
    this.setState(state => ({...state,route:this.props.navigation.state.params.route || VIA_LOGIN}))
    console.log('====================================');
    console.log(Localization.locale);
    console.log('====================================');
  }

  componentWillReceiveProps(nextProps,nexState){
   
  }
  
  render() {
   const {t} = this.props.navigation.getScreenProps()
    console.log(this.state)
    const {auth} = this.props

    return (
      <View style={styles.container}>
        <Content type="heading">
          {t('providePhone')}
        </Content>
        <Space/>

        <Content type="basic">
            {t("We'll text a code to verify your phone")}       
        </Content>
    
          <LargeSpace/>

          
        <CompoundInput
          source={require('./../assets/images/country.png')} 
          onPress = {()=> console.log('worked')}
          onChange={(value)=> {
            this.setState(state =>  ({...state,value}))
          }}
          code ="+965"
        />

        <Space/>
        <LargeSpace/>
        <Link color={'#6f8ca5'}>
          {t('Changed your number? Find your account')}
        </Link>

        <Animated.View>
            {
              auth.hasError
              
              &&
              
              <Text>
                {auth.error}
              </Text>
            }
        </Animated.View>

       <View style={{position:'absolute',bottom:15,right:15}} >
         {
             this.state.value.length > 0 ? <CircleButton onPress = {
              () => {
                if (this.state.value.length ==10) {
                   this.decideCallType(this.state)
                } else {
                  Alert.alert("Error",t("Phone number not valid"))
                }
              }
            }
            
            fetching = {auth.inProgress}
            color={'#6f8ca5'}
            size={42}
            btnBg={'transparent'}
            
            />: null
         }
       </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width:'auto',
    flex:1,
    alignItems:'center',
    justifyContent:'flex-start',
    backgroundColor: '#FFF',
    padding:'10%'
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
