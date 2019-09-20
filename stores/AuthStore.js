import {
    observable, computed, action
} from 'mobx'

import {Notifications} from "expo"
import {AsyncStorage} from 'react-native'

import {
    APP_URL,
    Get,
    Post,
    MAIN_API
} from './../constants/API'

const TOKEN_URL = `${MAIN_API}/driver/alerts`

const processDeviceToken = async (username) => {
    try {
        const token = await Notifications.getExpoPushTokenAsync()
        const identification = "user" 
        const response = await fetch(TOKEN_URL,{
            method:'post',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                username,token,identification
            })
        })
        
        const j = await response.json()
        console.log(j)
        return devToken
    } catch (error) {
        return error.message
    }
}

class Auth{

    @observable phone = null
    @observable otp = null
    @observable isLoggedIn = false
    @observable error = ""
    @observable inProgress = false
    constructor(json){

        this.phone = json.phone || ""
        this.otp = json.otp || ""
        this.isLoggedIn = json.isLoggedIn || ""
    }



    @action checkLogin(token){
        AsyncStorage.getItem('token').then(token => 
            {
                if (token) {
                    this.isLoggedIn = true
                }else{
                    this.isLoggedIn = false
                }
            }).catch(err => 
                {
                    this.error = err.message
                    console.log(err)
                })
    }


    @action doLogin(phone,callback){
        this.inProgress =true
        const url = APP_URL+"api/login/"
        if (phone.length ==10) {
            
            Post(`${APP_URL}api/login/`,{phone}).then(
                res => {
                    console.log('logging in')
                    const {token = null, expiry=null} = res
                    if (token && expiry) {
                        AsyncStorage.setItem('token',token).then(
                            ()=> AsyncStorage.setItem('expiry',expiry).then(
                                () => {
                                    AsyncStorage.setItem('username',phone).then(
                                        ()=>{
                                            
                                            this.inProgress = false
                                            processDeviceToken(phone).then(devToken => {
                                                callback({...res,username:phone})
                                            }).catch(err => {
                                                console.log(err)
                                                callback({...res,username:phone})
                                            })
                                            
                                        }
                                    )
                                }
                            )
                        )
                    } else {
                        this.error = 'No account exits for this number'
                        this.inProgress = false
                    }
                }
            ).catch(err => {
                this.inProgress = false
            })
            

        } else {
            this.error = 'Phone number not valid'
            this.inProgress = false
        }
    }


    @action doRegister(json, callback, errCallback){
        this.inProgress = true
        if (json != null) {

            Post(`${APP_URL}api/register/`,{...json}).then(
                res => {
                    this.inProgress = false
                    callback(res)
                }
            ).catch(err => {
                this.inProgress = false
                errCallback(err)
            })

        } else {
            this.error = 'Phone number not valid'
        }
    }

    @action doValidate(phone,callback){
        this.inProgress = true
        if (phone.length == 10) {
            Post(`${APP_URL}api/validate/`,{phone}).then(callback)
        }else{
            this.error = true
            this.error = `Phone Number Invalid`
            this.inProgress =false
        }
    }

    @action doVerify(data,callback, errCallback){
        this.inProgress = true
        if (data.otp) {
            Post(`${APP_URL}api/verify_otp/`,{
                ...data
            }).then(
                (res) => {
                    this.inProgress = false
                    callback(res)
                }
            )
            .catch(
                (err) => {
                    this.inProgress = false
                    this.error = err.message
                    errCallback(err)
                }
            )
        } else {
            this.error = true
            this.error = `Pin should be 6 digit in length`
        }
    }

    @computed get hasError(){
        return this.error.length > 0 ? true :false;
    }

    @action reset(){
        this.error = ""
        this.error = false
    }

}

export default new Auth({
    phone:"",
    otp:"",
    isLoggedIn:false
})

