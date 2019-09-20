import {types} from "mobx-state-tree"

import {
    formatCoordinates,
    formatQuery,
    placeIdToCoordinates,
    APP_URL
  } from './../constants/API'

  
const Address = types.model({
     description:"",
     id:""   
}) 

const SuggessionStore = types.model({
    values:types.optional(types.array(Address),[]),
    loading:false,
    finished:false,
    processing:false
}).actions(self=>({
    addSuggessions(suggessions){
        self.values = suggessions
    },
    setLoading(l){
        self.loading = l
    },
    setFinished(f){
        self.finished = f
    },
    setProcessing(sp){
        self.processing = sp
    },
    clear(){
        self.values = []
    }
}))


 export const Suggession = SuggessionStore.create({
     values:[]
 })