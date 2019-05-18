import {takeLatest,put,call} from "redux-saga/effects"
import axios from "axios"
import {API_CALL_FAILURE,API_CALL_SUCCESS,API_CALL_REQUEST} from "./../reducers/APIReducer"
import {request} from './../mock/mockApi'

export function* watcherSaga(){
    yield takeLatest("API_CALL_REQUEST",workerSaga)
}

function fetch(){
    return request(1200,false)
}

export function* workerSaga(){
    try {
        const response = yield  call(fetch)
        const data = response.data
        yield put({type:"API_CALL_SUCCESS",data})
    } catch (error) {
        yield put({type:"API_CALL_FAILURE",error})
    }
}


