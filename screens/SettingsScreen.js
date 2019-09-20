import React from 'react';
import {View, AsyncStorage,Button, Alert} from "react-native"
import {Input} from "react-native-elements"
import {profileURL} from './../constants/API'
import {NavigationContextConsumer} from "./../navigation/NavigationContext"

const containerStyles ={
  paddingHorizontal:20,
  paddingVertical:10,
  flex:1
}
export default class SettingsScreen extends React.Component {
  static navigationOptions = {
    title: 'Profile Update',
  };

  state = {
    firstName:'',
    lastName:''
  }


  componentDidMount(){
    const {firstName,lastName} = this.props.navigation.state.params
    this.setState({firstName,lastName})
  }

  handleSubmit = (token, setDisplayName) => {
      const body = JSON.stringify(this.state)
      
      fetch(profileURL,{
        body,
        headers:{
          'Content-Type':'application/json',
          'Authorization':`Token ${token}`
        },

        method:'POST'
      }).then( async response => {
        if (response.ok) {
          const json = await response.json()
          const {data:{firstName}} = json
          Alert.alert('Info','Changes have been made',[
            {
              text:'OK',
              onPress:()=>{
                setDisplayName(firstName)
                this.props.navigation.goBack()
              }
            }
          ])
        }
      })
  }

  handleTextChange = (key, value) => {
    this.setState(state =>({...state,[key]:value}))
  }
  render() {
    /* Go ahead and delete ExpoConfigView and replace it with your
     * content, we just wanted to give you a quick view of your config */
    return <View style={{flex:1}}>
      <View style={containerStyles}>
          <Input 
            textAlignVertical="auto"
            value={this.state.firstName}
            onChangeText={text =>this.handleTextChange('firstName',text)}
            leftIcon={{
              name:'person-outline',
              color:'#8a2be2'
            }}
          />

           <View style={{height:10}}/> 
          <Input 
            textAlignVertical="auto"
            value={this.state.lastName}
            onChangeText={ text =>this.handleTextChange('lastName',text)}
            leftIcon={{
              name:'person-outline',
              color:'#8a2be2'
            }}
          />

          <View style={{height:10}}/>

          <NavigationContextConsumer>
            {
              ({setDisplayName})=>(<Button 
                title={'Save Changes'}
                color={'#8a2be2'}
                onPress={
                  ()=>{
                    AsyncStorage.getItem('token').then(
                      token =>{
                        this.handleSubmit(token, setDisplayName)
                      }
                    )
                  }
                }
              />)
            }
            </NavigationContextConsumer> 
      </View>

    </View>;
  }
}
