/* imports */

import React, { Component,useEffect,useState,useRef } from 'react';
import { Text,FlatList ,
          View, StyleSheet,
          Dimensions,Platform,
          TouchableOpacity,Easing,
          AsyncStorage,TextInput,Alert} from 'react-native';
import { Constants, Location, Permissions, Notifications } from 'expo';
import {Bubbles} from "react-native-loader"
import * as Animatable from "react-native-animatable"
import { inject, observer } from 'mobx-react';
import {Ionicons, FontAwesome} from "@expo/vector-icons"
import Animated from 'react-native-reanimated';
import {debounce} from "lodash"
import {driverUrl, formatCoordinates, RideStatus, FetchDirections,TOKEN_URL} from "./../constants/API"
import {formatQuery,placeIdToCoordinates, SOCK_URL} from "./../constants/API"
import { ListItem, Divider, Button, ButtonGroup } from 'react-native-elements';
import MapView,{Polyline} from "react-native-maps"
import { OvalButton } from "./../components/ButtonGroup";
import DateTimePicker from 'react-native-modal-datetime-picker';
import { inCircle } from '../components/distance';
import {ModelConsumer} from "./../components/ModelContext"
import {withNavigation} from "react-navigation"
/* constants */
// import isPointWithinRadius from 'geolib/es/isPointWithinRadius'

const PolyLine = require('@mapbox/polyline')

const {width,height} = Dimensions.get('screen')
const MAP_HEIGHT = height
const CONTENT_HEIGHT = height/3-50

// call in Two Arguments

const filterDrivers = (drivers,point)  => {
  return drivers.filter(driver => {
    const location = {
      latitude:driver.location.x,
      longitude:driver.location.y
    }
    return inCircle(location,point)
  })
}

/* styles region*/

const searchStyle = {
    padding:15,
    flexDirection:'row',
    alignItems:'center',
    borderRadius:10,
    elevation:2,
    backgroundColor:'#fff'
}


const fragmentStyles = {
    padding:15,
    zIndex:100,
    flex:1,
    backgroundColor:'#fff'
}

const normalTextStyle ={
    fontWeight:'300',
    fontSize:16,
    marginBottom:8
}

const BoldetextStyle ={
    fontWeight:'bold',
    fontSize:18,
    marginBottom:15
}

const Ion = ({name,size}) => Platform.OS == 'android' ? <Ionicons name={`ios-${name}`} size={size || 20} color={'#fe2be2'}/> :<Ionicons name={`md-${name}`} size={size || 20}  color={'#fe2be2'}/>

/* end styles */

/* hooks */


/* hooks */


/* placeholder view */

function PlaceHolderView(props){
    return <Animatable.View style={{minHeight:CONTENT_HEIGHT,position:'absolute',bottom:0,width:'100%'}} animation={'slideInUp'}>
            {props.children}
    </Animatable.View>
}

/* placeholder view */


/* searchview */

const SearchRow = (props) => (<TouchableOpacity style={searchStyle} onPress={props.onPress}>
    <Ion name={'search'} color={'#fe2be2'} size={20} style={{fontWeight:'normal'}}/>
    <Text style={{paddingLeft:10, fontWeight:'normal', fontSize:15}}>
        {props.title}
    </Text>
</TouchableOpacity>)


/* Search Row */

function InputRow(props){
  return <View>
      <View style={{flexDirection:'row',alignItems:'center',paddingHorizontal:20}}>
      <Text style={{fontSize:12,color:props.color||'#000'}}>
          {props.title}    
      </Text>

      <TextInput placeholder={props.placeholder || "Unnamed Road"}  
      
      onFocus={
        (e) => {
          props.focusCallback()
        }
      }

      onEndEditing ={
        (e) => {
          const {nativeEvent:{text}} = e
          props.callback(text)
        }
      }
      style={{width:'90%',padding:10, fontSize:14}}
      />
  </View>

    <View style={{backgroundColor:'#eee', height:1,marginLeft:'20%'}}>
  </View>  

  </View>
}


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


