import React from"react"
import {Modal,TouchableOpacity,View} from 'react-native'
import {Icon} from "react-native-vector-icons/FontAwesome"

const modelCloseStyles ={

}

const  AppModel = (props) => <View style={{marginTop: 22}}>
        <Modal
            animationType="slide"
            transparent={false}
            visible={props.visible}
            onRequestClose={() => {
            }}>
    
    <Icon name={'close'} color={'#000'} size={20}/>
      
      
      
    </Modal>

  </View>


export {
    AppModel
}
