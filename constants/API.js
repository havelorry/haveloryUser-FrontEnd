const key = 'AIzaSyBr5l3dKJUAhCzdG4-c9l-nbyTrGdY0er8'
const host = 'http://167.71.192.77'

  
export const formatQuery = (query) => `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${query}&key=${key}&sessiontoken=1234567890`

const debug_App = true
const debug_app_url = `${host}:3000/`
export const APP_URL = debug_App?debug_app_url:'https://havelorryapp.herokuapp.com/'

export const formatCoordinates = ({latitude,longitude}) =>{
  console.log('================FORMATTING COORDINATES====================');
  console.log({latitude,longitude});
  console.log('====================================');
  return `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${key}`
}

export const placeIdToCoordinates = (placeId) => 
                                    `https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeId}&key=${key}`

const debug = true
const debugUrl = `${host}:4000`
export const MAIN_API = debug ? debugUrl :'http://have-drivers.herokuapp.com'

export const FetchDirections = (startLoc,destinationLoc) => `https://maps.googleapis.com/maps/api/directions/json?origin=${ startLoc }&destination=${ destinationLoc }&key=${key}`

export const RideStatus = `${MAIN_API}/driver/rides/`
export const HistoryUrl = `${MAIN_API}/driver/rides/`
export const riderHistory = (id) => `${MAIN_API}/driver/history/?identifier=${id}&by=customer`

export const driverUrl = ({latitude,longitude}) => `${MAIN_API}/driver/active_drivers?lat=${latitude}&lng=${longitude}`

export const TOKEN_URL = `${MAIN_API}/driver/alerts/`

const configureFetch = config => url => {
    return new Promise((resolve,reject)=>{
      fetch(url,config).then(js => js.json())
                       .catch(err => reject(err))
                       .then(json => resolve(json)) 
    }); 
  }
 

export const profileURL = `${APP_URL}api/profile/`  
  
export const SOCK_URL = `${MAIN_API}/driver/notifications/`

  const defaultConfig = {
    method:'post',
    headers:{
      'Content-Type':'application/json'
    }
  }
  
  export const Post = (url,data, extraConfig = {}) => configureFetch({
    ...defaultConfig,
    ...extraConfig,
    body:JSON.stringify(data)
  })(url)
  
export const Get = (url, extraConfig={}) => configureFetch({
    ...defaultConfig,
    ...extraConfig,
    method:'get'
  })(url)
  
