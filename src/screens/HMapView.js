
import React from "react"
import {Animated,View,TouchableOpacity,Dimensions,Text,Modal,Platform,PermissionsAndroid} from "react-native"
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
import {setLocation} from "./../actions/map/MapActions"
import { bindActionCreators } from "redux";

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
            <InputRow title={'start'} color={'#8a2be2'} placeholder={'unnamed road'}/>
            <InputRow title={'end'} color={'#fa2be2'} placeholder={'unnamed road'} />
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
    paddingLeft:10,
    flexDirection:'row',
    alignItems:'center'
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
    <Text style={{paddingLeft:10, fontWeight:'normal', fontSize:15, color:'#000'}}>
        {props.title}
    </Text>
</TouchableOpacity>)


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


const BottomMenu = (props) => <Animated.View>
    {
        props.mapset ?
        <SetMap />
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

const SetMap = (props) =>(<View>
        <Content type={'heading'}>
            Set Destination
        </Content>
        <Space/>
        <Space/>
        <BorderedView>
            <View style={{padding:10,flexDirection:'row', alignItems:'center'}}>
            <Icon name={'fiber-manual-record'} color={'#fa2be2'} size={15}/>
            <View style={{marginLeft:20}}>
                <Text>Location</Text>
                <Text style={{fontSize:16,fontWeight:'bold'}}>
                    Unnamed Location
                </Text>    
            </View>
            </View>
            <Space/>

            <View style={{padding:10}}>
            <RoundButton size={20} color={'#fff'} background={'#8a2be2'} width={'100%'} onPress={
                ()=>{
                    console.log('Provie Implementatuon here')
                    
                }
            }>
                Set Destination
            </RoundButton>
            </View>
        </BorderedView>

    </View>)

const dims = Dimensions.get('window')

const samplepoints = [
    {
        latitude:26.2194700,
        longitude:78.2058112
    },

]

class DriverMap extends React.Component{
    constructor(props){
        x   =   null
        y   =   null

        super(props)
        this.state = {
            mapset:true,
            errors:null,
            x,y
        }
        this.toggleMap = this.toggleMap.bind(this)
    }


    toggleMap(){
        this.setState(state=>({...state, mapset:!state.mapset}))
    }


    render(){
        const {mapset} = this.state
        console.log(this.props)
                
        return <View style ={{
                        width:dims.width,
                        height:dims.height,
                        justifyContent: 'flex-end',
                        alignItems: 'center'}}>
                            
                            <LocationProvider>
                                {
                                    value => (
                                        value.fetched
                                        ?
                                        <MapView
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
                                                }
                                            }
                                            >
                                            
                                            <MarkerAnimated 
                                                title={'my location'}
                                                coordinate={{latitude:value.lat,longitude:value.lng}}
                                            />

                                            {
                                                samplepoints.map(
                                                    ({latitude,longitude},index) =>(<MarkerAnimated 
                                                        title={'my location'}
                                                        key={index}
                                                        coordinate={{latitude,longitude}}
                                                    />)
                                                )
                                            }
                                        </MapView>
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
                        ()=>this.toggleMap()
                        
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
                }/>

                
                    <ModelConsumer>
                        {
                            value => (
                                <AppModel visible={value.open} close={value.toggle}>
                                    <SearchView />
                                    <IconRow 
                                        icon={'home'}
                                        title={'Home'}
                                        />
                                </AppModel>
                            )
                        }
                    </ModelConsumer>
                
                </View>

      </View>
   
    }
}

const mapState = (state) => {
    return {
        network:state.network,
        map:state.map
    }
}

const mapDispatch = (dispatch) => bindActionCreators({setLocation},dispatch)

export default connect(mapState,mapDispatch)(DriverMap)
/* 
 */