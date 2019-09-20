import React from "react"
import {TextInput,Text,View,Image,TouchableOpacity} from "react-native"

const image = require('./../assets/images/country.png')

const viewStyles = {
	borderRadius:10,
	borderWidth:2,
	borderColor:'#ccd',
	flexDirection:'row',
	alignItems:'center',
	width:'100%',
	height:58
}

const txtStyles = {
	fontSize:17,
	color:'#000',
	paddingLeft:15
}

const Separator = () => <View style={{width:1,height:'100%',borderWidth:1, borderColor:'#ccc'}}></View>

const CompoundInput = (props) => <View style={{...viewStyles}}>
	<TouchableOpacity onPress={props.onPress} style={{padding:10}}>
		 <Image
          style={{width: 25, height: 20}}
          source={image}
        />
	</TouchableOpacity>	
	<Separator />
	<Text style={{...txtStyles}}>
	  {props.code}
	</Text>
	
	<View style={{width:10}}/>

	<TextInput  style={{flex:1,fontSize:17,color:'#000'}} keyboardType="numeric" maxLength={10} onChangeText ={
		(v) => props.onChange(v)
	}/>


</View>

export {
	CompoundInput
}