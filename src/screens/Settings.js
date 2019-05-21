import React from "react"
import {View,Text} from "react-native"
import { connect } from 'react-redux'
import {Header, ListItem, Icon, Image} from "react-native-elements"

const mapState = state => ({
    profile:state.profile.profile
})


function transformInput(value){
    return value.indexOf('_') > -1 ? value.split('_').join(' ') :value 
}

export default connect(mapState)(class Settings extends React.Component{
    
    constructor(props){
        super(props)
        this.state = {
            profile:[]    
        }
    }

    
    static navigationOptions = {
        header:null
    }

    componentDidMount(){

    
        this.setState(
            state=>({
                ...state,
                profile:this.props.profile,
            })
        )
    }
    
    render(){

        const {profile} = this.state

        return (<View style={{flex:1}}>

                <Header
                    placement="left"
                    leftComponent={<Icon 
                        name={'menu'}
                        color={'#fff'}
                        onPress={()=>{
                            this.props.navigation.toggleDrawer()
                            }}
                    />}
                    centerComponent={{ text: 'Profile', style: { color: '#fff' } }}
                    
                    />

                    <View style={{backgroundColor:'#f9f9f9',justifyContent:'space-between'}}>

                        <View style={{justifyContent:'flex-start',alignItems:'center',flexDirection:'row', padding:20,backgroundColor:'#fff',marginBottom:20}}>
                            <Image 
                                source={require('./../assets/avatar.png')}
                                style={{
                                    width:60,
                                    height:60,
                                    borderRadius:100,
                                    borderWidth:1,
                                    borderColor:'#000'
                                }}
                            />

                            <View style={{padding:10}}>
                                <Text style={{fontSize:24,fontWeight:'bold',color:'#000'}}>
                                    {
                                        profile['name'] || profile['username']
                                    }
                                </Text>

                                <Text style={{fontSize:14,paddingLeft:5}}>
                                    {
                                        profile['created_at'] || '21st May'
                                    }
                                </Text>
                            </View>
                        </View>

                        {/* settings */}
                        <View style={{backgroundColor:'#fff'}}>
                                <Text style={{fontWeight:'bold',color:'#000',fontSize:21,paddingHorizontal:26,paddingTop:20}}>
                                    Account Info
                                </Text>

                                <View style={{padding:10}}>
                                            <ListItem 

                                                title={`Email . ${profile['email_verified']?'Verified':'Not Verified'}`}
                                                titleStyle={{
                                                    fontWeight:'bold',
                                                    fontSize:15,
                                                    color:'#000'
                                                }}

                                                leftAvatar={
                                                    <Icon name={'email'} type={'Material'}/>
                                                }
                                                rightAvatar={<Icon name={'edit'} type={'FontAwesome'} onPress={
                                                    ()=>{
                                                        console.log('KEY')
                                                    }
                                                }/>}
                                                subtitle={`${profile['email'] ? profile['email']: '----'}`}
                                                bottomDivider= {true}
                                            />

                                            <ListItem 

                                                title={`Phone . ${profile['phone_verified']?'Verified':'Not Verified'}`}
                                                titleStyle={{
                                                    fontWeight:'bold',
                                                    fontSize:15,
                                                    color:'#000'
                                                }}

                                                leftAvatar={
                                                    <Icon name={'phone'} type={'Material'}/>
                                                }
                                                rightAvatar={<Icon name={'edit'} type={'FontAwesome'} onPress={
                                                    ()=>{
                                                        console.log('KEY')
                                                    }
                                                }/>}
                                                subtitle={`${profile['username'] ? profile['username']: '----'}`}
                                                bottomDivider= {true}
                                                />
                                </View>
                            
                        </View>
                    </View>

        </View>)
    }
})