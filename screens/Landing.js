import React from 'react'

import {
    View,
    Dimensions,
    Text,
    StyleSheet
} from 'react-native'

import {
    DoubleBounce
} from 'react-native-loader'

import {
    Asset,
    Video,
    Permissions
} from 'expo'


import styled from 'styled-components'
import { Link } from '../components/text';
import { VIA_SIGNUP, VIA_LOGIN } from '../constants/app';
/* 
    to be extracted
*/

const BaseButton = styled.TouchableOpacity`
    border-radius:${props => props.radii || 0}px;
    box-shadow:1px 2px 3px #000;
    height:${props=> props.height || 50}px;
    background:${props => props.background || '#fff'}
    color:${props => props.color || '#000'}
    width:${props => props.width || '100'}%
    justify-content:center;
    align-items:center;
    border:2px solid #eee
`


const Spacer = styled.View`
    height:${props => props.height || 10}px
`

const videoSource = require('./../assets/video/landing_onboarding_x_compressed_android.mp4')

const { height, width } = Dimensions.get('window');

class Landing extends React.Component{
    
    constructor(props){
        super(props)
        this.state = {loading:true}
    }
    
    async componentDidMount(){
        await Asset.fromModule(videoSource).downloadAsync()
        this.setState(state=>({...state,loading:false}))
        console.log('====================================');
        console.log(this.props.navigation.getScreenProps());
        console.log('====================================');
    }

    getPerms = async ()=>{
        const {status:existingStatus} = await Permissions.getAsync(Permissions.NOTIFICATIONS)
        var finalStatus = existingStatus
        if (existingStatus !== 'granted') {
            const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
            finalStatus = status;
        }

        if (finalStatus !== 'granted') {
            return;
          }

    }
    static navigationOptions ={
        header:null
    }

    render(){
        const {loading} = this.state
        const {t} = this.props.navigation.getScreenProps()
        
        console.log(loading)
        if (!loading) {
            return <View style={containerStyles}>
                 <Video
                    isLooping
                    isMuted={false}
                    resizeMode="cover"
                    shouldPlay
                    source={videoSource}
                    style={{ height, width}}
                />

                <Text style={{
                    position:'absolute',
                    top:'20%',
                    fontFamily:'GothamBold',
                    fontSize:50,
                    color:'#fff',
                    textAlign:'center',
                    width:'100%'
                }}>

                    Havelorry

                </Text>

                <View style={{position:'absolute',bottom:10,paddingHorizontal:30, width:'100%'}}>
                    <BaseButton radii={20} onPress={
                        ()=> this.props.navigation.navigate('login',{
                            'route':VIA_SIGNUP
                        })
                    }>
                        <Text>
                            {
                                t('signup')
                            }
                        </Text>
                    </BaseButton>
                    
                    <Spacer/>

                    <BaseButton radii ={20} onPress={
                        ()=> this.props.navigation.navigate('login',{
                            'route':VIA_LOGIN
                        })
                    }>
                        <Text>
                           {
                               t('login')
                           }
                        </Text>
                    </BaseButton>
                    <Spacer/>

                    <View style={{justifyContent:'center',alignItems:'center',backgroundColor:'transparent'}}>
                        <Link>
                            Open driver app
                        </Link>
                    </View>
                </View>
                   
            </View>
        } else {
            return <View style={{...PlaceHolderStyles}}>
                <DoubleBounce 
                    size={10}
                    color={'#8a2be2'}
                />
            </View>
        }
    }
}


const containerStyles = {
    flex:1
}

const PlaceHolderStyles = {
    width,
    height,
    justifyContent:'center',
    alignItems:'center'
} 


export default Landing