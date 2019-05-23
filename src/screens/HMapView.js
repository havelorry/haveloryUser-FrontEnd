
import React from "react"
import {Animated,View,TouchableOpacity,Dimensions,Text,Modal,Platform,StyleSheet,Image} from "react-native"
import {OvalButton, RoundButton} from "../components/ButtonGroup"
import {connect}  from "react-redux"
// import Icon from 'react-native-vector-icons/FontAwesome';
import  Icon from 'react-native-vector-icons/MaterialIcons'
import MapView, { PROVIDER_GOOGLE,MarkerAnimated } from 'react-native-maps';
import LocationProvider from "./../components/LocationProvider"
import {Content, LargeSpace} from './../components/text'
import {Space} from './../components/ButtonGroup'
import { TextInput } from "react-native";
import ModelContext,{ModelConsumer} from './../components/ModelContext'
import {API_CALL_FAILURE,API_CALL_REQUEST,API_CALL_SUCCESS} from "./../reducers/APIReducer"
import {APP_URL, formatQuery} from "./../constants/API"
import {FETCH_PROFILE} from "./../reducers/ProfileReducer"
import {withObservableStream} from "./../components/Observe"
import AsyncStorage from "@react-native-community/async-storage"
import { SET_CURRENT_LOCATION, SET_DEST, SET_ORIGIN, RESET_SUGGESSTIONS, SET_SUGGESSTIONS } from "../reducers/MAPReducer";
import {debounce} from "lodash"

function InputRow(props){
    return <View>
        <View style={{flexDirection:'row',alignItems:'center',paddingHorizontal:20}}>
        <Text style={{fontSize:12,color:props.color||'#000'}}>
            {props.title}    
        </Text>

        <TextInput placeholder={props.placeholder || "Unnamed Road"}  onChangeText={
            (value) => props.callback(value) || console.log("Provide Impl")
        } 
        
        style={{width:'90%',padding:10, fontSize:14}}
        />
    </View>

      <View style={{backgroundColor:'#eee', height:1,marginLeft:'20%'}}>
    </View>  

    </View>
}


const styles = StyleSheet.create({
    markerFixed: {
        left: '50%',
        marginLeft: -24,
        marginTop: -48,
        position: 'absolute',
        top: '30%'
      },
      marker: {
        height: 60,
        width: 60
    },
})


function BorderedView(props){
    return <View style ={{
        borderColor:'#eee',
        borderWidth:1,
        borderRadius:10,
        width:'95%'    
    }}>
        {
            props.children
        }
    </View>
}


function SearchView(props){
    return <View>
        <BorderedView>
            <InputRow title={'start'} color={'#8a2be2'} placeholder={'unnamed road'}
             callback={
                 (value) => {
                     props.queryHandler(value)
                 }
             }
            />
            <InputRow title={'end'} color={'#fa2be2'} placeholder={'unnamed road'} 
                callback={
                    (value) => {
                        props.queryHandler(value)
                    }
                }
            />
        </BorderedView>
    </View>
}


function AppModel(props){
    return <View style={{marginTop: 22}}>
    <Modal
      animationType="slide"
      transparent={false}
      visible={props.visible}
      onRequestClose={() => {
      }}>
    
    {/* title bar */}
    <View style={{padding:20, flexDirection:'row', alignItems:'center'}}>
        <Icon name={'close'} color={'#000'} size={20} onPress={
            ()=>{
                props.close() || console.log('Provide Implementaion')
            }
        }/> 
        <Text style={{color:'#000', fontWeight:'bold',fontSize:20, paddingLeft:20}}>
            {props.title|| "Trip"}
        </Text>
    </View>
    
      
      <View style={{flex:1,paddingLeft:'5%'}}>
      {
          props.children
      }          
      </View>
      
    </Modal>

  </View>

}


const rowStyle = {
    paddingTop:20,
    paddingHorizontal:10,
    flexDirection:'row',
    alignItems:'center',
}

const searchStyle = {
    padding:15,
    flexDirection:'row',
    alignItems:'center',
    borderRadius:10,
    elevation:1,
    backgroundColor:'#fff'
}

const IconRow = (props) => (<TouchableOpacity style={rowStyle} onPress={props.callback}>
    <View style={{backgroundColor:'#fe2be2',borderRadius:30,width:30,height:30, justifyContent:'center',alignItems:'center'}}>
        <Icon name={props.icon} color={'#fff'} size={20} style={{fontWeight:'normal'}}/>
    </View>
    <Text style={{paddingHorizontal:10, fontWeight:'normal', fontSize:15, color:'#000'}}>
        {props.title}
    </Text>
</TouchableOpacity>)


const SuggessionView = (props) => <View>
    {
        props.suggessions && props.suggessions.map(
            loc => <IconRow icon={'map'} title={loc.description} callback={
                ()=>{
                    console.log(props.dispatch({type:RESET_SUGGESSTIONS}))
                }
            }/>
        )
    }    
