import React,{useEffect,useState} from "react"
import { AsyncStorage } from "react-native";
import { values } from "mobx";
const NavigationContext = React.createContext()

export const NavigationContextConsumer = NavigationContext.Consumer

export function NavigationContextProvider(props){

    const [displayName, setDisplayName] = useState("")
    const [profilePic, setProfilePic] = useState("")

    useEffect(() => {
        AsyncStorage.multiGet(['firstName','profilePic']).then(
            values => {
                const [d,p] = values
                setProfilePic(p[1] || "")
                setDisplayName(d[1] || "")
            }
        )
    }, ['displayName','profilePic'])

    console.log(profilePic[1])

    return <NavigationContext.Provider value={{displayName,profilePic,setDisplayName,setProfilePic}}>
        {props.children}
    </NavigationContext.Provider>
}