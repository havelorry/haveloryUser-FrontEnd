import React from "react"
import {Text, StyleSheet,View,TouchableOpacity} from "react-native"

const style = StyleSheet.create({
	headline:{
		width:'100%',
		fontFamily:'GothamBold',
		fontWeight:'bold',
		fontSize:25,
		color:'#000',
		textAlign:'left'
	},
	subtitle:{
		width:'100%',
		fontFamily:'GothamMedium',
		fontSize:15,
		textAlign:'left',
		color:'#222'
	},

})

const  Content = (props) => <Text style ={[props.type=="basic"?style.subtitle:style.headline,{
	textAlign:props.align?props.align:'left'
}]}>
	{props.children}
</Text>

const Link = (props) => <TouchableOpacity onPress={props.onPress}>
	<Text style={{color:'#8a2be2'}}>
		{props.children}
	</Text>
</TouchableOpacity>

const LargeSpace = (props) => <View style={{width:'100%',height:20}}></View>

export {
	Content,
	LargeSpace,
	Link
} 




