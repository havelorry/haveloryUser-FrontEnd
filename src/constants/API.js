const key = 'AIzaSyDz_VDMBsGjRBG_VtgStOlcb-MIGfPTL58'

export const formatQuery = (query) => `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${query}&inputtype=textquery&fields=photos,formatted_address,name,opening_hours,rating&locationbias=circle:2000@47.6918452,-122.2226413&key=${key}`

export const APP_URL = 'https://havelorryapp.herokuapp.com/'