</View>


const Suggessions = connect((state)=>({
                    suggessions:state.map.suggessions
                    }),
    
                )(SuggessionView)

const SearchRow = (props) => (<TouchableOpacity style={searchStyle} onPress={
    ()=>{
        if (props.callback) {
            props.callback()
        }else{
            console.log('provide your impl');
        }
    }
}>
    <Icon name={props.icon} color={'#fe2be2'} size={20} style={{fontWeight:'normal'}}/>
    
    <Text style={{paddingLeft:10, fontWeight:'normal', fontSize:15}}>
        {props.title}
    </Text>
</TouchableOpacity>)


function CheckoutView(props){
    return  <View style={{justifyContent:'center',alignItems:'center'}}>
              <Text>
                Checkout
            </Text>
    </View>
}

const BottomMenu = (props) => <Animated.View>
    {
        props.mapset ?
        props.bothSet
        ?
        <CheckoutView />
        :
        props.originSet
        ?
        <SetMap buttonTitle={'Set Destination'} actionType={SET_DEST}/>
        :
        <SetMap buttonTitle={'Set Origin'} actionType={SET_ORIGIN}/>
        :
        <ModelConsumer>
     {
         value =>(<React.Fragment>
                <Content type="basic">
                    Good Morning Prabhanshu
                </Content>
    
            <Content  type="heading">
                Where are you going?
            </Content>

            <LargeSpace/>
            <SearchRow 
                icon ={'search'}
                title = {'Search Destination'}
                callback={value.toggle}
            />
            <IconRow 
            icon={'home'}
            title={'Home'}
            />

            
            <IconRow 
            icon={'pin-drop'}
            title={'Set from Map'}
            callback = {
                props.enableMap
            }
            />

         </React.Fragment>)
     }
 </ModelConsumer>
 
    }
</Animated.View>

const MapProps = (state) =>{
    const map = state.map
    const {origin,destination,current} = map;
    const originSet =origin.set != null ? true:false
    const destinationSet = destination.set != null?true:false

    return {
        origin,
        destination,
        originSet,
        destinationSet,
        bothSet:origin && destinationSet,
        current
    }
}

const DispatchMapProps = (dispatch) => ({
    setLocation:(type,payload) => dispatch({type,payload})
})


function SetMapView(props){
    console.log(props)

    return (<View>
        <Content type={'heading'}>
            {props.buttonTitle}
        </Content>
        <Space/>
        <Space/>
        <BorderedView>
            <View style={{padding:10,flexDirection:'row', alignItems:'center'}}>
            <Icon name={'fiber-manual-record'} color={'#fa2be2'} size={15}/>
            <View style={{marginLeft:20}}>
                <Text>Location</Text>
                <Text style={{fontSize:16,fontWeight:'bold'}}>
                    {JSON.stringify(props.current)}
                </Text>    
            </View>
            </View>
            <Space/>

            <View style={{padding:10}}>
            <RoundButton size={20} color={'#fff'} background={'#8a2be2'} width={'100%'} onPress={
                ()=>{
                    console.log(props.actionType)
                    const {latitude,longitude} = props.current

                    props.setLocation(props.actionType,{
                        text:"",
                        coords:{
                            latitude,
                            longitude
                        },
                        set:true
                    })
                }
            }>
                {props.buttonTitle}
            </RoundButton>
            </View>
        </BorderedView>

    </View>)
}



const SetMap = connect(MapProps,DispatchMapProps)(SetMapView)

const dims = Dimensions.get('window')

const samplepoints = [
    {
        latitude:26.2194700,
        longitude:78.2058112
    },

]

const marker = require('./../assets/marker.png')

class DriverMap extends React.Component{
    constructor(props){
        x   =   null
        y   =   null

        super(props)
        this.state = {
            mapset:false,
            errors:null,
            x,y,
            originSet:false,
            dstSet:false
        }
        this.toggleMap = this.toggleMap.bind(this)
        this.fetchQueries = this.fetchQueries.bind(this)
        this.delayQueries = debounce(this.fetchQueries,1000)
    }


    toggleMap(){
        this.setState(state=>({...state, mapset:!state.mapset}))
    }

    fetchQueries(value){
        if (value.length> 0) {
            
            fetch(formatQuery(value)).then(
                r => r.json()
            ).catch(err => console.log(err))
             .then(json => {
                 const suggesstions = json.predictions.map(({description,id})=>({description,id}))
                this.props.dispatch({
                    type:SET_SUGGESSTIONS,
                    payload:suggesstions
                })
             })
             .catch(err => console.log(err))
        }   
    }

    async componentDidMount(){
        const token = await AsyncStorage.getItem('token')
        this.props.fetchProfile(token, async (res)=>{
            await AsyncStorage.setItem('profile',JSON.stringify(res))
        },(err)=>{
            console.log(err)
        })
    }

