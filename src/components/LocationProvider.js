import React from "react"
import {Geolocation} from 'react-native'
export default class LocationProvider extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            lat:0,
            lng:0
        }

        this.watchId = null
    }


    componentDidMount(){
        this.watchId = navigator.geolocation
                 .watchPosition(
            (position) => {
                lat = position.coords.latitude
                lng = position.coords.longitude

                this.setState(
                    state => ({...state, lat,lng})
                )
                this.props.callback({lat,lng})
            },
            error => this.props.handleExp
        )
    }

    render() {
        const {lat,lng} = this.state
      return <React.Fragment>
          {
              this.props.children({
                lat,lng                  
              })
          }
      </React.Fragment>
    }


    componentWillUnmount(){
        navigator.geolocation.clearWatch(this.watchId)
    }
}