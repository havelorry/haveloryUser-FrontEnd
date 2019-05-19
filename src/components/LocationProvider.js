import React from "react"
import {Platform,PermissionsAndroid} from "react-native"
import { SET_CURRENT_LOCATION } from "../reducers/MAPReducer";
import { connect } from "react-redux";

async function requestPermissions(func){
    if (Platform.OS == 'android') {
        try {
         const check = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
         if (check) {
             console.log('permission already exists')
             await func()
         }else{
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title:'Location request',
                    message:'Havelorry requires Location permissions',
                    buttonNeutral:'Ask me later',
                    buttonNegative:'cancel',
                    buttonPositive:'Grant'
                }
            )


            if (granted == PermissionsAndroid.RESULTS.GRANTED) {
                console.log('permission have taken')
                await func()
            }else{
                console.log('permisson denied')
            }
         }    

        } catch (error) {
            console.log(error.message);    
        }
    }
}


const mapDispatchToProps = dispatch => ({
    setCurrent:({latitude,longitude}) => {
        dispatch({
            type:SET_CURRENT_LOCATION,
            payload:{latitude,longitude}
        })
    }
})

const  mapStateToProps =(state) => ({
        map:state.map
})


class LocationProvider extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            lat:0,
            lng:0,
            fetched:false,
            region:{},
        }

        this.watchId = null
        this.changeRegion = this.changeRegion.bind(this)
        this.getLocation = this.getLocation.bind(this)
    }

    async getLocation(){
        await navigator.geolocation.getCurrentPosition(
            (postion) => {
                console.log(postion)
                this.setState(
                    state => ({
                        ...state,
                        lat:postion.coords.latitude,
                        lng:postion.coords.longitude,
                        fetched:true,
                    }),
                    ()=> this.props.setCurrent(postion.coords)
                )
            },
            (error) => {
                console.log(error);
                                
            }
        )
    }


    changeRegion(region){
        this.setState(state =>({...state,lat:region.latitude,lng:region.longitude}))
    }

    async componentDidMount(){
        await  requestPermissions(
            this.getLocation
        )
    }
    render() {
        const {lat,lng, fetched, region} = this.state
      return <React.Fragment>
          {
              this.props.children({
                lat ,lng ,fetched ,region, c:this.changeRegion                  
              })
          }
      </React.Fragment>
    }


    componentWillUnmount(){
        if (this.watchId != null) {
            navigator.geolocation.clearWatch(this.watchId)
        }
    }
}


export default connect(mapStateToProps,mapDispatchToProps)(LocationProvider)