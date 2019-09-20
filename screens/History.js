import React,{useState, useEffect} from "react"
import { HistoryUrl, riderHistory } from "../constants/API";
import {ListItem} from "react-native-elements"
import {FlatList,View,Text,AsyncStorage} from "react-native"
import {FontAwesome} from "@expo/vector-icons"
import {Bubbles} from "react-native-loader"
import {inject,observer} from "mobx-react"
import {NavigationEvents} from "react-navigation"

class History extends React.Component {


    render(){
        const {rides:rds} = this.props
        const {rides:history,loading} = rds
        return (<View style={{flex:1}}>

            <NavigationEvents 
                onDidFocus = {
                    payload => {
                        AsyncStorage.getItem('username').then(
                            username => {
                                if (username) {
                                    this.props.rides.refresh(username)
                                }
                            }
                        )
                    }
                }

                
            />
            {
                loading 
                &&
                <View style = {{height:50,justifyContent:'center', alignItems:'center'}}>
                    <Bubbles size={10} color={'#6f8ca5'}/>
                </View>
            }
    
            {
                (!loading)
                 &&
                <FlatList 
                    keyExtractor = { (item,index) => index.toString()}
                    data={history}
                    renderItem = {
                        ({item,index}) => <ListItem 
                            title= {item.status}
                            subtitle=  {
                                item.dest_string
                            }
    
                            onPress={
                                ()=>{
                                    rds.setCurrentRide(index)
                                    this.props.navigation.navigate('RideDetail')
                                }
                            }
                            leftIcon={
                                <FontAwesome 
                                 name='dot-circle-o'
                                 size={22}
                                 color={'#6f8ca5'}
                                />
                            }
    
                            rightIcon={
                                <FontAwesome 
                                    name="chevron-right" 
                                    size={22}
                                    color={'#000'}
                                    onPress={
                                        ()=>{
                                            rds.setCurrentRide(index)
                                            this.props.navigation.navigate('RideDetail')
                                        }
                                    }
                                />
                                
                            }
                        />
                    }
                    
                
                />
                
            }
        </View>)
    }
}

History.navigationOptions = ({navigation}) =>({
    title:'Ride History',
    headerLeft:<View style={{marginLeft:11}}>
        <FontAwesome name={'arrow-left'} size={18} onPress={
        (e)=>{
           navigation.toggleDrawer() 
        }
    }/>
    </View>
})

const InjectedHistory = inject('rides')(observer(History))

export default InjectedHistory