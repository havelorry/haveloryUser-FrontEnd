import {combineReducers} from "redux"
import APIReducer from "./APIReducer"
import MAPReducer from "./MAPReducer"
import ProfileReducer from "./ProfileReducer"
export default combineReducers({
    network:APIReducer,
    map:MAPReducer,
    profile:ProfileReducer
})

