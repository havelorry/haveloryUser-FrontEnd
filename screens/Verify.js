import React, { Component } from 'react';
import { Text, TextInput, View, StyleSheet,Alert } from 'react-native';
import SmoothPinCodeInput from "react-native-smooth-pincode-input"

import { CircleButton,RoundButton,Link,Space} from "./../components/ButtonGroup"
import {Content,LargeSpace} from "./../components/text" 
import { inject, observer } from 'mobx-react';

@inject('auth')
@observer
export default class Verify extends Component {
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
  const  {t}  = this.props.navigation.getScreenProps();
  const {phone = "9039669242"} = this.props.navigation.state.params
    return (
      <View style={styles.container}>
        <Content type="heading">
          {t("Enter the code")}
        </Content>

        <Space/>

        <Content type="basic">
          {t("Sent to +965")} {phone || '-----------'}
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

            <Link color={'#6f8ca5'} isUnderined = {false} >
              Problem recieving in code?
            </Link>
            <View style={{position:'absolute',bottom:15,right:15}} >
              <CircleButton onPress ={
                () => {
                  this.props.auth.doVerify({
                    phone,
                    otp:this.state.pinValue
                  },
                  
                  res => {
                    const {status= false} = res
                    if (status) {
                      this.props.auth.doRegister(
                        {phone},
                        (res) => {
                          const {status = false} = res
                          if (status) {
                              this.props.auth.doLogin(phone , ()=> this.props.navigation.navigate('loader'))
                          } else {
                              Alert.alert(res.message)        
                          }
                        },

                        (err) => {
                          Alert.alert(err.message)
                        }  
                      )

                    }else{
                        Alert.alert('OTP not valid') 
                    }

                  },

                    err => {
                      Alert.alert(err.message)
                    }
                    
                  )
                  
                }
              } fetching= {this.props.auth.inProgress}
                color={'#6f8ca5'}
              />
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
  }
 });