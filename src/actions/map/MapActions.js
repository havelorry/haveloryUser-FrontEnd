import { SET_DEST, SET_ORIGIN, SET_CURRENT_LOCATION, SET_MARKERS } from "../../reducers/MAPReducer";

export const setDestination = (txt,lat,lng) => ({
    type:SET_DEST,
    payload:{
            text:txt,
            coords:{
                lat:lat,
                lng:lng
            },
            set:true
    }
})


export const setOrigin = (txt,lat,lng) => ({
    type:SET_ORIGIN,
    payload:{
            text:txt,
            coords:{
                lat:lat,
                lng:lng
            },
            set:true
    }
})


export const setLocation = (lat,lng) => ({
    type:SET_CURRENT_LOCATION,
    payload:{lat,lng}
})


export const setMarkers = (list) => ({
    type:SET_MARKERS,
    payload:list
})