    render(){
        const {mapset} = this.state
        console.log(this.props)
                
        return <View style ={{
                        width:dims.width,
                        height:dims.height,
                        justifyContent: 'flex-end',
                        alignItems: 'center'}}
                        
                        onPress={()=>{
                            this.props.navigation.toggleDrawer()
                        }}
                        >
                            
                            <LocationProvider>
                                {
                                    value => (
                                        value.fetched
                                        ?
                                        <React.Fragment>

                                            <MapView
                                            pointerEvents={'none'}
                                            provider={PROVIDER_GOOGLE}
                                            style ={{
                                                width:dims.width,
                                                height:2*(dims.height/3),
                                                justifyContent: 'flex-end',
                                                alignItems: 'center'
                                            }}
                                            region={{
                                                latitude: value.lat,
                                                longitude: value.lng,
                                                latitudeDelta: 0.015,
                                                longitudeDelta: 0.0121,
                                            }}

                                            onRegionChangeComplete ={
                                                (region) => {
                                                    value.c(region)
                                                    this.props.setCurrentLocation(region.latitude.toFixed(3), region.longitude.toFixed(3))
                                                }
                                            }
                                            />
                                            
                                            <View style={styles.markerFixed}>    
                                                <Image style={styles.marker} source={marker} />
                                            </View>
                                        </React.Fragment>
                                            
                                        :
                                        <Text>
                                            Loading..
                                        </Text>
                                    )
                                }
                            </LocationProvider>
        
            { <Animated.View style ={{
                    position:'absolute',
                     top:15,
                    left:15,
                    zIndex:100
                }}>
            
                  {<OvalButton size={40} onPress={
                        ()=>this.props.navigation.toggleDrawer()
                    } bg="#fff" >
                        <Icon name="menu" color="#000" size={17}/>
                    </OvalButton> }
            
                </Animated.View> 
                }


               {
                   mapset ? <View style ={{
                    position:'absolute',
                     top:'46%',
                    left:15,
                    zIndex:100
                }}>
            
                  {<OvalButton size={50} onPress={
                        ()=>this.toggleMap()
                        
                    } bg="#fff" >
                        <Icon name="arrow-back" color="#000" size={20}/>
                    </OvalButton> }
            
                </View> 
               :
               null
               } 


               <View style ={{
                    position:'absolute',
                     top:'46%',
                    right:15,
                    zIndex:100
                }}>
            
                  {<OvalButton size={50} onPress={
                        ()=>{
                            this.toggleMap();
                            this.setState({
                                ...this.state,
                                mapset:true
                            })
                        }
                        
                    } bg="#fff" >
                        <Icon name="my-location" color="#000" size={20}/>
                    </OvalButton> }
            
                </View>

                <View style={{
                    width:dims.width,
                    padding:20,
                    height:1*(dims.height/3)+75,
                }}>
                <BottomMenu mapset={mapset} enableMap= {
                    ()=> this.toggleMap()
                } 
                
                {...this.props}
                />

                
                    <ModelConsumer>
                        {
                            value => (
                                <AppModel visible={value.open} close={value.toggle}>
                                    <SearchView queryHandler={this.delayQueries}/>
                                    <IconRow 
                                        icon={'home'}
                                        title={'Home'}
                                        />
                                    <Suggessions/>
                                </AppModel>
                            )
                        }
                    </ModelConsumer>
                
                </View>

      </View>
   
    }
}

const mapState = (state) => {
   
    const {origin,destination,} = state.map;
    const originSet =origin.set
    const destinationSet = destination.set
    const bothSet = originSet && destinationSet
    return {
        network:state.network,
        map:state.map,
        profile:state.profile.profile,
        originSet,
        destinationSet,
        bothSet
    }
}

const mapDispatchToProps = dispatch =>({
    fetchProfile:(token, success,failure) => {
        dispatch({type:API_CALL_REQUEST})
        const url = `${APP_URL}api/profile/`
        console.log(url)
        fetch(url,{
            headers:{
                'Content-Type':'application/json',
                'Authorization':`TOKEN ${token}`
            }
        }).then(
            res => res.json()
        )
        .catch(err => {
            failure(err)
        })
        .then(
            json => {
                dispatch({type:API_CALL_SUCCESS,payload:json})
                if (json.status) {
                    dispatch({type:FETCH_PROFILE,payload:json.data})
                    success(json.data)
                }else{
                    console.log('refresh token')
                }
            }
        ).catch(
            err => {
                dispatch({type:API_CALL_FAILURE})
                failure(err)
            }
        )
    },

    setCurrentLocation:(lat,lng) => dispatch({
        type:SET_CURRENT_LOCATION,
        payload:{
            lat,lng
        }
    }),
    dispatch
})

// const mapDispatch = (dispatch) => bindActionCreators({setLocation},dispatch)

export default connect(mapState,mapDispatchToProps)(DriverMap)
/* 
 */