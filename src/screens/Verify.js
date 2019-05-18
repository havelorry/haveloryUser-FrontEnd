import React, { Component } from 'react';
import { Text, TextInput, View, StyleSheet,Alert } from 'react-native';
import SmoothPinCodeInput from "react-native-smooth-pincode-input"

import { CircleButton,RoundButton,Link,Space} from "./../components/ButtonGroup"
import {Content,LargeSpace} from "./../components/text" 
import {connect} from "react-redux"

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
    const {data} = this.props.network
    if (data != null) {
      this.props.navigation.navigate('dashboard')
    }
  }

  render() {

    return (
      <View style={styles.container}>
        <Content type="heading">
          Enter the code
        </Content>

        <Space/>

        <Content type="basic">
          Sent to +91 8318338257
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
                  if (this.state.pinValue == "256785") {
                    this.props.dispatch({type:'API_CALL_REQUEST'})
                  } else {
                    Alert.alert('Message','Wrong OTP PIN entered')
                    this.setState({tokenError:true})
                  }
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

 export default connect(mapStateToProps)(Verify)

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