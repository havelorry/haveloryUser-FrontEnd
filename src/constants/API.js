const key = 'AIzaSyDz_VDMBsGjRBG_VtgStOlcb-MIGfPTL58'


export const formatQuery = (query) => `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${query}&key=${key}&sessiontoken=1234567890`

export const APP_URL = 'https://havelorryapp.herokuapp.com/'

export const formatCoordinates = ({latitude,longitude}) =>
                                    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${key}`

export const placeIdToCoordinates = (placeId) => 
                                    `https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeId}&key=${key}`