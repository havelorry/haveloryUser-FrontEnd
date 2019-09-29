import {types, flow} from "mobx-state-tree"
import {formatCoordinates, RideStatus} from "./../constants/API"
import {Alert} from "react-native"

export const Coordinate = types.model({
    latitude:0,
    longitude:0
}).actions(self=>({
    setCoordinate(x,y){
        console.log(self)
        self.latitude = x
        self.longitude = y
    }
})).views(self=>({
    get text(){
        return JSON.stringify(self) 
    }
}))


const Proto = types.model({
    coordinate:types.optional(Coordinate,{}),
    text:"",
    fixed:false
}).actions(self =>({
    update(x,y,text){
        self.coordinate.setCoordinate(x,y)
        self.text = text
    },

    fix(){
        self.fixed =true
    }
})).views(self  =>({
    get fixedLocation(){
        return self.fixed;
    }
}))

/* 
    3 -> show drivers List
    0 -> show Destination Selector
    1 -> show Origin Selectorprops
    2 -> show destination selector
*/

const MapState = types.model({
    origin:types.optional(Proto,{}),
    destination:types.optional(Proto,{}),
    driverChoosen:false,
    currentLocationState:false,
    currentLocation:types.optional(Proto,{}),
    driver:types.optional(types.number,0),
    userId:types.optional(types.string,""),
    is_scheduled:false,
    extra:types.optional(types.string,"NULL"),
    requesting:false,
    workers:types.optional(types.number,0),
    fare:types.optional(types.number,15)
}).actions(self=>({
    updateOrigin(x,y, text){
        self.origin.update(x,y,text)
        self.origin.fix()
    },
    updateDestination(x,y,text){
        self.destination.update(x,y,text)
        self.destination.fix();
    },

    chooseDriver(drv){
        self.driver = drv
        self.driverChoosen = true
    },

    updateLocation(x,y, z){
        self.currentLocation.update(x,y,z)
    },

    reset(){
        self.currentLocation.fixed = false
        self.origin.fixed= false
        self.destination.fixed= false
    },

    updateUser(user){
        self.userId = user
    },
    
    setExtra(DATE){
        self.extra = DATE
        self.is_scheduled = true
    },

    updateRequestStatus(data){
        self.requesting = data
    },

    Checkout(data, func){
        self.updateRequestStatus(true)
        fetch(RideStatus,{
            method:'post',
            headers:{
              'Content-Type':'application/json'
            },
            body:JSON.stringify(data)
          }).then(
            r => r.json()
          )
          .catch(err => console.log(err))
          .then(
            res => {
                self.updateRequestStatus(false)
                flow(function* (){
                    func()
                })

              if (res) {
                Alert.alert('info', res.message,[
                  {
                   text:'dismiss',
                   onPress:()=>{
                     self.reset()
                   }
                  }
                ])
              }    
            }
          ).catch(err => {
              self.updateRequestStatus(false)
              flow(function* (){
                func()
              })
            console.log(err.message)
          })
    },

    addWorker(){
        self.workers  = self.workers +1
    },

    removeWorker(){
        if (self.workers  > 0) {
            self.workers  = self.workers -1
        }else{
            console.log("No workers");
        }
    }


})).views(self=>({

    get ui(){
        console.log({"origin":self.origin.fixedLocation,"dest":self.destination.fixedLocation});
        if (self.origin.fixedLocation && self.destination.fixedLocation) {
            if(self.driverChoosen){
                return 4
            }

            if (self.currentLocation.fixedLocation) {
                return 3
            } else {
                
            }
            return 1
        }

        if (self.origin.fixedLocation) {
            return 2
        }

        if (self.destination.fixedLocation) {
            return 1
        }

        return 0
    },

    payload(){
        return {
            origin_latitude:self.origin.coordinate.latitude,
            origin_longitude:self.origin.coordinate.longitude,
            dest_latitude:self.destination.coordinate.latitude,
            dest_longitude:self.destination.coordinate.longitude,
            dest_string:self.destination.text,
            origin_string:self.origin.text,
            driver_id:self.driver,
            customer_id:self.userId || "2",
            status:1,
            fare:self.fare + (self.workers  * 10),
            extra:self.extra,
            workers:self.workers,
            is_scheduled:self.is_scheduled,
        }
    }
}))

const mapState = MapState.create()
export {
    mapState
}