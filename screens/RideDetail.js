import React from "react"
import {View,FlatList,Text,Button,Alert} from "react-native"
import {ListItem} from "react-native-elements"
import {FontAwesome} from "@expo/vector-icons"
import { RideStatus } from "../constants/API";
import { inject, observer } from "mobx-react";

class RideDetail extends React.Component{
    
    state={
        update:false
    }

    setUpdate = (value) => {
        this.setState({update:value})
    }


    updateLocation = (data) =>{
        console.log('====================================');
        console.log(data);
        console.log('====================================');
        fetch(updateLocationUrl,{
          method:'post',
          headers:{
            'Content-Type':'application/json'
          },
          body:JSON.stringify(data)
        }).then(jso => {
          console.log('LOcation Updated')
          return jso.json()
        }).then(d => console.log(d)).catch(err => console.log(err.message))
    }


    _ReleaseDriver = (username) => {
        this.updateLocation({
            username,
            active:0,
            status:'busy'
         })
    }


    updateRideStatus = (data) => {
        this.setUpdate(true)
        fetch(RideStatus,{
            method:'put',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify(data)
        }).then( r => r.json()).catch(err => console.log(err)).then(
            j => {
                this.setUpdate(false)
                this.props.navigation.navigate('History',{
                    update:true
                })
                console.log('====================================');
                this.props.rides.setPulling(true)
                this.props.navigation.goBack()

                console.log('====================================');
            }
        ).catch(err => {
            Alert.alert('Info',err.message,[
                {'dismiss':()=>{
                    this.props.navigation.navigate('Home')
                }}
            ])
        })
    }

    render(){
        const [ride] = this.props.rides.currentRide
        const details = [
            {key:'Destination'   ,value:ride.dest_string || 'unnamed location',},
            {key:'Start'         ,value:ride.origin_string || 'unnamed location'},
            {key:'status'        ,value:ride.status || 'unknown Status'},
            {key:'Driver Contact',value:ride.driver_id || 'No Contact'},
            
        ]

        console.log('====================================');
        console.log(ride);
        console.log('====================================');
        const {update} = this.state

        return <View>
        <FlatList 
            keyExtractor ={(item,index) => index.toString()}
            data = {details}
            renderItem={
                ({item}) => <ListItem 
                        title ={item.key}
                        subtitle={item.value}
                        leftIcon = {<FontAwesome name={'dot-circle-o'} size={20} color={'#000'}/>}
                        bottomDivider={true}
                />
            }
        />

       <View  style={{height:10}}/>     
       
       <Button
        style={{height:40}}
        color={'#6f8ca5'}
        disabled={this.props.rides.controlDisabled} 
        title={ update ? 'loading ...':'Complete'}
        
        onPress={
            () => {
                this.updateRideStatus({
                    id:ride.id,
                    status:5
                })
                    
        }        
        }
       />

       <View  style={{height:10}}/>

       <Button
        style={{height:40}}
        disabled = {this.props.rides.controlDisabled} 
        title={update ? 'loading ...':'Cancel'}
        color={'#d00'}
        onPress={
            ()=> {
                
                this.updateRideStatus({
                    id:ride.id,
                    status:4
                })
            }
        }
       />
     
    </View>

    }
}


RideDetail.navigationOptions = {
    title:'Ride Details'
}

const RideWithState = inject('rides')(observer(RideDetail))
export default RideWithState;
