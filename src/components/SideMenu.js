import React from "react"
import {View,Image} from "react-native"
import {Link,Space} from "./ButtonGroup"
import {DrawerItems} from "react-navigation"
import {Content} from "./text"
export default class SideMenu extends React.Component {
    render(){
        return <View>
                    <View 
                        style={{
                            backgroundColor: '#fff',
                            width:'100.3%',
                            height: 180,
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderBottomColor:'#eee',
                            borderWidth:1
                        }}

                    >
                        <Image 
                            source={require('./../assets/avatar.png')}
                            style ={{
                                width:80,
                                height:80,
                                borderRadius:50
                            }}
                        />

                        <Space/>    
                            <Content type={'heading'} align={'center'}>
                                {this.props.title || 'Prabhanshu'}
                            </Content>    
                        <Space/>

                        <Link isUnderlined={false} color={'#8a2be2'} onPress={this.props.onPress}>
                        View Profile
                        </Link>    
                    </View>
                    <DrawerItems {...this.props} />

        </View> 

    }
} 