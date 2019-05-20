import React, { Component } from 'react';
import { Text, TextInput, View, StyleSheet,Alert } from 'react-native';
import SmoothPinCodeInput from "react-native-smooth-pincode-input"

import { CircleButton,RoundButton,Link,Space} from "./../components/ButtonGroup"
import {Content,LargeSpace} from "./../components/text" 
import {connect} from "react-redux"
import {APP_URL} from "./../constants/API"
import { API_CALL_REQUEST, API_CALL_SUCCESS, API_CALL_FAILURE } from '../reducers/APIReducer';
class Verify extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      maxPinLength: 6,
      pinValue: '',
      tokenError:false
    };

   this.pinInput = React.createRef();

  }


  componentDidMount(){
   
  }

  static navigationOptions ={
    headerStyle: {
        elevation: 0,
        shadowOpacity: 0
        }
   }
 
  componentWillReceiveProps(nextProps,nextState){
    
  }

  render() {
  const {phone} = this.props.navigation.state.params
    return (
      <View style={styles.container}>
        <Content type="heading">
          Enter the code
        </Content>

        <Space/>

        <Content type="basic">
          Sent to +965 {phone || '-----------'}
        </Content>
  
          <Space/>
          <Space/>

          <SmoothPinCodeInput
              cellStyle={{
                borderBottomWidth: 2,
                borderColor: '#aaa',
              }}

              cellSize={36}

              cellSpacing={6}
              cellStyleFocused={{
                borderColor: 'black',
              }}

              textStyle={{
                color:'#000',
                fontWeight:'bold',
                fontSize:25
              }}

              textStyleFocused={{
                color:'#000',
                fontWeight:'bold',
                fontSize:25
              }}

              codeLength={6}
              ref={this.pinInput}
              value={this.state.pinValue}
              onTextChange={pinValue => this.setState({ pinValue })}
              keyboardType='numeric'
            />

            <LargeSpace/>
            <Space />
            <RoundButton color={'#000'} border={'#aaa'} hide={!this.state.tokenError} >
              Resend Code
            </RoundButton>

            <Space />
            <Space />

            <Link color={'#8a2be2'} isUnderined = {false} >
              Problem recieving in code?
            </Link>
            <View style={{position:'absolute',bottom:15,right:15}} >
              <CircleButton onPress ={
                () => {

                  console.log(this.state.pinValue +" "+" "+this.props.navigation.state.params.phone)
                  this.props.verifyNumber(
                    this.props.navigation.state.params.phone,
                    this.state.pinValue,
                    (json) => {
                        const {message,status} =json
                        if (status) {
                            this.props.register(this.props.navigation.state.params.phone,(data)=>{
                                  this.props.login(this.props.navigation.state.params.phone , (data)=>{
                                    this.props.navigation.navigate('dashboard')
                                  }, (err)=>{
                                     console.log(err) 
                                  })                          

                            },(err)=>{
                              console.log(err)
                            })
                        }else{
                          Alert.alert('Message',message)
                        }
                    },
                    (err) => {
                        console.log(err)
                    }
                  )
                }
              } fetching= {this.props.network.fetching}/>
            </View>
      </View>
    );
  }
 
 }
 

 const mapStateToProps = (state) => {
   return {
     network:state.network
   }
 }

 const mapStateToDispatch = dispatch => {
   return {
     verifyNumber:(phone,otp,success,error) => {
       dispatch({type:API_CALL_REQUEST})
       const url = `${APP_URL}api/verify_otp/`
       const data = JSON.stringify({phone,otp})
       fetch(url,{
        method:'post',
        headers:{
            'Content-Type':'application/json'
          },
        body:data
       }).then(
         r => r.json()
       ).then(
         json => {
           console.log(json)
           dispatch({type:API_CALL_SUCCESS,payload:json})
           success(json)
         }
       )
       .catch(err => {
         dispatch({type:API_CALL_FAILURE})
        error(err)
       })

     },
     register:(phone, success, error) =>  {
      dispatch({type:API_CALL_REQUEST})
      const url = `${APP_URL}api/register/`
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

    },
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
    }

   }
 } 
 export default connect(mapStateToProps,mapStateToDispatch)(Verify)

 const styles = StyleSheet.create({
  container: {
    width:'auto',
    flex:1,
    alignItems:'center',
    justifyContent:'flex-start',
    backgroundColor: '#FFF',
    padding:'10%'
  }
 });