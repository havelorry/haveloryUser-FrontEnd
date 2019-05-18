/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import Video from "react-native-video"
import {Platform, StyleSheet, Text, View,Alert} from 'react-native';
import {Content,LargeSpace,Link} from "./../components/text"
import {Space} from "./../components/ButtonGroup"
import {CompoundInput} from "./../components/input"
import {CircleButton} from "./../components/ButtonGroup"
import {connect} from "react-redux"


class Login extends Component {

  constructor(props){
    super(props)
    this.state = {
      value:''
    }
  }
  static navigationOptions = {
      headerStyle: {
          elevation: 0,
          shadowOpacity: 0
          }
  }

  componentWillReceiveProps(nextProps,nexState){
    const {data} = nextProps.network
    if(data != null){
      this.props.navigation.navigate('verify')
    }else{
    }
  }
  
  render() {

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
          Changed your number? Find your account {network.fetching.toString()}
        </Link>

       <View style={{position:'absolute',bottom:15,right:15}} >
         {
             this.state.value.length > 0 ? <CircleButton onPress = {
              () => {
                if (this.state.value.length ==10) {
                  
                  this.props.dispatch({type:'API_CALL_REQUEST'})

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

export default connect(mapStateToProps)(Login)

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
