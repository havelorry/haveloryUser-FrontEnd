/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import Video from "react-native-video"
import {Platform, StyleSheet, View,Alert} from 'react-native';
import AsyncStorage from "@react-native-community/async-storage"
import {Content,LargeSpace,Link} from "./../components/text"
import {Space} from "./../components/ButtonGroup"
import {CompoundInput} from "./../components/input"
import {CircleButton} from "./../components/ButtonGroup"
import {connect} from "react-redux"
import { VIA_LOGIN, VIA_SIGNUP } from '../constants/app';
import {APP_URL} from "./../constants/API"
import { API_CALL_SUCCESS, API_CALL_FAILURE,API_CALL_REQUEST } from '../reducers/APIReducer';
class Login extends Component {

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
  
    if (route != null) {
      switch (route) {
        case VIA_LOGIN:
            this.props.login(value, (res)=> {
                const {token} = res
                if (token) {
                    AsyncStorage.setItem('token',token).then(
                      () => this.props.navigation.navigate('dashboard')
                    )
                }else{
                  Alert.alert('Error','Account does not exists')
                }

            }, (error)=> {
              console.log(error)
            })
          break;
        case VIA_SIGNUP:
            this.props.validateNumber(value, data=>{
               const {status,message} = data
               if (status) {
                  this.props.navigation.navigate('verify',{
                    phone:value
                  })
               }else{
                 Alert.alert('Message',message)
               }  
            }, err => {
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
  }

  componentWillReceiveProps(nextProps,nexState){
   
  }
  
  render() {

    console.log(this.state)
    const {network} = this.props

    return (
      <View style={styles.container}>
        <Content type="heading">
          What's your number?
        </Content>
        <Space/>

        <Content type="basic">
            We'll text a code to verify your phone       
        </Content>
    
          <LargeSpace/>

          
        <CompoundInput
          source={require('./../assets/country.png')} 
          onPress = {()=> console.log('worked')}
          onChange={(value)=> {
            this.setState(state =>  ({...state,value}))
          }}
          code ="+965"
        />

        <Space/>
        <LargeSpace/>
        <Link>
          Changed your number? Find your account
        </Link>

       <View style={{position:'absolute',bottom:15,right:15}} >
         {
             this.state.value.length > 0 ? <CircleButton onPress = {
              () => {
                if (this.state.value.length ==10) {
                   this.decideCallType(this.state)
                } else {
                  Alert.alert("Error","Phone number not valid")
                }
              }
            }
            
            fetching = {network.fetching}
            />: null
         }
       </View>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  const {network} = state
  return {
    network
  }
}


const mapDispatchToProps = dispatch => {
    return {
      login:  (phone, success, error) => {
        dispatch({type:API_CALL_REQUEST})
        const url = `${APP_URL}api/login/`
        fetch(url,{
          method:'post',
          headers:{
            'Content-Type':'application/json'
          },
          body:JSON.stringify({phone})
        }).then(
          res => {
            return res.json()
          }
        ).then( res =>{
          dispatch({type:API_CALL_SUCCESS,payload:res})
          success(res)
        })
         .catch(err => {
           dispatch({type:API_CALL_FAILURE})
          error(err)
         })
      },
      
      validateNumber:(phone, success, error) =>  {
        dispatch({type:API_CALL_REQUEST})
        const url = `${APP_URL}api/validate/`
        fetch(url,{
          method:'post',
          headers:{
            'Content-Type':'application/json'
          },
          body:JSON.stringify({phone})
        }).then(
          res => res.json()
        ).then(
          json => {
            success(json)
          }
        ).catch(err => {
          error(err)
          console.log(err)
        })

      }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)

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
