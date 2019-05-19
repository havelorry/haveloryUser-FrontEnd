import {combineReducers} from "redux"
import APIReducer from "./APIReducer"
import MAPReducer from "./MAPReducer"

export default combineReducers({
    network:APIReducer,
    map:MAPReducer
})