const SearchView  =  withNavigation((props)  =>{
  const  {t} =  props.navigation.getScreenProps()
  return <View>
      <BorderedView>
          <InputRow title={t('start')} color={'#8a2be2'} placeholder={props.originTxt ||'unnamed road'}
           callback={
               (value) => {
                   props.handleOrigin(value)
               }
           }


           focusCallback ={
             props.onfocusOrigin
           }
          />
          <InputRow title={ t('end')} color={'#fa2be2'} placeholder={props.destinationTxt ||'unnamed road'} 
              callback={
                  (value) => {
                      props.handleDest(value)
                  }
              }

              focusCallback ={
                props.onfocusDst
              }
          />
      </BorderedView>
  </View>
})

/* origin selector */
class OriginUI extends React.Component{ 
  
  state={
    enablePicker:false
  }

  componentDidMount() {
    this.props.onLoad()
  }
  
  render(){
      const {props} = this
      const {map:{currentLocation:{text}}} = props
      const {t} = props.navigation.getScreenProps()
      console.log('====================================');
      console.log('====================================');
      return <Animated.View style={fragmentStyles}>
              <Animated.View style={[{paddingVertical:10,paddingHorizontal:7}]}>
                <Text style={{fontSize:22, fontWeight:'bold',marginBottom:15}}>
                  {t('set pickup')}
                </Text>

                <ListItem 
                  title= {'Location'}
                  subtitle={ text || 'Some Random text'}
                  leftIcon={<FontAwesome name={'dot-circle-o'} size={20} color={'#6f8ca5'} style={{marginLeft:5}}/>}
                  containerStyle={{borderWidth:2,borderColor:'#eee',backgroundColor:'#fff',borderRadius:5,padding:7,marginBottom:25}}
              />


              <TouchableOpacity style={{borderRadius:20,backgroundColor:'#6f8ca5',elevation:1,minHeight:60}} onPress={
                ()=> {
                  props.map.currentLocation.fix()
                }
              } >
                  <Text style={{color:'#fff',textAlign:'center',marginTop:17, fontWeight:'bold', fontSize:22}}>
                    {t('set pickup')}
                  </Text>
              </TouchableOpacity>

                <View style={{height:10}}/>

              <TouchableOpacity style={{borderRadius:20,backgroundColor:'#6f8ca5',elevation:1,minHeight:60}} onPress={
                ()=> {
                  this.setState({enablePicker:true})
                }
              } >
                  <Text style={{color:'#fff',textAlign:'center',marginTop:17, fontWeight:'bold', fontSize:22}}>
                    {t('schedule ride')}
                  </Text>
              </TouchableOpacity>

                <DateTimePicker 
                  isVisible={this.state.enablePicker}
                  mode={'datetime'}
                  onConfirm={
                    (date)=>{
                      const extra = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`
                        props.map.setExtra(extra)
                      this.setState({enablePicker:false})
                    }
                  }

                  onCancel={
                    ()=>{
                      this.setState({enablePicker:false})
                    }
                  }
                />
              </Animated.View>

              
          </Animated.View>
    }
}

const OriginSelector = inject('map')(observer(withNavigation(OriginUI)))

@inject('map','suggession')
@observer
class DestinationSelector extends Component{
  
    constructor(props){
      super(props)
      this.animatedValue = new Animated.Value(CONTENT_HEIGHT)
      this.state ={
        expanded:false,
        actionType:null
      }

      this.fetchQueries = this.fetchQueries.bind(this)
    }


    componentWillUnmount() {
      if(this.fetchQueries)
       this.fetchQueries = null
    }

    expand = () =>{
      Animated.timing(this.animatedValue,{
        toValue:MAP_HEIGHT,
        duration:500,
        easing:Easing.linear
      }).start()
      this.setState({expanded:true})
    }

    collapse = () => {
      Animated.timing(this.animatedValue,{
        toValue:CONTENT_HEIGHT,
        duration:500,
        easing:Easing.linear
      }).start()
      this.setState({expanded:false})
    }


    

    fetchCoordinates(placeId,text,origin=false){
      fetch(placeId).then(res=>res.json())
      .catch(err => console.log(err))
      .then(json => {
          const {geometry:{location:{lat:latitude,lng:longitude}}} = json.result
          const {map,suggession} =this.props
          const {actionType} = this.state
          console.log({actionType});
          
          if (actionType=='ORIGIN') {
            map.updateOrigin(latitude,longitude,text)
          } else {
            map.updateDestination(latitude,longitude,text)
          }

          this.props.suggession.setProcessing(false)
          suggession.clear()
          this.collapse()
      })
      .catch(err => console.log(err))
  }

  

  fetchQueries(value){
      this.props.suggession.setLoading(true)

      if (value.length> 0) {
          fetch(formatQuery(value)).then(
              r => r.json()
          ).catch(err => console.log(err))
           .then(json => {
               console.log(json.predictions)
               const suggesstions = json.predictions.map(({description,place_id})=>({description,id:place_id}))
              this.props.suggession.addSuggessions(suggesstions)
              this.props.suggession.setLoading(false)
              this.props.suggession.setFinished(true) 
           })
           .catch(err => {
                  this.props.suggession.suggessions = []
                  this.props.suggession.setLoading(false)
                  this.props.suggession.setFinished(true)
                  console.log(err)
          })
      }   
  }


    render(){
      const {t} = this.props.navigation.getScreenProps();
      const {loading,finished,values, processing} = this.props.suggession
      const {map}= this.props
      console.log('====================================');
      console.log('DESTINATION VIEW');
      console.log(map)
      console.log('====================================');
     
      return <Animated.View style={[fragmentStyles,{height:this.animatedValue}]}>
            {
               this.state.expanded
               ?
              <View style={{flexDirection:'row',justifyContent:'space-between',paddingVertical:15,paddingHorizontal:5, alignItems:'center',marginTop:60}}>
                  <Ionicons name={'md-close'} color={'#000'} onPress={this.collapse} size={32}/>
                  
                  <Text style={{color:'#000', fontWeight:'bold',fontSize:20, paddingLeft:20,flex:1}}>
                    { t("trip")}
                  </Text>
                  
                  <TouchableOpacity onPress ={this.collapse}>
                      <Text style={[BoldetextStyle,{marginTop:7}]}>
                        {t('done')}
                      </Text>
                  </TouchableOpacity>
              </View>
              :
              <View>
                 <Text style={normalTextStyle}>
                    {t('hi there')}
                </Text>

                <Text style={BoldetextStyle}>
                {t('where are you going')}
                </Text> 
              </View>
            }

            {
              this.state.expanded
              ?
              <SearchView 
                handleOrigin ={this.fetchQueries}
                onfocusOrigin = {
                  () => {
                    this.setState(state=>({...state,actionType:'ORIGIN'}))
                  }
                }
                
                originTxt ={map.origin.text}
                destinationTxt = {map.destination.txt }
                onfocusDst = {
                  () => {
                    this.setState(state=>({...state,actionType:'DST'}))
                  }
                }

                
                handleDest = {this.fetchQueries}
              />
              :
              <SearchRow  onPress ={() => {
                this.expand()
              }} title={t('search destination')}/>

            }
            
            {
              loading  
              &&
              <View style={{justifyContent:'center',alignItems:'center',minHeight:40}}>
                <Bubbles size={10} color={'#6f8ca5'} />
              </View>
            }  


            {
            (!loading && finished && values.length > 0)
              ?
              <FlatList 
              keyExtractor = {
                (item,index) => index.toString()
              }

              data ={values}

              renderItem = {
                ({item}) => <ListItem  
                  title={item.description} 
                  leftIcon={<Ionicons name={'md-map'} size={22} color={'#6f8ca5'} />}
                  onPress = {
                    () => {
                      const {id,description} = item
                      this.props.suggession.setProcessing(true)
                      this.fetchCoordinates(
                          placeIdToCoordinates(id),
                          description)
                    }
                  }/>}

              />
              :
              <View style={{justifyContent:'center',alignItems:'center',minHeight:50}}>
                  <Text style={[BoldetextStyle,{textAlign:'center'}]}>
                  {t('no record found')}
                </Text>
              </View> 
            }    
            
            {
              processing 
                &&
              <View style={{justifyContent:'center',alignItems:'center', minHeight:60}}>
                 <Bubbles size={10} color={'#6f8ca5'}/> 
              </View>
            }
        </Animated.View>
    }
}


function CheckOutUI(props){

  const details = props.map.payload()
  const {t} =  props.navigation.getScreenProps()
  const fields = [
    {key:'Source',value:details.origin_string},
    {key:'Destination',value:details.dest_string},
    {key:'Fare',value:`${details.fare} kd`},
    {key:'workers',value:`${details.workers}`},
  ]
    return <ModelConsumer>
      {
        ({open,toggle}) => (<Animated.View style={fragmentStyles}>
          <Text style={[BoldetextStyle,{textAlign:'center'}]}>
              Checkout View
          </Text>

          <View style={{display: !open ? 'flex':'none'}}>
              <Button 
                  onPress= {
                      ()=>{
                        console.log('====================================');
                        toggle(true)
                        console.log('====================================');
                      }
                  }
                  style={{width:'90%'}}
                  color={'#6f8ca5'}
                  title={'Checkout'}

              />
            </View>

            <Animated.View style={{display: open ? 'flex':'none'}}>

              <FlatList
                 keyExtractor={(item,index)=> index.toString()} 
                 data ={fields}
                 renderItem={
                   ({item},index) => {
                     return <ListItem 
                        title={item.key}
                        subtitle={item.value}
                        leftIcon={
                          <FontAwesome size={10} color={'#6f8ca5'} name={'check-circle'}/>
                        }
                     />
                   }
                 }
              />

              <View style={{height:10}}/>

              <View style={{paddingHorizontal:10,justifyContent:'space-around',alignItems:'center',flexDirection:'row'}}>
                 <Button 
                  color={'#6f8ca5'}
                  onPress={
                    props.map.addWorker
                  }
                  title={'+1 worker'}
                 />
                 
                 <Text>
                   Workers :{details.workers}
                 </Text>
                 <Button 
                  color={'#6f8ca5'}
                  title={'-1 worker'}
                  onPress={props.map.removeWorker}
                 />
              </View>

                <Button 
                  onPress= {
                      ()=>{
                        console.log('====================================');                        
                        toggle(false)
                       props.map.reset()
                        console.log('====================================');
                      }
                  }
                  style={{width:'90%'}}
                  color={'#f00'}
                  title={'Cancel'}

              />

              <View  style={{height:10}}/>
            
              <Button 
                  onPress= {
                      ()=>{
                        console.log('====================================');
                        
                        AsyncStorage.getItem('username').then(
                          username => {
                            props.map.Checkout({
                              ...props.map.payload(),
                              customer_id:username
                            }, ()=>{
                              toggle(false)
                            })
                            /*
                            Checkout({
                              ...props.map.payload(),
                              customer_id:username
                            })*/
                          }
                        )
                        console.log('====================================');
                      }
                  }
                  style={{width:'90%'}}
                  color={'#6f8ca5'}
                  title={props.map.requesting ? 'requesting ...' :'Confirm'}

              />    
            </Animated.View>

           
      </Animated.View>)
      }
    </ModelConsumer>
}

const CheckOutSelector =  inject('map')(observer(withNavigation(CheckOutUI)))

function ProductUI(props){
    
  const {drivers} = props
    
    return <Animated.View style={fragmentStyles}>
            <Text style={BoldetextStyle}>
               Select driver
              </Text>
            {
              drivers && drivers.length > 0 ?
              <FlatList 
              data={drivers}
              keyExtractor={(item,index) => index.toString()}
              renderItem={
                ({item}) => <ListItem 
                    title={`HAVELLORY X ${item.workers}`}
                    subtitle={`Number of workers ${item.workers} \n Pricing 10kd/km`}
                    bottomDivider={true}
                    leftIcon={
                      <FontAwesome name={'dot-circle-o'} color={'#6f8ca5'} size={32}/>
                    }

                    onPress = {
                      ()=> {
                        props.map.chooseDriver(parseInt(item.username_id))
                        console.log(props.map)
                      }
                    }
                    rightIcon={
                      <FontAwesome name={'life-saver'} color={'green'} size={32}/>
                    }
                />
              }
            />
            :
            <Button 
              title={'back'}
              onPress = {
                ()=> {
                  props.resetPath()
                  props.map.reset()
                }
              }
            />
            }
        </Animated.View>
}

const ProductView = inject('map')(observer(withNavigation(ProductUI)))


function Ui(props){
    const {map} = props
    console.log('====================================');
    console.log('UIVIEW'+ map.ui);
    console.log(map.ui);
    console.log('====================================');
    console.log("---------------------------------");
    console.log({"MAP STATUS NOT CHANGNG":map.ui})
    switch (map.ui) {
        case 0:
        case 2:
            return <DestinationSelector {...props} /> /* replace with DestinationSelector when done */
        case 1:
            return <OriginSelector {...props}/>
        case 3:
            return <ProductView {...props} />    
        
        case 4:
            return <CheckOutSelector {...props}/>
        default:break
    }
}

const UiView = withNavigation((inject('map')(observer(Ui))))

class App extends Component {
  state = {
    mapRegion: null,
    hasLocationPermissions: false,
    locationResult: null,
    initialLocation:null,
    // markerCoordinate:new Marker.AnimatedRegion({}),
    driverMarkers:[],
    canRender:true,
    path:[]
  };


  /**
   * 
   * Notifications Data 
   */



loadToken = async () => {
     try{
        const token = await Notifications.getExpoPushTokenAsync()
        return token
     }catch(err){
         return err
     }   
}

postToken = (url, data) => fetch(url,{
    method:'post',
    headers:{
        'Content-Type':'application/json'
    },
    body:JSON.stringify(data)
})

loadNRegister = (value) =>{
    AsyncStorage.getItem('username').then(
        username => {
            if (username) {
               console.log('============IN LOAD N REFOSTER========================');
               this.loadToken().then(token =>{
                    this.postToken(TOKEN_URL,{username,token,identification:'user'}).then(
                      console.log('DATA POSTED')
                    ).catch(err => {
                        console.log(err.message);
                        
                    })
               })
               console.log('====================================');
            }
        }
    )
}

   /**
    * 
    * Notifications 
    */
  constructor(props){
    super(props)
    this.websocket = new WebSocket(SOCK_URL)
    this.Connect = this.Connect.bind(this)
    this.Connect()
  }


  componentDidMount() {
    this._getLocationAsync();
  }

  componentWillReceiveProps(nextProps, nextState){
    console.log('New data');

  }

  Connect(){
    var self = this
    this.websocket.onopen = function(e){
      console.log('====================================');
      console.log('POLL STARTED');
      console.log('====================================');
    }


    this.websocket.onmessage = function(event){
        const data = JSON.parse(event.data)
        switch (data.type) {
          case 'user.notifictions':
            this.setState(state => ({
              ...state,
              driverMarkers:filterDrivers(data.list,this.state.initialLocation)
            }))
            break;
        
          default:
            break;
        }
      
    }


    this.websocket.onclose = function(ev){
      self.Connect()
      console.log('SHUT DOWN')
    }
  }
  
  _handleMapRegionChange = mapRegion => {
    
    this.setState({ mapRegion });
      const  {latitude, longitude} = mapRegion
      const floatPoints = {
        latitude:latitude.toFixed(3),
        longitude:longitude.toFixed(3)
      }

      const newRegion = this.state.mapRegion
      const oldLat = parseFloat(newRegion.latitude).toFixed(3)
      const oldLng = parseFloat(newRegion.latitude).toFixed(3)

      const newLat = latitude.toFixed(3)
      const newLng = longitude.toFixed(3)

      if (newLat - oldLat==0 && newLng - oldLng==0) {
        console.log('Equel coordinates making request is waste')
      } else {
        fetch(formatCoordinates(floatPoints))
        .then( r => r.json())
        .catch(err => console.log(err))
        .then(json => {
          console.log(
            json
          )
          const {results} = json
          const [result] = results
          const {formatted_address} = result
          this.props.map.updateLocation(latitude,longitude,formatted_address)
          this.props.map.updateOrigin(latitude,longitude,formatted_address)
          console.log('====================================');
          console.log({results});
          console.log('====================================');
          if (this.props.map.destination.fixed) {
            fetch(
                FetchDirections(
                  formatted_address,
                  this.props.map.destination.text
                )
              ).then(
                response => response.json() 
              ).then(
                respJson => {
                  const path = PolyLine.decode(respJson.routes[0].overview_polyline.points).map(([latitude,longitude],index)=>({latitude,longitude}));
                  this.setState(state =>({...state,path}))
                }
              ).catch(err => {
                console.log(err)
                console.log({floatPoints});
                
              })
          }

        })

        console.log('====================================');
        
      }
          
      
  };

_handleRemoteChange = () =>{

  fetch(
    FetchDirections(
      this.props.map.currentLocation.text,
      this.props.map.destination.text
    )
    ).then(
      response => response.json() 
    ).then(
      respJson => {
        const path = PolyLine.decode(respJson.routes[0].overview_polyline.points).map(([latitude,longitude],index)=>({latitude,longitude}));
        this.setState(state =>({...state,path}))
      }
    ).catch(err => console.log(err))

}

  _getLocationAsync = async () => {
   let { status } = await Permissions.askAsync(Permissions.LOCATION,Permissions.NOTIFICATIONS);
   if (status !== 'granted') {
     this.setState({
       locationResult: 'Permission to access location was denied',
     });
   } else {
     this.setState({ hasLocationPermissions: true });
   }

   let location = await Location.getCurrentPositionAsync({});
   this.setState({ locationResult: JSON.stringify(location),currenLocation:location });
   this._update(location.coords)
   this.setState(state=>({...state,
    initialLocation: { 
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421 }
  }),()=>{
    this.loadNRegister(true)
  })
   // Center the map on the location we just fetched.
    this.setState({mapRegion: { latitude: location.coords.latitude, longitude: location.coords.longitude, latitudeDelta: 0.0922, longitudeDelta: 0.0421 }});
  };


  
  _update = (coords) => {
    fetch(driverUrl(coords)).then(
      res => res.json()
    ).then(
      driverMarkers => {
        const markers =  driverMarkers.filter(({location:{
          x:latitude,
          y:longitude
        }})=>{
          return inCircle({ latitude,longitude},{ ...coords })
        })

        this.setState( state => ({...state,driverMarkers}))
        console.log('====================================')
        console.log('MARKERS IMPORTED')
        console.log(markers)
        console.log('====================================')}).catch(err => console.log(err))
      
  }

_resetPath = () =>{
  this.setState(state=>({...state,path:[]}))
}



componentWillUnmount() {
  if (this.websocket) {
    delete this.websocket
  }
}

  render() {

    const {map} = this.props
    const {driverMarkers}  = this.state 
    return (
      <View style={styles.container}>

                <Animated.View style ={{
                    position:'absolute',
                     top:35,
                    left:14,
                    zIndex:100
                }}>
            
                  {<OvalButton size={40} onPress={
                        ()=>this.props.navigation.toggleDrawer()
                    } bg="#fff" >
                        <Ionicons name="md-menu" color="#000" size={17}/>
                    </OvalButton> }
            
                </Animated.View>

                <View style ={{
                    position:'absolute',
                     top:'63%',
                    right:15,
                    zIndex:100
                }}>
            
                  {<OvalButton size={50} onPress={
                        ()=>{
                            console.log(this.mapRef.animateToRegion(this.state.initialLocation,300))
                        }
                        
                    } bg="#fff" >
                        <Ionicons name="md-locate" color="#000" size={20}/>
                    </OvalButton> }
            
                </View>      


        {
          this.state.locationResult === null ?
          <View style={{width,height,justifyContent:'center',alignItems:'center'}}>
              <Bubbles size={10} color={'#6f8ca5'}/>
          </View> :
          this.state.hasLocationPermissions === false ?
            <Text>Location permissions are not granted.</Text> :
            this.state.mapRegion === null ?
            <Text>Map region doesn't exist.</Text> :
            <MapView
              style={{ alignSelf: 'stretch', height: MAP_HEIGHT }}
              region={this.state.mapRegion}
              onRegionChangeComplete={this._handleMapRegionChange}
              ref= {
                input => {
                  this.mapRef = input
                }
              }
            >

              <MapView.Marker
                coordinate = {this.state.mapRegion}
                
              >
                <FontAwesome name="map-pin" color={'#6f8ca5'} size={32}/>
              </MapView.Marker>
              {
                driverMarkers && driverMarkers.length > 0
                 &&
                 driverMarkers.map(
                   ({location:{x,y}},index) => <MapView.Marker key={index} coordinate= {
                     {
                      latitude:parseFloat(x),longitude:parseFloat(y)
                     }
                   }
                  
                   >
                     <FontAwesome name={'truck'} color={'#0d0'} size={32}/>

                   </MapView.Marker>
                 )
              } 

              {
                this.state.path.length > 0
                &&
                <Polyline 
                  coordinates={this.state.path}
                  strokeWidth={3}
                  strokeColor={'#8a2be2'}
                />
              }
            </MapView>
        }
        
        <PlaceHolderView>
            <UiView 
             drivers = {this.state.driverMarkers}
             onLoad={this._handleRemoteChange}
             resetPath={this._resetPath}
             />
        </PlaceHolderView>

      </View>
        
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#34495e',
  },
});


App.NavigationsOptions = ({navigation}) =>({
  ...navigation,
  drawerLabel:'Request Havelorry'
})

const HMapView = inject('map','rides')(observer(App))

export default HMapView
